import type { Request, Response, NextFunction } from 'express'
import { Comment } from '../models/comment.model.js'
import type { CreateCommentInput, UpdateCommentInput } from '../schemas/comment.schema.js'

export const getCommentsByPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const { postId } = req.params

    const total = await Comment.countDocuments({ post: postId })

    const comments = await Comment.find({
      post: postId,
    })
      .populate('author', 'name')
      .skip((page - 1) * limit)
      .limit(limit)

    res.json({
      status: 'success',
      results: comments.length,
      data: { comments },
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

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { content } = req.body as CreateCommentInput
    const postId = req.params.postId as string

    const comment = await Comment.create({
      content,
      author: req.userId,
      post: postId,
    })
    res.json(comment)
  } catch (error) {
    next(error)
  }
}

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id, postId } = req.params
    const { content } = req.body as UpdateCommentInput
    const comment = await Comment.findOne({ _id: id, post: postId })

    if (!comment) {
      res.status(404).json({
        message: 'Comentário não encontrado',
      })
      return
    }

    if (comment.author.toString() !== req.userId) {
      res.status(403).json({
        message: 'Você não tem permissão para editar este comentário',
      })
      return
    }

    if (content) comment.content = content
    await comment.save()
    res.json(comment)
  } catch (error) {
    next(error)
  }
}

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id, postId } = req.params
    const comment = await Comment.findOne({ _id: id, post: postId })

    if (!comment) {
      res.status(404).json({
        message: 'Comentário não encontrado',
      })
      return
    }

    if (comment.author.toString() !== req.userId) {
      res.status(403).json({
        message: 'Você não tem permissão para deletar este comentário',
      })
      return
    }

    await comment.deleteOne()
    res.json({
      message: 'Comentário deletado com sucesso',
    })
  } catch (error) {
    next(error)
  }
}
