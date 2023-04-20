import React, {
  InputHTMLAttributes,
  useState,
  ChangeEvent,
  FormEvent,
  Fragment,
} from "react";
import { Transition } from "@headlessui/react";
import cn from "classnames";
import { HiArrowDownTray, HiXMark } from "react-icons/hi2";
import styles from "./VideoSearch.module.css";

interface VideoSearchProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "onSubmit" | "onChange" | "value" | "onBlur"
  > {
  rootClass?: string;
  btnClass?: string;
  onSubmit: (value: string) => Promise<void>;
}

const VideoSearch = ({
  rootClass,
  className,
  btnClass,
  onSubmit,
  type = "search",
  name,
  style = {},
  ...props
}: VideoSearchProps) => {
  const [isTouched, setIsTouched] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<null | string>(null);

  const hasValue = Boolean(value);

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    // Validate value before submitting the form and stop submission on error
    const error = validateUrl(value);
    if (error) {
      // When the form is submitted, set the form state to touched
      if (!isTouched) {
        setIsTouched(true);
      }
      setError(error);
      return;
    }
    await onSubmit(value);
  };

  const validateUrl = (
    value: string,
    errorMessage: string = "Enter a valid URL"
  ) => {
    try {
      new URL(value);
      return null;
    } catch (err) {
      return errorMessage;
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue(value);
    // If the form is already touched, start checking for error on every key stroke
    if (isTouched) {
      const error = validateUrl(value);
      setError(error);
    }
  };

  const handleBlur = () => {
    if (!isTouched) {
      setIsTouched(true);
      setError(validateUrl(value));
    }
  };

  const handleReset = () => {
    setValue("");
    setIsTouched(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(styles["search-form"], rootClass)}
    >
      <input
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn(styles["search-input"], className)}
        type={type}
        autoCapitalize="none"
        autoComplete="on"
        autoCorrect="off"
        name={name || "video-search"}
        value={value}
        style={{paddingRight: hasValue ? '4.8rem': '3rem', ...style}}
        {...props}
      />
      <button type="submit" className={cn(styles["search-button"], btnClass)}>
        <HiArrowDownTray />
      </button>
      <Transition
        enter={styles["error-open"]}
        leave={styles["error-close"]}
        enterFrom={styles["error-open_from"]}
        enterTo={styles["error-open_to"]}
        leaveFrom={styles["error-close_from"]}
        leaveTo={styles["error-close_to"]}
        show={hasValue}
      >
        <button className={styles['reset-button']} type="reset" onClick={handleReset}>
          <HiXMark />
        </button>
      </Transition>
      <Transition
        as={Fragment}
        show={Boolean(isTouched && error)}
        enter={styles["error-open"]}
        leave={styles["error-close"]}
        enterFrom={styles["error-open_from"]}
        enterTo={styles["error-open_to"]}
        leaveFrom={styles["error-close_from"]}
        leaveTo={styles["error-close_to"]}
      >
        <div className={styles["search-error"]}>{error}</div>
      </Transition>
    </form>
  );
};

export default VideoSearch;
