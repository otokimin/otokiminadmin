import { collection, getDocs, updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export interface ISupport {
  id: string;
  userId: string;
  email: string;
  message: string;
  createdAt: string;  
  seen: boolean;
}

export const getSupportRequests = async (): Promise<ISupport[]> => {
  const snap = await getDocs(collection(db, "supportMessages"));
  return snap.docs
    .map((d) => ({
      id: d.id,
      ...(d.data() as Omit<ISupport, "id">)
    }))
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)); 
};

export const markAsSeen = async (id: string): Promise<void> => {
  await updateDoc(doc(db, "supportMessages", id), { seen: true });
};

export const deleteSupport = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "supportMessages", id));
};

export const toggleSeen = async (id: string, current: boolean): Promise<void> => {
  await updateDoc(doc(db, "supportMessages", id), { seen: !current });
};

export const addSupportRequest = async (
  userId: string,
  email: string,
  message: string
): Promise<void> => {
  const id = Date.now().toString();

  await setDoc(doc(db, "supportMessages", id), {
    userId,
    email,
    message,
    createdAt: new Date().toISOString(),
    seen: false
  });
};
