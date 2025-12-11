import React from "react";
import { Pencil, Trash } from "react-bootstrap-icons";
import type { IUser } from "../../types/IUser";

interface Props {
  user: IUser;
  onEdit: (user: IUser) => void;
  onDelete: (uid: string) => void;
}

const UserCard: React.FC<Props> = ({ user, onEdit, onDelete }) => {
  return (
    <div className="card mb-3">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h6 className="fw-bold mb-1">{user.displayName || "İsimsiz Kullanıcı"}</h6>
          <small className="text-muted">{user.email}</small>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-dark" onClick={() => onEdit(user)}>
            <Pencil size={16} />
          </button>
          <button className="btn btn-sm btn-danger" onClick={() => onDelete(user.uid)}>
            <Trash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
