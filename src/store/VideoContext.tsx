import React, { createContext, useReducer, useMemo, useCallback } from "react";

interface State {
  src: string;
  isVisible: boolean;
  srcObject?: string;
  videoProps: Record<string, any>;
}

interface VideoContextI extends State {
  showVideo: (src: string, props?: object) => void;
  hideVideo: () => void;
}

type Actions =
  | { type: "SHOW_PLAYER"; payload: { src: string; props: object } }
  | { type: "HIDE_PLAYER" };

// Create a react context
const VideoContext = createContext<VideoContextI | null>(null);

// Create an initial state
const initialState: State = {
  src: "",
  isVisible: false,
  videoProps: {},
};

// Reducer function to be used in the useReducer
const reducer = (state: State, actions: Actions): State => {
  switch (actions.type) {
    case "SHOW_PLAYER":
      return {
        ...state,
        src: actions.payload.src,
        isVisible: true,
        videoProps: {
          ...state.videoProps,
          ...(actions.payload.props || {}),
        },
      };
    case "HIDE_PLAYER":
      return {
        ...state,
        isVisible: false,
      };
    default:
      return state;
  }
};

export const VideoContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [videoctx, dispatch] = useReducer(reducer, initialState);

  const showVideo = useCallback((src: string, props: object = {}) => {
    dispatch({
      type: "SHOW_PLAYER",
      payload: {
        src,
        props,
      },
    });
  }, []);

  const hideVideo = useCallback(() => {
    dispatch({ type: "HIDE_PLAYER" });
  }, []);

  const ctx = useMemo(() => {
    return {
      ...videoctx,
      showVideo,
      hideVideo,
    };
  }, [videoctx, showVideo, hideVideo]);

  return <VideoContext.Provider value={ctx}>{children}</VideoContext.Provider>;
};

export default VideoContext;
