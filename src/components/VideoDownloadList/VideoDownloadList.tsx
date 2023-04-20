import React from "react";
import VideoDownload from "../VideoDownload";
import { ExtractedVideo } from "@/types";
import styles from "./VideoDownloadList.module.css";

interface VideoDownloadListProps {
  videoData: ExtractedVideo | Array<ExtractedVideo>;
}

const VideoDownloadList = ({ videoData }: VideoDownloadListProps) => {
  return (
    <div className={styles["download-list"]}>
      {Array.isArray(videoData) &&
        videoData.map((video) => (
          <VideoDownload videoData={video} key={video.id} />
        ))}
      {!Array.isArray(videoData) && typeof videoData === "object" && (
        <VideoDownload videoData={videoData} />
      )}
    </div>
  );
};

export default VideoDownloadList;
