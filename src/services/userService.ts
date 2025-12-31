import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import type { IUser } from "../types/IUser";
import { db } from "../config/firebaseConfig";

export const getUsersFromFirestore = async (): Promise<IUser[]> => {
  const snap = await getDocs(collection(db, "user"));
  return snap.docs
    .map((d) => ({
      uid: d.id,
      ...(d.data() as Omit<IUser, "uid">)
    }))
.sort((a, b) =>
  Number(b.createdAt ?? 0) - Number(a.createdAt ?? 0)
);
};

export const deleteUser = async (uid: string): Promise<void> => {
  await deleteDoc(doc(db, "user", uid));
};

export const updateUser = async (user: IUser): Promise<void> => {
  await setDoc(doc(db, "user", user.uid), user, { merge: true });
};

const generateUid = () =>
  [...crypto.getRandomValues(new Uint8Array(24))]
    .map(b => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[b % 62])
    .join("");

export const createUser = async (user: Omit<IUser, "uid">): Promise<void> => {
  const id = generateUid();
  await setDoc(doc(db, "user", id), {
    ...user,
    createdAt: Date.now()
  });
};