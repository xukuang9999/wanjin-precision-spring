export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  imagePrompt: string; // Prompt for AI generation
  fallbackSrc: string; // Fallback image URL
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export enum PageView {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  PRODUCTS = 'PRODUCTS',
  CAPACITY = 'CAPACITY',
  CONTACT = 'CONTACT'
}

export interface CompanyInfo {
  name: string;
  founded: string;
  location: string;
  phone: string;
  email: string;
  employees: number;
}