import { Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  email: string;
  friendIds: string[];
  fullName: string;
  createdAt: Date;
}

export interface Member {
  amountOwed: number;
  userId: string;
}

export interface Payer {
  paidAmount: number;
  userId: string;
}

export interface Expense {
  amount: number;
  date: Date;
  groupId: string;
  members: Member[];
  payers: Payer[];
  title: string;
  type: string;
  id: string;
}

export interface Guest {
  id: string;
  fullName: string;
}

export interface Group {
  groupName: string;
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  guests: Guest[];
  users: string[];
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  sender?: any;
  receiver?: any;
}

export interface GroupData {
  groupName: string;
  users?: string[];
  guests?: {
    id: string;
    fullName: string;
  }[];
  description?: string;
}

export interface Balance {
  id: string;
  userId: string;
  balance: number;
  groupId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BalanceItem {
  userId: string;
  amount: number;
}

export interface Split {
  from: string;
  to: string;
  amount: number;
}
