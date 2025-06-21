export interface PasswordTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}
export interface AnonymousTokenResponse extends PasswordTokenResponse {
  anonymous_id?: string;
}
export declare const AuthService: {
  authenticate: (email: string, password: string) => Promise<PasswordTokenResponse | undefined>;
  anonymousAuthenticate: () => Promise<AnonymousTokenResponse | undefined>;
  refreshAccessToken: () => Promise<string>;
  logout: () => void;
};
