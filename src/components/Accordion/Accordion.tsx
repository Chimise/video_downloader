import React, { Fragment } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { HiChevronDown } from "react-icons/hi2";
import cn from "classnames";
import styles from "./Accordion.module.css";
import Container from "../Container";

interface AccordionProps {
  title: string;
  content: React.ReactNode;
  className?: string;
}

const Accordion = ({ className, title, content }: AccordionProps) => {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <div className={className}>
            <Container as={Disclosure.Button} className={styles["accordion-btn"]}>
                <span>{title}</span>
                <HiChevronDown
                  className={cn(styles["accordion-icon"], {
                    [styles["accordion-icon_open"]]: open,
                    [styles["accordion-icon_close"]]: !open,
                  })}
                />
            </Container>
            <Transition
              show={open}
              as={Fragment}
              enter={styles["panel-enter"]}
              enterFrom={styles["panel-enter-from"]}
              enterTo={styles["panel-enter-to"]}
              leave={styles["panel-leave"]}
              leaveFrom={styles["panel-leave-from"]}
              leaveTo={styles["panel-leave-to"]}
            >
              <Disclosure.Panel static className={styles["accordion-panel"]}>
                <Container>{content}</Container>
              </Disclosure.Panel>
            </Transition>
          </div>
        </>
      )}
    </Disclosure>
  );
};

export default Accordion;
