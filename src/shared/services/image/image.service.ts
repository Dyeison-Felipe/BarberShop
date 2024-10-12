export type Image = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
};

export interface ImageService {
  uploadImage(
    image: Image,
    name?: string | null,
    path?: string,
  ): Promise<string>;

  getImageNameByUrl(url: string): string | null;
}
