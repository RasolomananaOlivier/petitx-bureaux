declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

export const GA_MEASUREMENT_ID = "G-F1N46C6RRY";

// Log pageviews
export const pageview = (url: string) => {
  if (typeof window !== "undefined") {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Log custom events
export const event = ({
  action,
  params,
}: {
  action: string;
  params?: Record<string, any>;
}) => {
  if (typeof window !== "undefined") {
    window.gtag("event", action, params);
  }
};
