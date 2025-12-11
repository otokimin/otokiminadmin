import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { getFunctions, httpsCallable } from "firebase/functions";

interface Props {
  show: boolean;
  onClose: () => void;
  message: string;
  userEmail: string;
}

const SupportReplyModal = ({ show, onClose, message, userEmail }: Props) => {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const functions = getFunctions();

  const sendReply = async () => {
    try {
      setLoading(true);

      const sendMail = httpsCallable(functions, "sendSupportReply");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await sendMail({
        to: userEmail,
        message: reply,
      });

      if (res?.data?.success) {
        alert("E-posta başarıyla gönderildi");
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert("E-posta gönderilemedi, tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cevap Ver</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="fw-bold mb-1">Kullanıcının Mesajı:</p>

        <div
          className="p-2 border rounded mb-3"
          style={{
            maxHeight: 150,
            overflowY: "auto",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {message}
        </div>

        <Form.Control
          as="textarea"
          rows={4}
          placeholder="Cevabınızı yazın..."
          style={{ resize: "none" }}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Kapat
        </Button>

        <Button onClick={sendReply} disabled={loading || reply.trim() === ""}>
          {loading ? "Gönderiliyor..." : "Gönder"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SupportReplyModal;
