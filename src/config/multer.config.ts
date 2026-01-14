import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
    storage: diskStorage({
        destination: './uploads/properties',
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            cb(null, `property-${uniqueSuffix}${ext}`);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|mp4|mov|avi)$/)) {
            cb(null, true);
        } else {
            cb(new Error('Formato de archivo no soportado'), false);
        }
    },
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
    },
};