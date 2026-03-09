/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import Title from "../components/Title";
import {
  getSupportRequests,
  toggleSeen,
  deleteSupport,
  markAsSentToCentral,
  type ISupport
} from "../services/supportService";
import { Modal, Button } from "react-bootstrap";
import { ChatLeftText, Trash } from "react-bootstrap-icons";
import SupportReplyModal from '../components/SupportComponents/SupportReplyModal';
import { sendToCentralApi } from "../services/supportApi";

const SupportScreen = () => {
  const [requests, setRequests] = useState<ISupport[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
 const [replyData, setReplyData] = useState<{
  show: boolean;
  message: string;
  email: string | null;
  id: string | null;
}>({
  show: false,
  message: "",
  email: null,
  id: null,
});


  const load = async () => {
    const data = await getSupportRequests();
    setRequests(data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  useEffect(() => {
    const sendNewRequests = async () => {
      for (const r of requests) {
        if (!r.sentToCentral) {
          await sendToCentralApi({
            projectName: "Otokimin",
            email: r.email,
            firstName: r.userId,
            surname: null,
            title: "Mobil Destek Talebi",
            body: r.message
          })

          await markAsSentToCentral(r.id)
        }
      }
    }

    if (requests.length > 0) {
      sendNewRequests()
    }
  }, [requests])

  const handleToggleSeen = async (id: string, current: boolean) => {
    await toggleSeen(id, current);
    load();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    await deleteSupport(confirmDelete);
    setConfirmDelete(null);
    load();
  };

  return (
    <div className="container-fluid px-md-4">
      <div className="row">
        <div className="col-12">
          <Title text="Destek Talepleri" subText="Destek Talepleri Takip Paneli" />
        </div>
      </div>

    {/* DESKTOP TABLE */}
<div className="row mt-4 d-none d-md-flex">
  <div className="col-12">
    <div className="table-responsive">
<table className="table table-bordered align-middle">
        <thead className="table-dark">
          <tr>
            <th style={{ width: "20%" }}>Email</th>
            <th style={{ width: "40%" }}>Mesaj</th>
            <th style={{ width: "20%" }}>Tarih</th>
            <th style={{ width: "10%" }}>Durum</th>
            <th style={{ width: "8%" }}>İşlem</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td style={{ wordBreak: "break-word" }}>{r.email}</td>

              <td
                style={{
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  overflow: "visible"
                }}
              >
                {r.message}
              </td>

             <td
  style={{
    fontSize: "clamp(11px, 1vw, 14px)",
    textAlign: "center",
    verticalAlign: "middle",
  }}
>
  {new Date(r.createdAt).toLocaleString("tr-TR")}
</td>

<td className="text-center align-middle">
  <span
    onClick={() => handleToggleSeen(r.id, r.seen)}
    style={{
      cursor: "pointer",
      padding: "6px 10px",
      borderRadius: 8,
      display: "inline-block",
      fontSize: "clamp(10px, 1vw, 13px)",
      fontWeight: 600,
      backgroundColor: r.seen ? "var(--secondary)" : "#cec9c9ff",
      color: "white",
    }}
  >
    {r.seen ? "Görüldü" : "Görülmedi"}
  </span>
</td>


 <td className="text-center align-middle">
  <div className="d-flex justify-content-center align-items-center gap-2">
    <button
      className="btn btn-sm btn-outline-dark d-flex align-items-center justify-content-center"
      style={{ width: 32, height: 32 }}
      onClick={() =>
  setReplyData({
    show: true,
    message: r.message,
    email: r.email,  
    id: r.id
  })
}

    >
      <ChatLeftText size={16} />
    </button>

    <button
      className="btn btn-sm text-white d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "#212529", width: 32, height: 32 }}
      onClick={() => setConfirmDelete(r.id)}
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
  </div>
</div>



  {/* MOBILE TABLE-LIKE LIST (improved) */}
<div className="d-md-none mt-3">

  {requests.map((r) => (
    <div
      key={r.id}
      style={{
        padding: "14px 14px",
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "#fafafa",
        borderRadius: 8,
        marginBottom: 12,
      }}
    >
      {/* TOP: Email */}
      <div
        style={{
          fontWeight: 600,
          fontSize: 15,
          color: "#111827",
          marginBottom: 6,
        }}
      >
        {r.email}
      </div>

      {/* Mesaj */}
      <div
        style={{
          wordBreak: "break-word",
          lineHeight: "1.4",
          fontSize: 14,
          color: "#374151",
          marginBottom: 10,
        }}
      >
        {r.message}
      </div>

      {/* Tarih */}
   <div
  style={{
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 14,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  }}
>
  {new Date(r.createdAt).toLocaleString("tr-TR")}
</div>


      {/* Durum & İşlem ikonları */}
      <div
        className="d-flex align-items-center justify-content-between"
      >
        {/* Durum */}
        <span
          onClick={() => handleToggleSeen(r.id, r.seen)}
          style={{
            cursor: "pointer",
            padding: "6px 12px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            backgroundColor: r.seen ? "var(--secondary)" : "#fcd34d",
            color: "#000",
            border: "1px solid #e5e7eb",
          }}
        >
          {r.seen ? "Görüldü" : "Görülmedi"}
        </span>

        {/* İkonlar */}
        <div className="d-flex align-items-center gap-2">

          <button
            className="btn btn-sm btn-outline-dark d-flex align-items-center justify-content-center"
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
            }}
            onClick={() =>
  setReplyData({
    show: true,
    message: r.message,
    email: r.email,  
    id: r.id
  })
}

          >
            <ChatLeftText size={16} />
          </button>

          <button
            className="btn btn-sm text-white d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "#212529",
              width: 34,
              height: 34,
              borderRadius: 8,
            }}
            onClick={() => setConfirmDelete(r.id)}
          >
            <Trash size={16} />
          </button>

        </div>
      </div>

    </div>
  ))}

</div>



      {/* DELETE MODAL */}
      <Modal show={!!confirmDelete} onHide={() => setConfirmDelete(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Talebi Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bu talebi silmek istediğinize emin misiniz?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
            İptal
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Sil
          </Button>
        </Modal.Footer>
      </Modal>

      {/* REPLY MODAL */}
      <SupportReplyModal
  show={replyData.show}
  message={replyData.message}
  userEmail={replyData.email ?? ""}   // EKLENDİ
  onClose={async () => {
    if (replyData.id) {
      await toggleSeen(replyData.id, false);
      load();
    }
    setReplyData({ show: false, message: "", email: null, id: null });
  }}
/>

    </div>
  );
};

export default SupportScreen;
