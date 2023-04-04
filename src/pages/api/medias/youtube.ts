import { NextApiRequest, NextApiResponse } from "next";
import YoutubeExtractor from "@/extractors/youtube";
import { getMediaMetaData } from "@/controllers/media";


export default getMediaMetaData(YoutubeExtractor);