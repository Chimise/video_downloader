import React, { useState } from "react";
import { HiPlay } from "react-icons/hi2";
import VideoMenu from "../VideoMenu";
import type { ExtractedVideo } from "@/types";
import styles from "./VideoDownload.module.css";
import Badge from "../Badge";

interface VideoDownloadProps {
  videoData: ExtractedVideo;
}

const VideoDownload = ({ videoData }: VideoDownloadProps) => {
  const [currentFormat, setCurrentFormat] = useState(videoData.formats[0]);

  return (
    <div className={styles["download"]}>
        <div className={styles["thumbnail-wrapper"]}>
          {videoData.thumbnail && <img
            src={videoData.thumbnail}
            className={styles["thumbnail"]}
            alt={videoData.title}
          />}
          <div className={styles["overlay"]}>
            <button className={styles["play-btn"]}>
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
                href={currentFormat.url}
                download={`${videoData.id}.${currentFormat.ext}`}
              >
                Download
              </a>
            </div>
            <div>
              <VideoMenu
                formats={videoData.formats}
                onChange={setCurrentFormat}
                value={currentFormat}
                title='Quality'
              />
            </div>
          </div>
        </div>
    </div>
  );
};

export default VideoDownload;
