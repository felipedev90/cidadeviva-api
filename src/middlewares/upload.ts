import multer from 'multer'

const storage = multer.memoryStorage()

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true)
    } else {
      callback(new Error('Tipo de arquivo não permitido.'))
    }
  },
})
