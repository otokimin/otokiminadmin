import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { uploadAdImage, createAd } from "../../services/adsService";

const AdsCreateModal = ({
  show,
  onClose,
  onSaved,
}: {
  show: boolean;
  onClose: () => void;
  onSaved: () => void;
}) => {
  const [form, setForm] = useState({
    companyName: "",
    description: "",
    phone: "",
    imageUrl: "",
    startDate: new Date(),
    endDate: new Date(),
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    let imageUrl = "";

    if (imageFile) {
      imageUrl = await uploadAdImage(imageFile);
    }

    await createAd({
      ...form,
      imageUrl,
      startDate: new Date(form.startDate),
      endDate: new Date(form.endDate),
    });

    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Yeni Reklam Oluştur</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Firma Adı */}
        <Form.Group className="mb-3">
          <Form.Label>Firma Adı</Form.Label>
          <Form.Control
            value={form.companyName}
            onChange={(e) =>
              setForm({ ...form, companyName: e.target.value })
            }
          />
        </Form.Group>

        {/* Açıklama */}
        <Form.Group className="mb-3">
          <Form.Label>Açıklama</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </Form.Group>

        {/* Telefon */}
        <Form.Group className="mb-3">
          <Form.Label>Telefon</Form.Label>
          <Form.Control
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />
        </Form.Group>

        {/* Görsel */}
        <Form.Group className="mb-3">
          <Form.Label>Görsel</Form.Label>
          <div className="mb-2">
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                }}
              />
            )}
          </div>

          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageFile(
                (e.target as HTMLInputElement).files?.[0] || null
              )
            }
          />
        </Form.Group>

        {/* Tarihler */}
        <div className="row">
          <div className="col-6">
            <Form.Label>Başlangıç</Form.Label>
            <Form.Control
              type="datetime-local"
              value={new Date(form.startDate)
                .toISOString()
                .slice(0, 16)}
              onChange={(e) =>
                setForm({
                  ...form,
                  startDate: new Date(e.target.value),
                })
              }
            />
          </div>

          <div className="col-6">
            <Form.Label>Bitiş</Form.Label>
            <Form.Control
              type="datetime-local"
              value={new Date(form.endDate)
                .toISOString()
                .slice(0, 16)}
              onChange={(e) =>
                setForm({
                  ...form,
                  endDate: new Date(e.target.value),
                })
              }
            />
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Kapat
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saving}
          style={{ backgroundColor: "#212529", border: "none" }}
        >
          {saving ? "Oluşturuluyor..." : "Oluştur"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AdsCreateModal;
