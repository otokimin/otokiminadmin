import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { PersonCircle, QrCode } from "react-bootstrap-icons";
import type { IUser } from "../../types/IUser";
import QRModal from "./QRModal";

interface Props {
  show: boolean;
  onClose: () => void;
  user: IUser | null;
}

const UserDetailModal = ({ show, onClose, user }: Props) => {
  const [showQR, setShowQR] = useState(false);

  if (!user) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatDate = (ts: any) => {
    if (!ts?.toDate) return "-";
    return ts.toDate().toLocaleString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Modal show={show} onHide={onClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Kullanıcı Detayı</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {/* PROFİL BÖLÜMÜ */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-3">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="profile"
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <PersonCircle size={50} color="#6b7280" />
              )}

              <div>
                <h5 className="fw-bold mb-1">{user.displayName}</h5>
                <div className="text-muted">{user.email}</div>
              </div>
            </div>

            {/* QR KOD BUTONU */}
            <Button
              variant="outline-dark"
              size="sm"
              className="d-flex align-items-center gap-2"
              onClick={() => setShowQR(true)}
              style={{ borderRadius: "10px", padding: "0.45rem 0.9rem" }}
            >
              <QrCode size={18} />
              QR Kod
            </Button>
          </div>

          <hr />

          {/* ARAÇLAR */}
          <h6 className="fw-bold">Araçlar</h6>
          {user.cars?.length ? (
            user.cars.map((car) => (
              <div key={car.id} className="p-2 border rounded mb-2">
                <div>
                  <strong>Plaka:</strong> {car.plate}
                </div>
                <div>
                  <strong>Marka:</strong> {car.brand}
                </div>
                <div>
                  <strong>Model:</strong> {car.model}
                </div>
                <div>
                  <strong>Varsayılan:</strong> {car.isDefault ? "Evet" : "Hayır"}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">Kayıtlı araç yok</p>
          )}

          <hr />

          {/* OLUŞTURMA TARİHİ */}
          <p className="fw-semibold">
            Oluşturma Tarihi: {formatDate(user.createdAt)}
          </p>
        </Modal.Body>
      </Modal>

      {/* QR MODAL */}
      <QRModal
        show={showQR}
        onClose={() => setShowQR(false)}
        user={user}
      />
    </>
  );
};

export default UserDetailModal;