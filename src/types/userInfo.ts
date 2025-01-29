export interface LoginInfo {
  email: string;
  password: string;
}

export interface RegUser extends LoginInfo {
  firstName: String;
  lastName: String;
  college?: String;
  role: String;
  enrollment?: string | number
}

export interface PendingUser {
  id: string
  name: string
  college: string
  email: string
  role: string
}

export interface User {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  college: string;
  role: string;
}