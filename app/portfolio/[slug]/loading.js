export default function PortfolioDetailLoading() {
  const p = {
    background: "linear-gradient(90deg, rgba(201,169,110,0.04) 25%, rgba(201,169,110,0.1) 50%, rgba(201,169,110,0.04) 75%)",
    backgroundSize: "200% 100%",
    animation: "skeletonShimmer 1.5s ease-in-out infinite",
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes skeletonShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }` }} />
      <section style={{ minHeight: "100vh", paddingTop: "8rem", paddingBottom: "4rem", background: "#09090b" }}>
        <div style={{ maxWidth: "56rem", marginLeft: "auto", marginRight: "auto", padding: "0 1.5rem" }}>
          <div style={{ ...p, width: 100, height: 12, borderRadius: 4, marginBottom: "2rem" }} />
          <div style={{ ...p, width: "100%", height: 360, borderRadius: 14, marginBottom: "2rem" }} />
          <div style={{ ...p, width: "70%", height: 32, borderRadius: 8, marginBottom: 10 }} />
          <div style={{ ...p, width: "40%", height: 14, borderRadius: 6, marginBottom: "1.5rem" }} />
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ ...p, width: 70 + i * 10, height: 24, borderRadius: 12 }} />
            ))}
          </div>
          <div style={{ width: 40, height: 1, background: "rgba(201,169,110,0.15)", marginBottom: "2rem" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2.5rem" }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ padding: "1.25rem", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ ...p, width: 50, height: 10, borderRadius: 4, marginBottom: 8 }} />
                <div style={{ ...p, width: "70%", height: 16, borderRadius: 6 }} />
              </div>
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ ...p, width: `${85 + Math.sin(i) * 12}%`, height: 12, borderRadius: 4, marginBottom: i % 3 === 2 ? 24 : 10 }} />
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "2rem" }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ ...p, width: "100%", height: 180, borderRadius: 12 }} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
