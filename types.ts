
export interface User {
  id: number;
  username: string;
  isAdmin: boolean;
  isSubscribed: boolean;
}

export interface Book {
  id: number;
  name: string;
  stage: number;
  description: string;
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  message: string;
  image?: string; // base64 image data url
  timestamp: string;
}

export interface Stage {
    id: number;
    name: string;
}
