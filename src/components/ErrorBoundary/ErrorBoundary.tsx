import { Component, ErrorInfo, ReactNode } from "react";
import * as sentry from "@sentry/react";
import styles from "./ErrorBoundary.module.css";

interface State {
  isError: boolean;
  eventId: string;
}

interface Props {
  children: ReactNode;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isError: false,
      eventId: "",
    };
  }

  componentDidMount(): void {
    sentry.init({
      dsn: "https://d239baa3a9914b95b93a0def0556da3f@o4505107716177920.ingest.sentry.io/4505107968229376",
    });
  }

  static getDerivedStateFromError(error: Error): Pick<State, "isError"> {
    console.error(error);
    return { isError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    sentry.withScope((scope) => {
      //@ts-ignore
      scope.setExtras(errorInfo);
      const eventId = sentry.captureException(error);
      this.setState({ eventId });
    });
  }

  render() {
    if (this.state.isError) {
      return (
        <div className={styles.error}>
          <div className={styles['error-wrapper']}>
            <p className={styles['error-msg']}>Oops, An error occured</p>
            <div className={styles['actions']}>
              <button onClick={() => window && window.location.reload()}>
                Reload this page
              </button>
              <button onClick={() => sentry.showReportDialog({eventId: this.state.eventId})}>Report error</button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
