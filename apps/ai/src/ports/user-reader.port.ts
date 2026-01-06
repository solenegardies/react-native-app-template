export interface UserContext {
  userId: string;
  email: string;
  displayName: string | null;
  preferences?: Record<string, unknown>;
}

export interface IUserReader {
  getUserContext(userId: string): Promise<UserContext | null>;
}
