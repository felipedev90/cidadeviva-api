import type { Request, Response, NextFunction } from 'express'
import { Post } from '../models/post.model.js'
import type { CreatePostInput, UpdatePostInput } from '../schemas/post.schema.js'

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
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
  } catch (error) {
    next(error)
  }
}

export const getPostBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { slug } = req.params
    const post = await Post.findOne({ slug, published: true }).populate('author', 'name email')

    if (!post) {
      res.status(404).json({ status: 'fail', message: 'Post não encontrado' })
      return
    }

    res.status(200).json({ status: 'success', data: { post } })
  } catch (error) {
    next(error)
  }
}

export const createPost = async (
  req: Request<object, object, CreatePostInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const post = await Post.create({ ...req.body, author: req.userId })

    res.status(201).json({
      status: 'success',
      data: { post },
    })
  } catch (error) {
    next(error)
  }
}

export const updatePost = async (
  req: Request<{ slug: string }, object, UpdatePostInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
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
  } catch (error) {
    next(error)
  }
}

export const deletePost = async (
  req: Request<{ slug: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
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
  } catch (error) {
    next(error)
  }
}
