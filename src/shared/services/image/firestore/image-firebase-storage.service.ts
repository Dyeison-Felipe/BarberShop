import { getDownloadURL } from 'firebase-admin/storage';
import { bucket } from '../../../repositories/firebase/config.js';
import { Image, ImageService } from '../image.service.js';

export class ImageFirebaseStorageService implements ImageService {
  getImageNameByUrl(url: string): string | null {
    const imageName = url.split('%2F')[1]?.split('?')[0] ?? null;
    return imageName;
  }

  async uploadImage(
    image: Image,
    name?: string | null,
    path?: string,
  ): Promise<string> {
    console.log('🚀 ~ BarberShopServiceImpl ~ currentName:', name);
    const fileName = name ?? `${Date.now()}_${image.originalname}`;
    const filePath = `${path}/${fileName}`;
    const file = bucket.file(`${path}/${fileName}`);
    await file.save(image.buffer, {
      metadata: {
        contentType: image.mimetype,
      },
    });

    await file.makePublic();
    const url = getDownloadURL(file);
    // const url = `https://firebasestorage.googleapis.com/v0/b/${
    //   bucket.name
    // }/o/${encodeURIComponent(filePath)}?alt=media`;

    return url;
  }

  static imageAdapter(image?: Express.Multer.File | null): Image | null {
    if (!image) return null;

    return {
      buffer: image.buffer,
      mimetype: image.mimetype,
      originalname: image.originalname,
    };
  }
}
