import {
  collection,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import type { IPremiumUser } from "../types/premium";

export const getPremiumUsers = async (): Promise<IPremiumUser[]> => {
  const snap = await getDocs(collection(db, "user"));
  const now = new Date();

  return snap.docs.map((d) => {
    const data = d.data();

    const premiumStart = data.premiumStart
      ? (data.premiumStart as Timestamp).toDate()
      : null;

    const premiumUntil = data.premiumUntil
      ? (data.premiumUntil as Timestamp).toDate()
      : null;

    let status: "active" | "expired" | "none" = "none";

    if (premiumStart && premiumUntil) {
      status = premiumUntil > now ? "active" : "expired";
    }

    return {
      uid: d.id,
      name: data.name || "Bilinmiyor",
      email: data.email || "",
      premiumStart,
      premiumUntil,
      status,
    };
  });
};
export const findUserByEmail = async (email: string) => {
  const snap = await getDocs(collection(db, "user"));

  const docFound = snap.docs.find((d) => {
    return (d.data().email || "").toLowerCase() === email.toLowerCase();
  });

  if (!docFound) return null;

  return {
    uid: docFound.id,
    ...docFound.data()
  };
};



export const updatePremiumUser = async (
  uid: string,
  premiumStart: Date | null,
  premiumUntil: Date | null
) => {
  const now = new Date();

await updateDoc(doc(db, "user", uid), {
  premiumStart: premiumStart ? Timestamp.fromDate(premiumStart) : null,
  premiumUntil: premiumUntil ? Timestamp.fromDate(premiumUntil) : null,
  isPremium: premiumUntil ? premiumUntil > now : false,
});

};

// ✔ 1 Aylık Premium
export const setOneMonthPremium = async (uid: string) => {
  const start = new Date();
  const until = new Date();
  until.setMonth(until.getMonth() + 1); // +1 Ay

  await updatePremiumUser(uid, start, until);
};

export const getPremiumStats = async () => {
  const users = await getPremiumUsers();

  return {
    totalPremium: users.filter((u) => u.status === "active").length,
    expired: users.filter((u) => u.status === "expired").length,
  };
};
