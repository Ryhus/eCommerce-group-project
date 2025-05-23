interface Address {
  country: string;
}
export interface CartResponse {
  id: string;
  version: number;
}
export interface CustomerResponse {
  id: string;
  version: number;
  email: string;
  addresses: Address[];
  isEmailVerified: boolean;
  authenticationMode: "Password" | "ExternalAuth";
  createdAt: Date;
  lastModifiedAt: Date;
}
