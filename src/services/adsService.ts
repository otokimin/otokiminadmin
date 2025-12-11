import {
  collection,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../config/firebaseConfig";
import type { IAd } from "../types/ads";

const toDate = (value: Date): Date => {
  if (value instanceof Timestamp) return value.toDate();
  return new Date(value);
};

export const getAds = async (): Promise<IAd[]> => {
  const snap = await getDocs(collection(db, "ads"));

  const now = new Date();

  const ads = snap.docs.map((d) => {
    const data = d.data();

    const start = toDate(data.startDate);
    const end = toDate(data.endDate);

    let status: IAd["status"] = data.status;

    // ⭐ Zaman bazlı otomatik durum güncellemesi
    if (now < start) {
      status = "pending"; // daha başlamadı
    } else if (now >= start && now <= end) {
      status = "active"; // şu an aktif
    } else if (now > end) {
      status = "finished"; // süresi bitti
    }

    // İstek dışı statü hatalarını düzeltme
    if (status !== data.status) {
      updateAdStatus(d.id, status); // Firebase'e işliyoruz
    }

    return {
      id: d.id,
      companyName: data.companyName,
      description: data.description,
      phone: data.phone,
      imageUrl: data.imageUrl,
      startDate: start,
      endDate: end,
      createdAt: toDate(data.createdAt),
      status,
    };
  });

  return ads;
};
export const createAd = async (data: Partial<IAd>) => {
  return await addDoc(collection(db, "ads"), {
    companyName: data.companyName,
    description: data.description,
    phone: data.phone,
    imageUrl: data.imageUrl,
    startDate: Timestamp.fromDate(data.startDate!),
    endDate: Timestamp.fromDate(data.endDate!),
    createdAt: Timestamp.now(),
    status: "pending",
  });
};

// ✔ Görsel yükleme
export const uploadAdImage = async (file: File) => {
  const fileRef = ref(storage, `ads/${Date.now()}-${file.name}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
};

export const updateAd = async (id: string, data: Partial<IAd>) => {
  const refDoc = doc(db, "ads", id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = {};

  if (data.companyName !== undefined) payload.companyName = data.companyName;
  if (data.description !== undefined) payload.description = data.description;
  if (data.phone !== undefined) payload.phone = data.phone;
  if (data.imageUrl !== undefined) payload.imageUrl = data.imageUrl;

  // Tarihleri temiz biçimde ekle (undefined asla gönderme)
  if (data.startDate instanceof Date) {
    payload.startDate = Timestamp.fromDate(data.startDate);
  }

  if (data.endDate instanceof Date) {
    payload.endDate = Timestamp.fromDate(data.endDate);
  }

  if (data.status !== undefined) payload.status = data.status;

  return updateDoc(refDoc, payload);
};


// ✔ Sadece status güncelleme
export const updateAdStatus = async (
  id: string,
  status: IAd["status"]
) => {
  await updateDoc(doc(db, "ads", id), { status });
};
