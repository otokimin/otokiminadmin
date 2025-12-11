import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { updatePremiumUser } from "../../services/premiumService";
import type { IPremiumUser } from "../../types/premium";

interface Props {
  show: boolean;
  user: IPremiumUser | null;
  onClose: () => void;
  onSaved: () => void;
}

const PremiumEditModal = ({ show, user, onClose, onSaved }: Props) => {
  const [start, setStart] = useState<string>("");
  const [until, setUntil] = useState<string>("");

  useEffect(() => {
    if (!user) return;

    if (user.premiumStart) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStart(user.premiumStart.toISOString().slice(0, 16));
    } else {
      setStart("");
    }

    if (user.premiumUntil) {
      setUntil(user.premiumUntil.toISOString().slice(0, 16));
    } else {
      setUntil("");
    }
  }, [user]);

  const save = async () => {
    await updatePremiumUser(
      user!.uid,
      start ? new Date(start) : null,
      until ? new Date(until) : null
    );
    onSaved();
    onClose();
  };

  if (!show || !user) return null;

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Premium Düzenle</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p><strong>{user.name}</strong></p>

        {/* Premium Başlangıç */}
        <Form.Group className="mb-3">
          <Form.Label>Premium Başlangıç Tarihi</Form.Label>
          <Form.Control
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </Form.Group>

        {/* Premium Bitiş */}
        <Form.Group className="mb-3">
          <Form.Label>Premium Bitiş Tarihi</Form.Label>
          <Form.Control
            type="datetime-local"
            value={until}
            onChange={(e) => setUntil(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Kapat
        </Button>
        <Button variant="primary" onClick={save}>
          Kaydet
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PremiumEditModal;
