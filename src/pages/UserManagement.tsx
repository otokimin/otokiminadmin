/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import Title from "../components/Title";

import {
  getUsersFromFirestore,
  deleteUser,
  updateUser,
  createUser
} from "../services/userService";

import UserSearchBar from "../components/UserManagementComponents/UserSearchBar";
import UserTable from "../components/UserManagementComponents/UserTable";
import UserCard from "../components/UserManagementComponents/UserCard";
import UserModal from "../components/UserManagementComponents/UserModal";

import type { IUser } from "../types/IUser";
import { Modal, Button } from "react-bootstrap";
import UserDetailModal from "../components/UserManagementComponents/UserDetailModal";

const UserManagement = () => {
  const [search, setSearch] = useState<string>("");
  const [users, setUsers] = useState<IUser[]>([]);
  const [filtered, setFiltered] = useState<IUser[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [userData, setUserData] = useState<Partial<IUser>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
const [detailModal, setDetailModal] = useState(false);
const [detailUser, setDetailUser] = useState<IUser | null>(null);

  const loadUsers = async () => {
    const data = await getUsersFromFirestore();
    setUsers(data);
    setFiltered(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const filteredList = users.filter((u) =>
      (u.displayName || "").toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredList);
  }, [search, users]);

  const handleAdd = () => {
    setUserData({});
    setModal(true);
  };

  const handleEdit = (u: IUser) => {
    setUserData(u);
    setModal(true);
  };

  const handleDeleteRequest = (uid: string) => {
    setConfirmDeleteId(uid);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    await deleteUser(confirmDeleteId);
    setConfirmDeleteId(null);
    loadUsers();
  };

  const handleSave = async () => {
    if (userData.uid) {
      await updateUser(userData as IUser);
    } else {
      await createUser({
        displayName: userData.displayName ?? "",
        email: userData.email ?? ""
      });
    }
    setModal(false);
    loadUsers();
  };
const handleDetail = (user: IUser) => {
  setDetailUser(user);
  setDetailModal(true);
};

  return (
<div className="h-100 d-flex flex-column px-3 px-md-4 overflow-hidden">

  <div className="flex-shrink-0">
    <Title text="Kullanıcı Yönetimi" subText="Kullanıcı Yönetim Paneli" />
    <UserSearchBar search={search} setSearch={setSearch} onAdd={handleAdd} />
  </div>

 <div className="flex-grow-1 overflow-auto hide-scroll" style={{ minHeight: 0 }}>

<UserTable
  users={filtered}
  onEdit={handleEdit}
  onDelete={handleDeleteRequest}
  onDetail={handleDetail}
/>

    <div className="d-md-none">
      {filtered.map((u) => (
        <UserCard key={u.uid} user={u} onEdit={handleEdit} onDelete={handleDeleteRequest} />
      ))}
    </div>
  </div>

  {/* MODALS */}
  <UserModal
    show={modal}
    onClose={() => setModal(false)}
    userData={userData}
    setUserData={setUserData}
    onSave={handleSave}
  />
  <UserDetailModal
  show={detailModal}
  onClose={() => setDetailModal(false)}
  user={detailUser}
/>


  {/* DELETE MODAL */}
  <Modal show={!!confirmDeleteId} onHide={() => setConfirmDeleteId(null)} centered>
    <Modal.Header closeButton>
      <Modal.Title>Kullanıcıyı Sil</Modal.Title>
    </Modal.Header>
    <Modal.Body>Bu kullanıcıyı silmek istediğinize emin misiniz?</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setConfirmDeleteId(null)}>İptal</Button>
      <Button variant="danger" onClick={handleConfirmDelete}>Evet, Sil</Button>
    </Modal.Footer>
  </Modal>

</div>

  );
};

export default UserManagement;
