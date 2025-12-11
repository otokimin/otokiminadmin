import React from "react";
import { Pencil, Trash, Eye } from "react-bootstrap-icons";
import type { IUser } from "../../types/IUser";

interface Props {
  users: IUser[];
  onEdit: (user: IUser) => void;
  onDelete: (uid: string) => void;
  onDetail: (user: IUser) => void;
}

const UserTable: React.FC<Props> = ({ users, onEdit, onDelete, onDetail }) => {
  return (
    <>
      {/* DESKTOP TABLE */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>İsim</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>UID</th>
              <th className="text-center">İşlemler</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.uid}>
                <td>
                  {u.displayName?.trim() ? (
                    u.displayName
                  ) : (
                    <span style={{ color: "#9ca3af", fontStyle: "italic" }}>
                      İsim Yok
                    </span>
                  )}
                </td>

                <td>{u.email}</td>

                <td>
                  {u.phone ? (
                    u.phone
                  ) : (
                    <span style={{ color: "#9ca3af", fontStyle: "italic" }}>
                      Yok
                    </span>
                  )}
                </td>

                <td style={{ wordBreak: "break-all" }}>{u.uid}</td>

                {/* ORTALANMIŞ BUTONLAR */}
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => onDetail(u)}
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      className="btn btn-sm btn-outline-dark"
                      onClick={() => onEdit(u)}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      className="btn btn-sm text-white"
                      style={{ backgroundColor: "#212529" }}
                      onClick={() => onDelete(u.uid)}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="d-md-none mt-3">
        {users.map((u) => (
          <div
            key={u.uid}
            className="p-3 mb-3 rounded shadow-sm"
            style={{ backgroundColor: "white", border: "1px solid #ddd" }}
          >
            <div className="fw-bold" style={{ fontSize: 15 }}>
              {u.displayName?.trim() ? (
                u.displayName
              ) : (
                <span style={{ color: "#9ca3af", fontStyle: "italic" }}>
                  İsim Yok
                </span>
              )}
            </div>

            <div style={{ fontSize: 14 }} className="text-muted">
              {u.email}
            </div>

            <div style={{ fontSize: 14 }}>
              {u.phone ? (
                u.phone
              ) : (
                <span style={{ color: "#9ca3af", fontStyle: "italic" }}>
                  Telefon Yok
                </span>
              )}
            </div>

            <div
              style={{
                wordBreak: "break-word",
                fontSize: 12,
                color: "#6b7280",
                marginTop: 5
              }}
            >
              UID: {u.uid}
            </div>

            {/* MOBILE BUTTONS */}
            <div className="d-flex gap-2 mt-3">
              <button
                className="btn btn-sm btn-outline-info flex-grow-1"
                onClick={() => onDetail(u)}
              >
                <Eye size={16} /> Detay
              </button>

              <button
                className="btn btn-sm btn-outline-dark flex-grow-1"
                onClick={() => onEdit(u)}
              >
                <Pencil size={16} /> Düzenle
              </button>

              <button
                className="btn btn-sm text-white flex-grow-1"
                style={{ backgroundColor: "#212529" }}
                onClick={() => onDelete(u.uid)}
              >
                <Trash size={16} /> Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserTable;
