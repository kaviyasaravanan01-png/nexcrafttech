export default function BlogPostLoading() {
  const p = {
    background: "linear-gradient(90deg, rgba(201,169,110,0.04) 25%, rgba(201,169,110,0.1) 50%, rgba(201,169,110,0.04) 75%)",
    backgroundSize: "200% 100%",
    animation: "skeletonShimmer 1.5s ease-in-out infinite",
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes skeletonShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }` }} />
      <section style={{ minHeight: "100vh", paddingTop: "8rem", paddingBottom: "4rem", background: "#09090b" }}>
        <div style={{ maxWidth: "48rem", marginLeft: "auto", marginRight: "auto", padding: "0 1.5rem" }}>
          <div style={{ ...p, width: 80, height: 12, borderRadius: 4, marginBottom: "2rem" }} />
          <div style={{ ...p, width: "100%", height: 320, borderRadius: 14, marginBottom: "2rem" }} />
          <div style={{ ...p, width: "85%", height: 28, borderRadius: 8, marginBottom: 10 }} />
          <div style={{ ...p, width: "60%", height: 28, borderRadius: 8, marginBottom: "1.5rem" }} />
          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ ...p, width: 90, height: 12, borderRadius: 4 }} />
            <div style={{ ...p, width: 70, height: 12, borderRadius: 4 }} />
            <div style={{ ...p, width: 60, height: 12, borderRadius: 4 }} />
          </div>
          <div style={{ width: 40, height: 1, background: "rgba(201,169,110,0.15)", marginBottom: "2rem" }} />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ ...p, width: `${85 + Math.sin(i) * 15}%`, height: 12, borderRadius: 4, marginBottom: i % 3 === 2 ? 24 : 10 }} />
          ))}
          <div style={{ ...p, width: "45%", height: 20, borderRadius: 6, marginTop: "1rem", marginBottom: "1rem" }} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ ...p, width: `${80 + Math.cos(i) * 15}%`, height: 12, borderRadius: 4, marginBottom: 10 }} />
          ))}
        </div>
      </section>
    </>
  );
}
