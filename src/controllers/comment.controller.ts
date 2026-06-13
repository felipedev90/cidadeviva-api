import type { Request, Response } from 'express'
import { Comment } from '../models/comment.model.js'
import type { CreateCommentInput, UpdateCommentInput } from '../schemas/comment.schema.js'
import { catchAsync } from '../utils/catch-async.js'

export const getCommentsByPost = catchAsync(async (req: Request, res: Response): Promise<void> => {
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

  res.status(200).json({
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
})

export const createComment = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { content } = req.body as CreateCommentInput
  const postId = req.params.postId as string

  const comment = await Comment.create({
    content,
    author: req.userId,
    post: postId,
  })
  res.status(201).json({
    status: 'success',
    data: { comment },
  })
})

export const updateComment = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id, postId } = req.params
  const { content } = req.body as UpdateCommentInput
  const comment = await Comment.findOne({ _id: id, post: postId })

  if (!comment) {
    res.status(404).json({
      status: 'fail',
      message: 'Comentário não encontrado',
    })
    return
  }

  if (comment.author.toString() !== req.userId) {
    res.status(403).json({
      status: 'fail',
      message: 'Você não tem permissão para editar este comentário',
    })
    return
  }

  if (content) comment.content = content
  await comment.save()
  res.status(200).json({
    status: 'success',
    data: { comment },
  })
})

export const deleteComment = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id, postId } = req.params
  const comment = await Comment.findOne({ _id: id, post: postId })

  if (!comment) {
    res.status(404).json({
      status: 'fail',
      message: 'Comentário não encontrado',
    })
    return
  }

  if (comment.author.toString() !== req.userId) {
    res.status(403).json({
      status: 'fail',
      message: 'Você não tem permissão para deletar este comentário',
    })
    return
  }

  await comment.deleteOne()
  res.status(204).send()
})
