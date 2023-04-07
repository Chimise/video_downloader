import React from "react";
import cn from "classnames";
import styles from "./Container.module.css";

type ContainerSizes = "sm" | "md" | "lg";

type Props<E extends React.ElementType> = ContainerProps<E> &
  Omit<React.ComponentPropsWithoutRef<E>, keyof ContainerProps<E>>;

type ContainerProps<E extends React.ElementType> = {
  children: React.ReactNode;
  className?: string;
  size?: ContainerSizes;
  as?: E;
};

const Container = <E extends React.ElementType = "div">({
  className,
  children,
  size = "lg",
  as,
  ...props
}: Props<E>) => {
  const Element = as || "div";

  return (
    <Element
      className={cn(styles.container, styles[`container-${size}`], className)}
      {...props}
    >
      {children}
    </Element>
  );
};

export default Container;
