import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { uploadAdImage, updateAd } from "../../services/adsService";
import type { IAd } from "../../types/ads";

interface Props {
  show: boolean;
  onClose: () => void;
  ad: IAd | null;
  onSaved: () => void;
}

const AdsEditModal = ({ show, onClose, ad, onSaved }: Props) => {
  const [form, setForm] = useState<IAd | null>(ad);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const formatDateForInput = (date: any): string => {
    try {
      let dateObj: Date;
      
      // Handle Firestore Timestamp objects
      if (date && typeof date === 'object' && 'toDate' in date) {
        dateObj = date.toDate();
      } else if (date instanceof Date) {
        dateObj = date;
      } else if (typeof date === 'string') {
        dateObj = new Date(date);
      } else if (typeof date === 'number') {
        dateObj = new Date(date);
      } else {
        return '';
      }

      // Validate the date
      if (isNaN(dateObj.getTime())) {
        return '';
      }

      return dateObj.toISOString().slice(0, 16);
    } catch {
      return '';
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(ad || null);
    setImageFile(null);
  }, [ad]);

  if (!show || !form) return null;

  const handleSave = async () => {
    setSaving(true);

    let imageUrl = form.imageUrl;

    if (imageFile) {
      imageUrl = await uploadAdImage(imageFile);
    }

    console.log(" Firestore'a gönderilen veri:", {
      ...form,
      imageUrl,
      startDate: new Date(form.startDate),
      endDate: new Date(form.endDate),
    });

    await updateAd(form.id, {
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
    <>
      {/* GÖRSEL BÜYÜTME MODALI */}
      <Modal show={!!preview} onHide={() => setPreview(null)} centered size="lg">
        <Modal.Body className="p-0 text-center">
          <img
            src={preview!}
            style={{ width: "100%", maxHeight: "90vh", objectFit: "contain" }}
          />
        </Modal.Body>
      </Modal>

      <Modal show={show} onHide={onClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Reklamı Düzenle</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Firma Adı */}
          <Form.Group className="mb-3">
            <Form.Label>Firma Adı</Form.Label>
            <Form.Control
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />
          </Form.Group>

          {/* Açıklama */}
          <Form.Group className="mb-3">
            <Form.Label>Açıklama</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Form.Group>

          {/* Telefon */}
          <Form.Group className="mb-3">
            <Form.Label>Telefon</Form.Label>
            <Form.Control
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Form.Group>

          {/* Görsel */}
          <Form.Group className="mb-3">
            <Form.Label>Görsel</Form.Label>
            <div className="mb-2">
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : form.imageUrl}
                alt=""
                onClick={() => setPreview(form.imageUrl)}
                style={{
                  width: 120,
                  height: 120,
                  cursor: "pointer",
                  objectFit: "cover",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                }}
              />
            </div>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = (e.target as HTMLInputElement).files?.[0] || null;
                console.log("📸 Seçilen yeni resim:", file);
                setImageFile(file);
              }}
            />
          </Form.Group>

          {/* Tarihler */}
          <div className="row">
            <div className="col-6">
              <Form.Label>Başlangıç</Form.Label>
              <Form.Control
                type="datetime-local"
                value={formatDateForInput(form.startDate)}
                onChange={(e) =>
                  setForm({ ...form, startDate: new Date(e.target.value) })
                }
              />
            </div>

            <div className="col-6">
              <Form.Label>Bitiş</Form.Label>
              <Form.Control
                type="datetime-local"
                value={formatDateForInput(form.endDate)}
                onChange={(e) =>
                  setForm({ ...form, endDate: new Date(e.target.value) })
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
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdsEditModal;
