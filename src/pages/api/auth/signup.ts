import { SignUpValidator } from "@/types/authValidation";
import { ApiError, apiHandler } from "@/utils/api";
import { User } from "@/utils/database";
import { NextApiRequest, NextApiResponse } from "next";
import { Op, col, fn } from "sequelize";
import { object } from "yup";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { getJWTPrivateKey } from "@/utils/jwt-keys";
import { HttpStatusCode } from "axios";

async function POST(req: NextApiRequest, res: NextApiResponse) {
    const body = await object(SignUpValidator).validate(req.body);
    
    var userByUsername = await User.findOne({
        attributes: ["username"],
        where: {
            username: body.user
        }
    });

    if (userByUsername) throw new ApiError("Username is already in use", HttpStatusCode.BadRequest);

    var userByEmail = await User.findOne({
        attributes: ["email"],
        where: {
            email: body.email
        }
    });

    if (userByEmail) throw new ApiError("Email is already in use", HttpStatusCode.BadRequest);

    var id = crypto.randomInt(281474976710655);

    var salt = crypto.randomBytes(8);
    var hash = crypto.createHash("sha512").update(body.pass).update(salt).digest();

    await User.build({
        id,
        email: body.email,
        username: body.user,
        salt,
        hash,
        loginAttemptNext: 0
    }).save();

    var jwtid = crypto.randomBytes(8).toString("hex");
    var refreshJWT = jwt.sign({sub: id}, getJWTPrivateKey(), {algorithm: 'RS256', expiresIn: "1d", jwtid});
    var resourceJWT = jwt.sign({sub: id}, getJWTPrivateKey(), {algorithm: 'RS256', expiresIn: "2.5m"});

    res.status(200).json({
        refresh_token: refreshJWT,
        resource_token: resourceJWT
    });
}

export default apiHandler({POST});