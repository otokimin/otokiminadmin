import { useState } from "react";
import type { IAd } from "../../types/ads";
import { PencilSquare } from "react-bootstrap-icons";
import { Modal } from "react-bootstrap";

interface Props {
  ads: IAd[];
  onEdit: (ad: IAd) => void;
}

const AdsList = ({ ads, onEdit }: Props) => {
  const [preview, setPreview] = useState<string | null>(null);

const getStatusStyle = (status: IAd["status"]) => {
  if (status === "active")
    return { backgroundColor: "#f7db23", color: "white" };

  if (status === "finished")
    return { backgroundColor: "#e5e7eb", color: "black" };
  return {
    backgroundColor: "white",
    color: "black",
    border: "1px solid black"
  };
};

  const formatDateParts = (date: Date) => ({
    day: new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date),
    hour: new Intl.DateTimeFormat("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date),
  });

  const statusPriority: Record<IAd["status"], number> = {
    pending: 1,
    active: 2,
    finished: 3,
  };

  const sortedAds = [...ads].sort(
    (a, b) => statusPriority[a.status] - statusPriority[b.status]
  );

  return (
    <>
      {/* ---------------- WEB TABLE ---------------- */}
      <div className="d-none d-md-block">
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th style={{ width: "10%" }}>Firma</th>
                <th style={{ width: "28%" }}>Açıklama</th>
                <th style={{ width: "10%" }}>Telefon</th>
                <th style={{ width: "10%" }}>Görsel</th>
                <th style={{ width: "12%" }}>Başlangıç</th>
                <th style={{ width: "12%" }}>Bitiş</th>
                <th style={{ width: "10%" }}>Durum</th>
                <th style={{ width: "5%" }}>İşlem</th>
              </tr>
            </thead>

            <tbody>
              {sortedAds.map((ad) => {
                const s = formatDateParts(ad.startDate);
                const e = formatDateParts(ad.endDate);

                return (
                  <tr key={ad.id}>
                    <td
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textAlign: "center",
                      }}
                    >
                      {ad.companyName}
                    </td>

                    <td
                      style={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        overflow: "hidden",
                      }}
                    >
                      {ad.description}
                    </td>

                    <td>{ad.phone}</td>

                    <td className="text-center">
                      <img
                        src={ad.imageUrl}
                        onClick={() => setPreview(ad.imageUrl)}
                        style={{
                          width: 70,
                          height: 70,
                          objectFit: "cover",
                          borderRadius: 6,
                          cursor: "pointer",
                        }}
                      />
                    </td>

                    {/* Başlangıç */}
                    <td
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        textAlign: "center",
                      }}
                    >
                      <div>{s.day}</div>
                      <div style={{ fontSize: 13, color: "#6b7280" }}>
                        {s.hour}
                      </div>
                    </td>

                    {/* Bitiş */}
                    <td
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        textAlign: "center",
                      }}
                    >
                      <div>{e.day}</div>
                      <div style={{ fontSize: 13, color: "#6b7280" }}>
                        {e.hour}
                      </div>
                    </td>

                    <td className="text-center">
                      <span
                        style={{
                          padding: "5px 10px",
                          borderRadius: 6,
                          fontWeight: 600,
                          fontSize: 13,
                          display: "inline-block",
                          ...getStatusStyle(ad.status),
                        }}
                      >
                        {ad.status === "active"
                          ? "Aktif"
                          : ad.status === "finished"
                          ? "Bitti"
                          : "Bekliyor"}
                      </span>
                    </td>

                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => onEdit(ad)}
                      >
                        <PencilSquare size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------- MOBILE CARD ---------------- */}
      <div className="d-md-none mt-3">
        {sortedAds.map((ad) => {
          const s = formatDateParts(ad.startDate);
          const e = formatDateParts(ad.endDate);

          return (
            <div
              key={ad.id}
              className="p-3 rounded mb-3"
              style={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                overflow: "hidden",
              }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <h6
                  className="fw-bold"
                  style={{ margin: 0, whiteSpace: "normal", flex: 1 }}
                >
                  {ad.companyName}
                </h6>

                <button
                  className="btn btn-sm btn-outline-dark ms-2"
                  onClick={() => onEdit(ad)}
                >
                  <PencilSquare size={16} />
                </button>
              </div>

              <p style={{ fontSize: 14 }}>{ad.description}</p>

              <p className="text-muted" style={{ fontSize: 13 }}>
                Telefon: {ad.phone}
              </p>

              <img
                src={ad.imageUrl}
                onClick={() => setPreview(ad.imageUrl)}
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginBottom: 12,
                  cursor: "pointer",
                }}
              />

              {/* Başlangıç */}
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                <strong>Başlangıç:</strong> {s.day}
                <div style={{ fontSize: 13, color: "#6b7280" }}>{s.hour}</div>
              </div>

              {/* Bitiş */}
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                <strong>Bitiş:</strong> {e.day}
                <div style={{ fontSize: 13, color: "#6b7280" }}>{e.hour}</div>
              </div>

              <span
                style={{
                  padding: "7px 12px",
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: 14,
                  display: "inline-block",
                  ...getStatusStyle(ad.status),
                }}
              >
                {ad.status === "active"
                  ? "Aktif"
                  : ad.status === "finished"
                  ? "Bitti"
                  : "Bekliyor"}
              </span>
            </div>
          );
        })}
      </div>

      {/* --------- Fotoğraf Modal --------- */}
      <Modal show={!!preview} onHide={() => setPreview(null)} centered size="lg">
        <Modal.Body className="p-0 text-center">
          <img
            src={preview!}
            style={{
              width: "100%",
              maxHeight: "90vh",
              objectFit: "contain",
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AdsList;
