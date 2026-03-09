import { Modal } from "react-bootstrap";
import { QRCodeSVG } from "qrcode.react";
import type { IUser } from "../../types/IUser";
import { useRef } from "react";

interface Props {
  show: boolean;
  onClose: () => void;
  user: IUser;
}

const QRModal = ({ show, onClose, user }: Props) => {
  // QR okunduğunda açılacak URL — kendi domain'inize göre güncelleyin
  const cars = user.cars?.length
    ? encodeURIComponent(JSON.stringify(user.cars))
    : "";

  const qrValue = `http://localhost:5173/user-profile?uid=${user.uid}&name=${encodeURIComponent(user.displayName || "")}&email=${encodeURIComponent(user.email || "")}${cars ? `&cars=${cars}` : ""}`;

  const qrRef = useRef<SVGSVGElement>(null);

  const handleDownload = () => {
    const svg = qrRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);
    // Add XML declaration
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www.w3.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    // Orijinal boyutları al
    const widthMatch = source.match(/width="(\d+)"/);
    const origWidth = widthMatch ? parseInt(widthMatch[1], 10) : 200;
    const heightMatch = source.match(/height="(\d+)"/);
    const origHeight = heightMatch ? parseInt(heightMatch[1], 10) : 200;

    // Padding değerleri
    const paddingX = 32; // sağ-sol boşluk
    const paddingTop = 32; // üst boşluk
    const paddingBottom = 40; // alt boşluk (yazı için)
    const newWidth = origWidth + paddingX * 2;
    const newHeight = origHeight + paddingTop + paddingBottom;

    // Orijinal <svg ...> tagını yeni boyutlarla değiştir
    source = source.replace(
      /<svg([^>]*)width="\d+"([^>]*)height="\d+"([^>]*)>/,
      `<svg$1width="${newWidth}"$2height="${newHeight}"$3>`
    );

    // Orijinal içeriği <g transform="translate(x, y)"> ile ortala
    // <svg ...> ile <rect ...> veya <g ...> arasına ekle
    source = source.replace(
      /(<svg[^>]*>)([\s\S]*)(<\/svg>)/,
      (full, open, inner, close) => {
        // Orijinal içeriği bul
        // <g> varsa, sadece <g> içini taşı
        // Yoksa tüm içeriği taşı
        let qrContent = inner;
        // <g ...>...</g> varsa sadece onu al
        const gMatch = inner.match(/<g[\s\S]*<\/g>/);
        if (gMatch) qrContent = gMatch[0];
        // OtoKimin yazısı
        const text = `<text x="${newWidth / 2}" y="${origHeight + paddingTop + 18}" text-anchor="middle" font-size="14" font-family="'DM Sans', Arial, sans-serif" fill="#212529" font-weight="bold">OtoKimin</text>`;
        return (
          open +
          `<g transform="translate(${paddingX},${paddingTop})">` +
          qrContent +
          `</g>` +
          text +
          close
        );
      }
    );

    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `otokimin-qr.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header
        closeButton
        style={{ background: "#212529", borderBottom: "1px solid #1e293b" }}
      >
        <Modal.Title style={{ color: "#f8fafc", fontWeight: 700, letterSpacing: "-0.02em" }}>
          QR Kod
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{
          background: "#212529",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem 1.5rem",
          gap: "1.25rem",
        }}
      >
        {/* Kullanıcı bilgisi */}
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#94a3b8", fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
            Kullanıcı
          </div>
          <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: "1.1rem" }}>
            {user.displayName}
          </div>
          <div style={{ color: "#64748b", fontSize: "0.85rem" }}>{user.email}</div>
        </div>

        {/* QR Kod ve İndir Butonu */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "1.25rem",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 20px 40px rgba(0,0,0,0.4)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative"
            }}
          >
            <QRCodeSVG
              value={qrValue}
              size={320} // Daha büyük QR kod
              level="H" // Yüksek hata toleransı
              includeMargin={true} // Dış boşluk ekle
              ref={qrRef}
            />
            <div style={{ fontSize: 11, color: "#212529", marginTop: 6, fontWeight: 700, letterSpacing: 1 }}>
              OtoKimin
            </div>
          </div>
          <button
            onClick={handleDownload}
            style={{
              marginTop: 10,
              background: "#f7db23",
              color: "#212529",
              border: "none",
              borderRadius: 8,
              padding: "0.5rem 1.2rem",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(247,219,35,0.10)",
              transition: "background 0.2s"
            }}
          >
            İndir
          </button>
        </div>

        <p style={{ color: "#64748b", fontSize: "0.8rem", margin: 0, textAlign: "center" }}>
          QR kodu okutarak kullanıcı profilini ve uygulama indirme linklerini görüntüleyin.
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default QRModal;