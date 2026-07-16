export interface AppConfig {
  NODE_ENV: "development" | "test" | "production";
  PORT: number;
  DATABASE_URL: string;
  FRONTEND_ORIGIN: string;
  JWT_ACCESS_SECRET: string;
  COOKIE_SECRET: string;
  ACCESS_TOKEN_TTL: string;
  REFRESH_TOKEN_DAYS: number;
}

export function validateConfig(raw: Record<string, unknown>): AppConfig {
  const required = ["DATABASE_URL", "JWT_ACCESS_SECRET", "COOKIE_SECRET"] as const;
  for (const key of required) {
    if (typeof raw[key] !== "string" || raw[key].length < (key.endsWith("SECRET") ? 32 : 1)) {
      throw new Error(`${key} is missing or too short`);
    }
  }

  const nodeEnv = raw.NODE_ENV ?? "development";
  if (!["development", "test", "production"].includes(String(nodeEnv))) {
    throw new Error("NODE_ENV must be development, test or production");
  }

  return {
    NODE_ENV: nodeEnv as AppConfig["NODE_ENV"],
    PORT: Number(raw.PORT ?? 3000),
    DATABASE_URL: String(raw.DATABASE_URL),
    FRONTEND_ORIGIN: String(raw.FRONTEND_ORIGIN ?? "http://localhost:5173"),
    JWT_ACCESS_SECRET: String(raw.JWT_ACCESS_SECRET),
    COOKIE_SECRET: String(raw.COOKIE_SECRET),
    ACCESS_TOKEN_TTL: String(raw.ACCESS_TOKEN_TTL ?? "15m"),
    REFRESH_TOKEN_DAYS: Number(raw.REFRESH_TOKEN_DAYS ?? 30),
  };
}
