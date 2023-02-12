import { NextApiRequest, NextApiResponse } from "next"
import { uploadImage } from "../../server/api/utils/funcs"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        res.status(200).json(await uploadImage(req.body.image))
    } catch (error) {
        res.status(500).json(error)
    }
}