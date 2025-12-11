import React from "react";
import { Modal, Button } from "react-bootstrap";
import type { IUser } from "../../types/IUser";

interface Props {
  show: boolean;
  onClose: () => void;
  userData: Partial<IUser>;
  setUserData: (data: Partial<IUser>) => void;
  onSave: () => void;
}

const UserModal: React.FC<Props> = ({ show, onClose, userData, setUserData, onSave }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {userData.uid ? "Kullanıcı Güncelle" : "Yeni Kullanıcı Ekle"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <input
          className="form-control mb-3"
          placeholder="İsim"
          value={userData.displayName ?? ""}
          onChange={(e) => setUserData({ ...userData, displayName: e.target.value })}
        />

        <input
          className="form-control mb-3"
          placeholder="Email"
          value={userData.email ?? ""}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          İptal
        </Button>

        <Button variant="warning" onClick={onSave}>
          Kaydet
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserModal;
