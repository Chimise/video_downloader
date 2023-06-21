import React, { useState } from "react";
import { HiPlay } from "react-icons/hi2";
import VideoMenu from "../VideoMenu";
import type { ExtractedVideo } from "@/types";
import styles from "./VideoDownload.module.css";
import Badge from "../Badge";
import useVideoCtx from "@/hooks/useVideoCtx";

interface VideoDownloadProps {
  videoData: ExtractedVideo;
}

const VideoDownload = ({ videoData }: VideoDownloadProps) => {
  const [currentFormat, setCurrentFormat] = useState(videoData.formats[0]);
  const { showVideo } = useVideoCtx();


  return (
    <div className={styles["download"]}>
      <div className={styles["thumbnail-wrapper"]}>
        {videoData.thumbnail && (
          <img
            src={videoData.thumbnail}
            className={styles["thumbnail"]}
            alt={videoData.title}
          />
        )}
        <div className={styles["overlay"]}>
          <button
            className={styles["play-btn"]}
            onClick={() =>
              showVideo(currentFormat.url, {
                autoplay: true,
                controls: true,
                responsive: true,
                fluid: true,
                sources: [
                  {
                    src: currentFormat.url,
                    type: `video/${currentFormat.ext}`,
                  },
                ],
              })
            }
          >
            <HiPlay className={styles["play-icon"]} />
          </button>
        </div>
      </div>
      <div className={styles["main-content"]}>
        <div>
          <h6 className={styles["main-title"]}>{videoData.title}</h6>
          <div className={styles.badges}>
            <Badge>{currentFormat.quality}</Badge>
            <Badge>{currentFormat.ext}</Badge>
          </div>
        </div>
        <div className={styles["download-actions"]}>
          <div>
            <a
              className={styles["download-btn"]}
              href={`/api/downloads?${new URLSearchParams({url: currentFormat.url, ext: currentFormat.ext}).toString()}`}
              target="_blank"
            >
              Download
            </a>
          </div>
          <div>
            <VideoMenu
              formats={videoData.formats}
              onChange={setCurrentFormat}
              value={currentFormat}
              title="Quality"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDownload;
