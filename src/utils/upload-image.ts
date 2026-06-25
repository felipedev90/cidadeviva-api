import cloudinary from '../config/cloudinary.js'

export const uploadToCloudinary = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'cidadeviva/posts' },
      (error, result) => {
        if (error || !result) {
          reject(new Error(error?.message ?? 'Falha ao fazer upload da imagem.'))
          return
        }
        resolve(result.secure_url)
      },
    )
    stream.end(buffer)
  })
}
