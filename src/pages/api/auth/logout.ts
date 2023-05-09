import { ApiError, apiHandler } from "@/utils/api";
import { TokenBlacklist } from "@/utils/database";
import { verifyRefreshJWT } from "@/utils/jwt";
import { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

async function GET(req: NextApiRequest, res: NextApiResponse) {
    var {userId, jwtId, expires} = verifyRefreshJWT(req.headers.authorization);

    var count = await TokenBlacklist.count({where: {id: Buffer.from(jwtId,'hex')}});
    if (count > 0) throw new ApiError("Invalid Auth Token", HttpStatusCode.Unauthorized);
    
    await TokenBlacklist.create({id: Buffer.from(jwtId, "hex"), expires: (expires * 1000) + 60000});

    res.status(200).json({success: true});
}

export default apiHandler({GET});