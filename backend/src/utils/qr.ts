import QRCode from "qrcode";
import cloudinary from "../config/cloudinary";
import { CLOUDINARY_FOLDER } from "../config/env";

export async function generateAndUploadQr(data: { reservationId: number; userId: number; stallName: string; }) {
  const payload = JSON.stringify({
    type: "BOOKFAIR_PASS",
    reservationId: data.reservationId,
    userId: data.userId,
    stall: data.stallName
  });
const pngBuffer = await QRCode.toBuffer(payload, { width: 512, margin: 1 });
const url = await new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: CLOUDINARY_FOLDER, format: "png", public_id: `reservation_${data.reservationId}` },
      (err, result) => err ? reject(err) : resolve(result!.secure_url)
    );
    stream.end(pngBuffer);
  });
return url;
}
