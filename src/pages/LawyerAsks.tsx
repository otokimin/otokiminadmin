/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Title from "../components/Title";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import UserChat, { type PanelUser } from "../components/LawyerAskComponents/UserChat";
import { BellFill, ChatDotsFill, Search, ChatSquareQuote } from "react-bootstrap-icons";

interface UserItem extends PanelUser {
  email: string;
  lastMessage: string;
  unread: boolean;
}

const LawyerAsk: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "user"), (snap) => {
      snap.forEach((doc) => {
        const userId = doc.id;
        const userData = doc.data();

        const msgQuery = query(
          collection(db, "lawyersupport", userId, "messages"),
          orderBy("createdAt", "desc")
        );

      onSnapshot(msgQuery, (msgSnap) => {
  if (msgSnap.empty) return;

  const msgs = msgSnap.docs.map((d) => d.data());
  const lastMsg = msgs[0];

  const unread = msgs.some((m) => m.sender === "user" && m.isRead !== true);

  const data: UserItem = {
    id: userId,
    name: userData.name || "Bilinmeyen",
    email: userData.email || "",
    lastMessage:
      lastMsg.text ||
      (lastMsg.type === "image" ? "📷 Görsel" : ""),
    unread,
  };

  setUsers((prev) => {
    const filtered = prev.filter((u) => u.id !== userId);
    const updated = [...filtered, data];

    updated.sort((a, b) =>
      a.unread === b.unread ? 0 : a.unread ? -1 : 1
    );

    return updated;
  });
});

      });
    });

    return () => unsubUsers();
  }, []);

  useEffect(() => {
    const f = users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(f);
  }, [search, users]);

  return (
    <div
      className="container-fluid px-3 px-md-5"
      style={{ height: "90vh" }}
    >
      <div className="row">
        <div className="col-12">
          <Title text="Avukata Sor" subText="Kullanıcı mesaj yönetimi" />
        </div>
      </div>

      <div className="row border" style={{ height: "calc(95vh - 90px)" }}>
        <div
          className="col-md-4 bg-white p-0 d-flex flex-column "
          style={{ height: "100%", borderRight: "1px solid #ddd" }}
        >
          <div className="p-3 d-flex align-items-center">
            <Search size={18} className="me-2 text-dark" />
            <input
              className="form-control"
              placeholder="Kullanıcı ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="px-3 py-2 text-muted small d-flex justify-content-end align-items-center">
            <ChatDotsFill size={18} className="me-2 text-dark" />
            {filteredUsers.length}
          </div>

          <div
            className="no-scrollbar"
            style={{
              overflowY: "auto",
              flex: 1,
              paddingBottom: 16,
            }}
          >
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="p-3 border-bottom d-flex justify-content-between align-items-center user-card"
                style={{
                  cursor: "pointer",
                  transition: "0.2s",
                  background:
                    selectedUser?.id === user.id ? "#f1f1f1" : "white",
                }}
                onClick={() => setSelectedUser(user)}
              >
                <div>
                  <strong style={{ fontSize: 16 }}>{user.name}</strong>
                  <br />
                  <small className="text-muted">{user.email}</small>
                  <div
                    className="text-muted"
                    style={{
                      fontSize: 13,
                      marginTop: 4,
                      maxWidth: 180,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.lastMessage}
                  </div>
                </div>

                {user.unread && <BellFill size={20} color="#f7db23" />}
              </div>
            ))}
          </div>
        </div>

        <div
  className="col-md-8 p-0 no-scrollbar"
  style={{ height: "100%", overflowY: "auto" }}
>

          {selectedUser ? (
            <UserChat user={selectedUser} />
          ) : (
            <div
              className="d-flex flex-column justify-content-center align-items-center text-muted"
              style={{ height: "100%" }}
            >
              <ChatSquareQuote size={60} className="mb-3 text-secondary" />
              <h5>Cevaplamaya Başlayın!</h5>
              <p className="small text-muted">
                Bir kullanıcı seçerek konuşmayı başlatabilirsiniz.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LawyerAsk;
