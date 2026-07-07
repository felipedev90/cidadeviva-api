import { Router } from 'express'
import {
  getAllPosts,
  getMyPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js'
import { validate } from '../middlewares/validate.js'
import { upload } from '../middlewares/upload.js'
import { createPostSchema, updatePostSchema } from '../schemas/post.schema.js'
import { authenticate } from '../middlewares/authenticate.js'

const router = Router()

router.get('/posts', getAllPosts)
router.get('/posts/mine', authenticate, getMyPosts)
router.get('/posts/:slug', getPostBySlug)

router.post(
  '/posts',
  authenticate,
  upload.single('coverImage'),
  validate(createPostSchema),
  createPost,
)
router.patch('/posts/:slug', authenticate, validate(updatePostSchema), updatePost)
router.delete('/posts/:slug', authenticate, deletePost)

export default router
