import VideoBackground from "./VideoBackground";

/**
 * Wrapper for all inner portal pages.
 * Provides video2 background with semi-transparent content area.
 */
export default function PageLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <VideoBackground src="/vedio 2.mp4" opacity={0.75} />
      <div style={{ position: "relative", zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}
