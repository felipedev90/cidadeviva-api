import type { Request, Response } from 'express'
import { Comment } from '../models/comment.model.js'
import type { CreateCommentInput, UpdateCommentInput } from '../schemas/comment.schema.js'

export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
  const { postId } = req.params
  const comments = await Comment.find({
    post: postId,
  }).populate('author', 'name')
  res.json(comments)
}

export const createComment = async (req: Request, res: Response): Promise<void> => {
  const { content } = req.body as CreateCommentInput
  const postId = req.params.postId as string

  const comment = await Comment.create({
    content,
    author: req.userId,
    post: postId,
  })
  res.json(comment)
}

export const updateComment = async (req: Request, res: Response): Promise<void> => {
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
}

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
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
}
