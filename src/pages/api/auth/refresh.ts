import { apiHandler } from "@/utils/api";
import { createJWTPair, verifyRefreshJWT } from "@/utils/jwt";
import { NextApiRequest, NextApiResponse } from "next";

async function GET(req: NextApiRequest, res: NextApiResponse) {
    var {userId, jwtId} = verifyRefreshJWT(req.headers.authorization);

    var tokenPair = await createJWTPair(userId, jwtId);

    res.status(200).json(tokenPair);
}

export default apiHandler({GET});