import { NextApiRequest, NextApiResponse } from "next";
import LinkedInExtractor from "@/extractors/linkedin";
import { getMediaMetaData } from "@/controllers/media";


export default getMediaMetaData(LinkedInExtractor);