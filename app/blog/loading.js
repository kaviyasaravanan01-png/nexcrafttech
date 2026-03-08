export default function BlogLoading() {
  const p = {
    background: "linear-gradient(90deg, rgba(201,169,110,0.04) 25%, rgba(201,169,110,0.1) 50%, rgba(201,169,110,0.04) 75%)",
    backgroundSize: "200% 100%",
    animation: "skeletonShimmer 1.5s ease-in-out infinite",
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes skeletonShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }` }} />
      <section style={{ minHeight: "100vh", paddingTop: "8rem", paddingBottom: "4rem", background: "#09090b" }}>
        <div style={{ maxWidth: "64rem", marginLeft: "auto", marginRight: "auto", padding: "0 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ ...p, width: 120, height: 12, borderRadius: 6, margin: "0 auto 1rem" }} />
            <div style={{ ...p, width: 280, height: 28, borderRadius: 8, margin: "0 auto 0.75rem" }} />
            <div style={{ ...p, width: 200, height: 14, borderRadius: 6, margin: "0 auto" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ borderRadius: 14, overflow: "hidden", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ ...p, width: "100%", height: 180 }} />
                <div style={{ padding: "1.25rem" }}>
                  <div style={{ ...p, width: 60, height: 10, borderRadius: 4, marginBottom: 10 }} />
                  <div style={{ ...p, width: "90%", height: 16, borderRadius: 6, marginBottom: 8 }} />
                  <div style={{ ...p, width: "70%", height: 16, borderRadius: 6, marginBottom: 12 }} />
                  <div style={{ ...p, width: "100%", height: 10, borderRadius: 4, marginBottom: 6 }} />
                  <div style={{ ...p, width: "80%", height: 10, borderRadius: 4, marginBottom: 16 }} />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ ...p, width: 70, height: 10, borderRadius: 4 }} />
                    <div style={{ ...p, width: 50, height: 10, borderRadius: 4 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
