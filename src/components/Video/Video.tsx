import React, { useRef, useEffect, Fragment } from "react";
import videojs from "video.js";
import { Transition, Dialog } from "@headlessui/react";
import cn from 'classnames';
import styles from "./Video.module.css";


interface VideoProps {
  src: string;
  hideVideo: () => void;
  isVisible: boolean;
  videoProps: Record<string, any>;
}

const VideoPlayer = ({
  src,
  videoProps,
}: Omit<VideoProps, "hideVideo"|"isVisible">) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReturnType<typeof videojs>>();

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered", "vjs-16-9");
      videoRef.current?.appendChild(videoElement);

      const player = (playerRef.current = videojs(
        videoElement,
        { src, ...videoProps },
        () => {
          typeof videoProps.onReady === "function" &&
            videoProps.onReady(player);
        }
      ));
      player.play();
    } else {
      const player = playerRef.current;
      player.src(videoProps.sources || src);
      player.play();
    }
  }, [videoRef, src, videoProps]);

  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = undefined;
      }
    };
  }, [playerRef]);

  return <div className={cn(styles["video"])} ref={videoRef} />;
};


const Video = ({ src, isVisible, hideVideo, videoProps }: VideoProps) => {
  return (
    <Transition as={Fragment} show={isVisible}>
      <Dialog as="div" className={styles["video-dialog"]} onClose={hideVideo}>
        <Transition.Child
          as={Fragment}
          enter={styles["overlay-enter"]}
          enterFrom={styles["overlay-enter_from"]}
          enterTo={styles["overlay-enter_to"]}
          leave={styles["overlay-leave"]}
          leaveFrom={styles["overlay-leave_from"]}
          leaveTo={styles["overlay-leave_to"]}
        >
          <div className={styles["video-overlay"]} />
        </Transition.Child>
        <div className={styles["video-wrapper"]}>
          <div className={styles["video-container"]}>
            <Transition.Child
              as={Fragment}
              enter={styles["dialog-enter"]}
              enterFrom={styles["dialog-enter_from"]}
              enterTo={styles["dialog-enter_to"]}
              leave={styles["dialog-leave"]}
              leaveFrom={styles["dialog-leave_from"]}
              leaveTo={styles["dialog-leave_to"]}
            >
              <Dialog.Panel className={styles["video-panel"]}>
                <VideoPlayer
                  src={src}
                  videoProps={videoProps}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Video;
