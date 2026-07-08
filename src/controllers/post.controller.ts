import type { Request, Response } from 'express'
import { Post } from '../models/post.model.js'
import { AppError } from '../utils/app-error.js'
import type { CreatePostInput, UpdatePostInput } from '../schemas/post.schema.js'
import { catchAsync } from '../utils/catch-async.js'
import { uploadToCloudinary } from '../utils/upload-image.js'

export const getAllPosts = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const { category } = req.query
  const filter =
    // Se a categoria for fornecida e válida, filtra por categoria, caso contrário, retorna todos os posts publicados
    typeof category === 'string' &&
    ['ciclismo', 'gastronomia', 'cultura', 'eventos'].includes(category)
      ? {
          category: category as 'ciclismo' | 'gastronomia' | 'cultura' | 'eventos',
          published: true,
        }
      : { published: true }

  // Conta o total de posts que correspondem ao filtro para fins de paginação
  const total = await Post.countDocuments(filter)

  const posts = await Post.find(filter)
    .populate('author', 'name email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: { posts },
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  })
})

export const getMyPosts = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10

  const total = await Post.countDocuments({ author: req.userId })

  const posts = await Post.find({ author: req.userId })
    .populate('author', 'name email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: { posts },
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  })
})

export const getPostBySlug = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params
  const post = await Post.findOne({ slug, published: true }).populate('author', 'name email')

  if (!post) {
    res.status(404).json({ status: 'fail', message: 'Post não encontrado' })
    return
  }

  res.status(200).json({ status: 'success', data: { post } })
})

export const getMyPostBySlug = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const post = await Post.findOne({
    slug: req.params.slug,
    author: req.userId,
  }).populate('author', 'name email')

  if (!post) {
    res.status(404).json({ status: 'fail', message: 'Post não encontrado' })
    return
  }

  res.status(200).json({ status: 'success', data: { post } })
})

export const createPost = catchAsync(
  async (req: Request<object, object, CreatePostInput>, res: Response): Promise<void> => {
    if (!req.file) {
      throw new AppError('Imagem de capa é obrigatória.', 400)
    }

    const coverImageUrl = await uploadToCloudinary(req.file.buffer)
    let post

    try {
      post = await Post.create({ ...req.body, author: req.userId, coverImage: coverImageUrl })
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
        throw new AppError('Slug já existe. Por favor, escolha outro.', 409)
      }
      throw error
    }

    res.status(201).json({
      status: 'success',
      data: { post },
    })
  },
)

export const updatePost = catchAsync(
  async (req: Request<{ slug: string }, object, UpdatePostInput>, res: Response): Promise<void> => {
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer)
      req.body = { ...req.body, coverImage: imageUrl } as UpdatePostInput & { coverImage: string }
    }
    const post = await Post.findOneAndUpdate({ slug: req.params.slug }, req.body, {
      new: true,
      runValidators: true,
    })

    if (!post) {
      res.status(404).json({
        status: 'fail',
        message: 'Post não encontrado',
      })
      return
    }

    res.status(200).json({
      status: 'success',
      data: { post },
    })
  },
)

export const deletePost = catchAsync(
  async (req: Request<{ slug: string }>, res: Response): Promise<void> => {
    const { slug } = req.params
    const post = await Post.findOneAndDelete({ slug })

    if (!post) {
      res.status(404).json({
        status: 'fail',
        message: 'Post não encontrado',
      })
      return
    }

    res.status(204).send()
  },
)
