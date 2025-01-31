export {};

declare global {
  namespace Express {
    export interface Request {
      user: { _id: string };
      file?: Express.Multer.File;
    }
  }
}
