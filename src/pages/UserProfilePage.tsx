import { useSearchParams } from "react-router-dom";

const UserProfilePage = () => {
  const [params] = useSearchParams();

  const name  = params.get("name") || "Bilinmeyen Kullanıcı";
  const email = params.get("email") || "";

  let cars: { plate: string; brand: string; model: string; isDefault: boolean }[] = [];
  try {
    const raw = params.get("cars");
    if (raw) cars = JSON.parse(decodeURIComponent(raw));
  } catch {
    cars = [];
  }

  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: "#212529",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "2rem 1rem 4rem",
      color: "#f1f5f9",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* BRAND */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.04em",
            color: "#f7db23",
            textShadow: "0 2px 12px rgba(247,219,35,0.18)",
          }}>
            OtoKimin
          </div>
          <div style={{ color: "#f7db23", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "0.2rem", fontWeight: 600 }}>
            Kullanıcı Profili
          </div>
        </div>

        {/* PROFILE CARD */}
        <div style={{
          background: "#212529", border: "1px solid #f7db23",
          borderRadius: 20, padding: "1.75rem 1.5rem", marginBottom: "1rem",
        }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%",
              background: "#f7db23",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.4rem", fontWeight: 700, color: "#212529", flexShrink: 0,
              boxShadow: "0 2px 12px rgba(247,219,35,0.18)",
            }}>
              {initials || "?"}
            </div>
            <div>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "-0.02em" }}>{name}</div>
              <div style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.15rem" }}>{email}</div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.3rem",
                background: "rgba(16,185,129,0.12)", color: "#10b981",
                border: "1px solid rgba(16,185,129,0.25)", borderRadius: 20,
                fontSize: "0.72rem", fontWeight: 600, padding: "0.2rem 0.6rem",
                marginTop: "0.5rem", letterSpacing: "0.05em",
              }}>
                ✓ Doğrulanmış Üye
              </div>
            </div>
          </div>

          {/* Cars */}
          <div style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f7db23", marginBottom: "0.75rem" }}>
            Kayıtlı Araçlar
          </div>

          {cars.length > 0 ? cars.map((car, i) => (
            <div key={i} style={{
              background: "#212529", border: "1px solid #f7db23",
              borderRadius: 14, padding: "0.9rem 1rem", marginBottom: "0.6rem",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1rem", fontWeight: 500, letterSpacing: "0.05em" }}>
                  {car.plate || "-"}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "0.15rem" }}>
                  {car.brand} {car.model}
                </div>
              </div>
              {car.isDefault && (
                <span style={{
                  background: "#f7db23",
                  color: "#212529",
                  border: "1px solid #f7db23",
                  borderRadius: 10,
                  fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.55rem",
                  boxShadow: "0 1px 6px rgba(247,219,35,0.10)",
                }}>
                  Varsayılan
                </span>
              )}
            </div>
          )) : (
            <div style={{ color: "#f7db23", fontSize: "0.875rem", textAlign: "center", padding: "1rem 0" }}>
              Kayıtlı araç bulunamadı
            </div>
          )}
        </div>

        {/* APP BUTTONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1.5rem" }}>
          {/* iOS için: Uygulama varsa aç, yoksa App Store'a yönlendir */}
          <a
            href="otokimin://open"
            onClick={e => {
              e.preventDefault();
              window.location.href = "otokimin://open";
              setTimeout(() => {
                window.location.href = "https://apps.apple.com/tr/app/otokimin/id123456789";
              }, 1200);
            }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
              padding: "1rem 1.5rem", borderRadius: 16, fontWeight: 700, fontSize: "0.95rem",
              textDecoration: "none", color: "#fff",
              background: "#000",
              border: "1px solid #000",
              boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <g>
                <path d="M17.564 13.406c-.02-2.045 1.668-3.025 1.744-3.07-0.951-1.39-2.426-1.582-2.946-1.602-1.252-.127-2.444.73-3.08.73-.636 0-1.617-.713-2.663-.693-1.37.02-2.637.797-3.34 2.027-1.426 2.47-.364 6.12 1.022 8.12.676.98 1.48 2.08 2.54 2.04 1.025-.04 1.41-.66 2.65-.66 1.24 0 1.58.66 2.66.64 1.1-.02 1.79-1 2.46-1.98.78-1.13 1.1-2.23 1.12-2.29-.025-.012-2.15-.825-2.17-3.28zm-2.57-6.01c.56-.68.94-1.62.84-2.56-.81.03-1.78.54-2.36 1.22-.52.6-.98 1.56-.81 2.48.86.07 1.77-.49 2.33-1.14z" fill="#fff"/>
              </g>
            </svg>
            App Store'dan Aç / İndir
          </a>

          {/* Android için: Uygulama varsa aç, yoksa Play Store'a yönlendir */}
          <a
            href="intent://open#Intent;scheme=otokimin;package=com.otokimin;end"
            onClick={e => {
              e.preventDefault();
              window.location.href = "intent://open#Intent;scheme=otokimin;package=com.otokimin;end";
              setTimeout(() => {
                window.location.href = "https://play.google.com/store/apps/details?id=com.happencode.otokimin&hl=tr";
              }, 1200);
            }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
              padding: "1rem 1.5rem", borderRadius: 16, fontWeight: 700, fontSize: "0.95rem",
              textDecoration: "none", color: "#212529",
              background: "#fff",
              border: "1px solid #43e97b",
              boxShadow: "0 4px 20px rgba(67,233,123,0.18)",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <g>
                <path d="M3.6 0.5C2.16 0.5 1 1.66 1 3.1v17.8c0 1.44 1.16 2.6 2.6 2.6 0.52 0 1.04-0.16 1.48-0.44l12.36-7.18-2.93-2.93L3.6 0.5z" fill="#34A853"/>
                <path d="M20.4 10.3l-2.87-1.66-3.22 3.22 3.22 3.21 2.87-1.66a1.74 1.74 0 0 0 0-3.11z" fill="#4285F4"/>
                <path d="M13.1 11.1l-3.03-4.01L17.44 6.73l-4.34 4.37z" fill="#FBBC05"/>
                <path d="M3.6 23.5c0.52 0 1.04-0.16 1.48-0.44l12.36-7.18-2.93-2.93L3.6 23.5z" fill="#EA4335"/>
              </g>
            </svg>
            Google Play'den Aç / İndir
          </a>
        </div>

        <div style={{ textAlign: "center", color: "#f7db23", fontSize: "0.75rem", marginTop: "2rem", lineHeight: 1.6, fontWeight: 600 }}>
          Bu sayfa OtoKimin uygulamasına ait QR koddan açılmıştır.<br />
          Uygulamayı indirerek araçlarınızı yönetebilirsiniz.
        </div>

      </div>
    </div>
  );
};

export default UserProfilePage;