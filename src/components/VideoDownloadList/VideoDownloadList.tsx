import React from "react";
import VideoDownload from "../VideoDownload";
import { ExtractedVideo } from "@/types";
import Video from "../Video";
import useVideoCtx from "@/hooks/useVideoCtx";
import styles from "./VideoDownloadList.module.css";

interface VideoDownloadListProps {
  videoData: ExtractedVideo | Array<ExtractedVideo>;
}

const VideoDownloadList = ({ videoData }: VideoDownloadListProps) => {
  
  const {hideVideo, isVisible, src, videoProps} = useVideoCtx();
  return (
    <div className={styles["download-list"]}>
      {Array.isArray(videoData) &&
        videoData.map((video) => (
          <VideoDownload videoData={video} key={video.id} />
        ))}
      {!Array.isArray(videoData) && typeof videoData === "object" && (
        <VideoDownload videoData={videoData} />
      )}
      <Video src={src} isVisible={isVisible} hideVideo={hideVideo} videoProps={videoProps} />
    </div>
  );
};

export default VideoDownloadList;
