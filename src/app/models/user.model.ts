export interface User {
  id: string;
  email: string;
  name: string;
  password?: string; // Optional, won't be stored in localStorage for security
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

// Made with Bob
