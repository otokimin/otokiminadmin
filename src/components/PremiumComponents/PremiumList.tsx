import type { IPremiumUser } from "../../types/premium";
import { PencilSquare } from "react-bootstrap-icons";

interface Props {
  users: IPremiumUser[];
  onEdit: (user: IPremiumUser) => void;
}

const PremiumList = ({ users, onEdit }: Props) => {
  const getColor = (s: IPremiumUser["status"]) => {
    if (s === "active") return { background: "#f7db23", color: "white" };
    if (s === "expired") return { background: "grey", color: "white" };
    return { background: "#e5e7eb", color: "black" };
  };

  return (
    <div className="mt-2">
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Kullanıcı</th>
              <th>Email</th>
              <th>Başlangıç</th>
              <th>Bitiş</th>
              <th>Durum</th>
              <th>İşlem</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.uid}>
                <td>{u.name}</td>
                <td>{u.email}</td>

                <td>
                  {u.premiumStart
                    ? u.premiumStart.toLocaleDateString("tr-TR")
                    : "-"}
                </td>

                <td>
                  {u.premiumUntil
                    ? u.premiumUntil.toLocaleDateString("tr-TR")
                    : "-"}
                </td>

                <td className="text-center">
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontWeight: 600,
                      ...getColor(u.status),
                      display: "inline-block",
                    }}
                  >
                    {u.status === "active" ? "Aktif" : "Süresi Doldu"}
                  </span>
                </td>

                <td className="text-center">
                  <button
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => onEdit(u)}
                  >
                    <PencilSquare size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default PremiumList;
