import React from "react";
import { Menu, Transition } from "@headlessui/react";
import type { VideoProp } from "@/types";
import cn from "classnames";
import styles from "./VideoMenu.module.css";
import { HiChevronDown } from "react-icons/hi2";

interface VideoSelectProps {
  formats: VideoProp[];
  onChange: React.Dispatch<React.SetStateAction<VideoProp>>;
  value: VideoProp;
  title: string;
}

const isCurrent = (value: VideoProp, format: VideoProp) => {
  return value.quality === format.quality;
};

const VideoMenu = ({ formats, onChange, value, title }: VideoSelectProps) => {
  return (
    <Menu as="div" className={styles.menu}>
      <div>
        <Menu.Button className={styles["menu-btn"]}>
          <span>{title}</span>
          <HiChevronDown className={styles['btn-icon']} />
        </Menu.Button>
        <Transition
          enter={styles["options-enter"]}
          enterFrom={styles["options-enter_from"]}
          enterTo={styles["options-enter_to"]}
          leave={styles["options-leave"]}
          leaveFrom={styles["options-leave_from"]}
          leaveTo={styles["options-leave_to"]}
        >
          <Menu.Items className={styles.options}>
            <div>
              {formats.map((format) => (
                <Menu.Item key={format.url}>
                  {({ active }) => (
                    <button
                      className={cn(
                        styles["option"],
                        { [styles["option_active"]]: active },
                        {
                          [styles["option_notactive"]]:
                            !active && !isCurrent(value, format),
                        },
                        {
                          [styles["option_current"]]:
                            !active && isCurrent(value, format),
                        }
                      )}
                      onClick={() => onChange(format)}
                    >
                      {format.quality}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  );
};

export default VideoMenu;
