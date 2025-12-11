export interface IPremiumUser {
  uid: string;
  name: string;
  email: string;
  premiumStart: Date | null;
  premiumUntil: Date | null;
  status: "active" | "expired" | "none";
}
