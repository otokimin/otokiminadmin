import { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { X, Image as ImageIcon } from "react-bootstrap-icons";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface PanelUser {
  id: string;
  name: string;
}

export interface LawyerMessage {
  id: string;
  text?: string;
  sender: "user" | "lawyer";
  createdAt?: Timestamp;
  type: "text" | "image";
  fileUrl?: string;
}

interface Props {
  user: PanelUser;
}

const UserChat: React.FC<Props> = ({ user }) => {
  const [messages, setMessages] = useState<LawyerMessage[]>([]);
  const [reply, setReply] = useState("");
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const storage = getStorage();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "lawyersupport", user.id, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<LawyerMessage, "id">)
      }));
      setMessages(arr);

      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 120);
    });

    return () => unsub();
  }, [user]);

  const sendMessage = async () => {
    if (!reply.trim()) return;

    await addDoc(collection(db, "lawyersupport", user.id, "messages"), {
      sender: "lawyer",
      type: "text",
      text: reply,
      createdAt: serverTimestamp()
    });

    setReply("");
  };

  //  GÖRSEL YÜKLEME
 const sendImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const fileName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `lawyer_images/${user.id}/${fileName}`);


    await uploadBytes(storageRef, file);

    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "lawyersupport", user.id, "messages"), {
      sender: "lawyer",
      type: "image",
      fileUrl: url,
      createdAt: serverTimestamp()
    });

    console.log("Görsel gönderildi:", url);

  } catch (err) {
    console.error("Görsel yükleme hatası:", err);
  }

  e.target.value = "";
};

  return (
    <div className="d-flex flex-column bg-white no-scrollbar" style={{ height: "82vh" }}>
      {/* HEADER */}
      <div className="p-3 border-bottom" style={{ backgroundColor: "#212529", }}>
        <h5 className="m-0 fw-semibold text-white">{user.name}</h5>
      </div>

      {/* MESSAGES */}
      <div className="flex-grow-1 p-3 no-scrollbar" style={{ overflowY: "auto", background: "#f1f3f5" }}>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`d-flex mb-2 ${msg.sender === "lawyer" ? "justify-content-end" : "justify-content-start"}`}
          >
            <div
              style={{
                maxWidth: "65%",
                backgroundColor: msg.sender === "lawyer" ? "#f7db23" : "white",
                borderRadius: 14,
                padding: 10,
                border: msg.sender === "lawyer" ? "none" : "1px solid #ddd"
              }}
            >
              {msg.type === "text" && <span>{msg.text}</span>}

              {msg.type === "image" && msg.fileUrl && (
                <img
                  src={msg.fileUrl}
                  className="img-fluid rounded"
                  style={{ cursor: "pointer", maxHeight: 180 }}
                  onClick={() => setPreviewImg(msg.fileUrl!)}
                />
              )}

              {msg.createdAt?.seconds && (
                <div className="text-end mt-1" style={{ fontSize: 11, opacity: 0.7 }}>
                  {new Date(msg.createdAt.seconds * 1000).toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </div>
              )}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

   <div className="p-3 border-top d-flex bg-white align-items-center">

  {/* 📷 FOTOĞRAF BUTONU */}
  <label
    style={{
      cursor: "pointer",
      marginRight: 12,
      backgroundColor: "#f7db23",
      padding: "8px 10px",
      borderRadius: 8,
      display: "flex",
      alignItems: "center"
    }}
  >
    <ImageIcon size={20} color="white" />
    <input
      type="file"
      hidden
      accept="image/*"
      onChange={sendImage}  
    />
  </label>

  {/* METİN INPUT */}
  <input
    className="form-control me-2"
    placeholder="Mesaj yaz..."
    value={reply}
    onChange={(e) => setReply(e.target.value)}
  />

  <button
    className="btn"
    style={{
      backgroundColor: "#f7db23",
      color: "white",
      fontWeight: 600,
      border: "none"
    }}
    onClick={sendMessage}
  >
    Gönder
  </button>
</div>


      {/* IMAGE PREVIEW MODAL */}
      {previewImg && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75"
          style={{ zIndex: 9999 }}
        >
          <X
            size={35}
            color="white"
            className="position-absolute"
            style={{ top: 20, right: 30, cursor: "pointer" }}
            onClick={() => setPreviewImg(null)}
          />

          <img
            src={previewImg}
            className="img-fluid rounded"
            style={{ maxHeight: "85%" }}
          />
        </div>
      )}
    </div>
  );
};

export default UserChat;
