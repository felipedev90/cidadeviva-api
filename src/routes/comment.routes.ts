import { Router } from 'express'
import {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/comment.controller.js'
import { validate } from '../middlewares/validate.js'
import { createCommentSchema, updateCommentSchema } from '../schemas/comment.schema.js'
import { authenticate } from '../middlewares/authenticate.js'

// Rota base: /posts/:postId/comments
const router = Router({ mergeParams: true })

router.get('/', getCommentsByPost)
router.post('/', authenticate, validate(createCommentSchema), createComment)
router.patch('/:id', authenticate, validate(updateCommentSchema), updateComment)
router.delete('/:id', authenticate, deleteComment)

export default router
