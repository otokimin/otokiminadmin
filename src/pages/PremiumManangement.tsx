/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import Title from "../components/Title";
import type { IPremiumUser } from "../types/premium";
import {
  findUserByEmail,
  getPremiumStats,
  getPremiumUsers,
  updatePremiumUser,
} from "../services/premiumService";

import PremiumStats from "../components/PremiumComponents/PremiumStats";
import PremiumList from "../components/PremiumComponents/PremiumList";
import PremiumEditModal from "../components/PremiumComponents/PremiumEditModal";

import { Modal, Button, Form } from "react-bootstrap";

const PremiumManagement = () => {
  const [users, setUsers] = useState<IPremiumUser[]>([]);
  const [filtered, setFiltered] = useState<IPremiumUser[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all");

  const [editUser, setEditUser] = useState<IPremiumUser | null>(null);
  const [editModal, setEditModal] = useState(false);

  const [stats, setStats] = useState({
    totalPremium: 0,
    expired: 0,
  });

  // PREMIUM VER MODAL STATE
  const [giveModal, setGiveModal] = useState(false);
  const [email, setEmail] = useState("");
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");

  const load = async () => {
    const u = await getPremiumUsers();
    const st = await getPremiumStats();
    setUsers(u);
    setStats(st);
  };

  useEffect(() => {
    load();
  }, []);

  // --- FİLTRELEME ---
  useEffect(() => {
    let list = users;

    // Tümü = sadece active + expired
    if (filter === "all") {
      list = users.filter((u) => u.status !== "none");
    } else {
      list = users.filter((u) => u.status === filter);
    }

    setFiltered(list);
  }, [users, filter]);

  const handleEdit = (user: IPremiumUser) => {
    setEditUser(user);
    setEditModal(true);
  };

  // --- PREMIUM VERME ---
  const givePremium = async () => {
    if (!email.trim()) {
      alert("E-posta boş olamaz!");
      return;
    }

    if (!start || !end) {
      alert("Başlangıç ve bitiş tarihlerini girmek zorunludur.");
      return;
    }

    if (new Date(end) <= new Date(start)) {
      alert("Bitiş tarihi başlangıç tarihinden önce olamaz!");
      return;
    }

    const userDoc = await findUserByEmail(email);

    if (!userDoc) {
      alert("Bu e-posta ile kullanıcı bulunamadı!");
      return;
    }

    await updatePremiumUser(
      userDoc.uid,
      new Date(start),
      new Date(end)
    );

    setGiveModal(false);
    setEmail("");
    setStart("");
    setEnd("");
    load();
  };

  return (
    <div className="container-fluid px-md-4">

      <div className="d-flex justify-content-center mb-2">
        <Title text="Premium Yönetimi" subText="Premium Yönetim Paneli" />
      </div>

      <PremiumStats stats={stats} />

      {/* Filtre & Premium Ver */}
      <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">

        <select
          className="form-select"
          style={{ width: 180 }}
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "all" | "active" | "expired")
          }
        >
          <option value="all">Tümü</option>
          <option value="active">Premium</option>
          <option value="expired">Süresi Dolmuş</option>
        </select>

        <button
          className="btn user-add-btn px-4"
          onClick={() => setGiveModal(true)}
        >
          Premium Ver
        </button>
      </div>

      <PremiumList users={filtered} onEdit={handleEdit} />

      <PremiumEditModal
        show={editModal}
        user={editUser}
        onClose={() => setEditModal(false)}
        onSaved={load}
      />

      {/* PREMIUM VER MODAL */}
      <Modal show={giveModal} onHide={() => setGiveModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Premium Ver</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Kullanıcı E-posta</Form.Label>
            <Form.Control
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Başlangıç Tarihi</Form.Label>
            <Form.Control
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bitiş Tarihi</Form.Label>
            <Form.Control
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setGiveModal(false)}>
            Kapat
          </Button>
          <Button variant="primary" onClick={givePremium}>
            Kaydet
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default PremiumManagement;
