export const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
export const NODE_ENV = process.env.NODE_ENV ?? "development";
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

export const JWT_SECRET = process.env.JWT_SECRET ?? "devsecret";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

export const SMTP_HOST = process.env.SMTP_HOST!;
export const SMTP_PORT = Number(process.env.SMTP_PORT ?? 587);
export const SMTP_USER = process.env.SMTP_USER!;
export const SMTP_PASS = process.env.SMTP_PASS!;
export const EMAIL_FROM = process.env.EMAIL_FROM ?? "no-reply@example.com";

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY!;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET!;
export const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER ?? "bookfair-qrcodes";
