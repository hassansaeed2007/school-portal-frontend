/**
 * Reusable video background component with dark overlay.
 * Used on all pages for consistent premium look.
 */
export default function VideoBackground({ src, opacity = 0.55 }) {
  return (
    <>
      <video
        autoPlay muted loop playsInline
        style={{
          position: "fixed", top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "cover", zIndex: 0,
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div style={{
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100%",
        background: `rgba(5, 8, 20, ${opacity})`,
        zIndex: 1,
      }} />
    </>
  );
}
