import { LoginValidator } from "@/types/authValidation";
import { ApiError, apiHandler } from "@/utils/api";
import { User } from "@/utils/database";
import type { NextApiRequest, NextApiResponse } from "next";
import { Op } from "sequelize";
import { object } from "yup";
import crypto from 'crypto';
import { HttpStatusCode } from "axios";
import jwt from 'jsonwebtoken';
import { getJWTPrivateKey } from "@/utils/jwt-keys";

async function POST(req: NextApiRequest, res: NextApiResponse) {
    const body = await object(LoginValidator).validate(req.body);

    var user = await User.findOne({
        where: {
            [Op.or]: [{username: body.user}, {email: body.user}]
        }
    })

    if (!user) throw new ApiError("Invalid Username or Email", HttpStatusCode.BadRequest);

    // If over 8 failed password attempts in the last 40 minutes (regenerates at 1 attempt every 5 minutes)
    if (Date.now() < user.loginAttemptNext - (300000 * 8)) throw new ApiError("Maximum password attempts succeeded", HttpStatusCode.TooManyRequests)

    var testHash = crypto.createHash("sha512").update(body.pass).update(user.salt).digest();
    if (!crypto.timingSafeEqual(user.hash, testHash)) {
        user.loginAttemptNext = Math.max(user.loginAttemptNext, Date.now()) + 300000;
        await user.save();
        throw new ApiError("Invalid Password", HttpStatusCode.BadRequest);
    }

    var jwtid = crypto.randomBytes(8).toString("hex");
    var refreshJWT = jwt.sign({sub: user.id}, getJWTPrivateKey(), {algorithm: 'RS256', expiresIn: "1d", jwtid});
    var resourceJWT = jwt.sign({sub: user.id}, getJWTPrivateKey(), {algorithm: 'RS256', expiresIn: "2.5m"});
    
    
    res.status(200).json({
        refresh_token: refreshJWT,
        resource_token: resourceJWT
    });
}

export default apiHandler({POST})