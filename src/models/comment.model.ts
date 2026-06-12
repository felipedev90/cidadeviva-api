import mongoose, { Schema, model, type Types } from 'mongoose'

type CommentDocument = {
  content: string
  author: Types.ObjectId
  post: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const commentSchema = new Schema<CommentDocument>(
  {
    content: {
      type: String,
      required: [true, 'Conteúdo é obrigatório'],
      trim: true,
      maxlength: [500, 'O comentário deve conter no máximo 500 caracteres'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Autor é obrigatório'],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post é obrigatório'],
    },
  },
  { timestamps: true },
)

export const Comment = model<CommentDocument>('Comment', commentSchema)
