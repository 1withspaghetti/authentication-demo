import { apiHandler } from "@/utils/api";
import { TokenBlacklist } from "@/utils/database";
import { verifyRefreshJWT } from "@/utils/jwt";
import { NextApiRequest, NextApiResponse } from "next";

async function GET(req: NextApiRequest, res: NextApiResponse) {
    var {userId, jwtId, expires} = verifyRefreshJWT(req.headers.authorization);
    
    await TokenBlacklist.create({id: Buffer.from(jwtId, "hex"), expires: new Date(expires)});

    res.status(200).json({success: true});
}

export default apiHandler({GET});