export interface IUser {
  uid: string;
  displayName: string;
  email: string;
  phone?:string;

  name?: string;
  surname?: string;
  profileImage?: string;

  cars?: {
    id: string;
    brand: string;
    model: string;
    plate: string;
    plateId: string;
    isDefault: boolean;
  }[];


  isActive?: boolean;
  callAcceptStatus?: boolean;
  newNotificationStatus?: boolean;
  newFeedbackStatus?: boolean;

  blockedUserUIds?: string[];

  createdAt?: Date;
  city?: string;
  plate?: string;
  plateId?: string;
}
