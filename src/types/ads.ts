export interface IAd {
  id: string;
  companyName: string;
  description: string;
  phone: string;
  imageUrl: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  status: "pending" | "active" | "finished";
}
