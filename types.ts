
export type AppTab = 'grades' | 'stocks' | 'chatbot' | 'hotel';

export interface Student {
  id: string;
  name: string;
  grade: number;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

export interface PortfolioItem {
  symbol: string;
  shares: number;
  avgPrice: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum RoomCategory {
  STANDARD = 'Standard',
  DELUXE = 'Deluxe',
  SUITE = 'Suite'
}

export interface Room {
  id: number;
  type: RoomCategory;
  price: number;
  available: boolean;
  description: string;
}

export interface Reservation {
  id: string;
  roomId: number;
  customerName: string;
  date: string;
}
