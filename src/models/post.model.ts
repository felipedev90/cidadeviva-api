import { Schema, model } from 'mongoose'
import type { Types } from 'mongoose'

type PostCategory = 'ciclismo' | 'gastronomia' | 'cultura' | 'eventos'

type PostDocument = {
  title: string
  slug: string
  content: string
  excerpt: string
  category: PostCategory
  author: Types.ObjectId
  published: boolean
  createdAt: Date
  updatedAt: Date
}

const postSchema = new Schema<PostDocument>(
  {
    title: {
      type: String,
      required: [true, 'Título é obrigatório'],
      trim: true,
      minlength: [5, 'O título deve conter pelo menos 5 caracteres'],
      maxlength: [150, 'O título deve conter no máximo 150 caracteres'],
    },
    slug: {
      type: String,
      required: [true, 'Slug é obrigatório'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Conteúdo é obrigatório'],
    },
    excerpt: {
      type: String,
      required: [true, 'Resumo é obrigatório'],
      trim: true,
      maxlength: [300, 'O resumo deve conter no máximo 300 caracteres'],
    },
    category: {
      type: String,
      index: true,
      enum: ['ciclismo', 'gastronomia', 'cultura', 'eventos'],
      required: [true, 'Categoria é obrigatória'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Autor é obrigatório'],
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

export const Post = model<PostDocument>('Post', postSchema)
