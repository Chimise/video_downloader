import { useContext } from "react";
import VideoContext from "@/store/VideoContext";

const useVideoCtx = () => {
    const ctx = useContext(VideoContext);
    if(!ctx) {
        throw new Error('Context does not exist yet');
    }

    return ctx;
}

export default useVideoCtx;