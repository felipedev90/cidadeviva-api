import { Router } from 'express'
import {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js'
import { validate } from '../middlewares/validate.js'
import { createPostSchema, updatePostSchema } from '../schemas/post.schema.js'

const router = Router()

router.get('/posts', getAllPosts)
router.get('/posts/:slug', getPostBySlug)
router.post('/posts', validate(createPostSchema), createPost)
router.patch('/posts/:slug', validate(updatePostSchema), updatePost)
router.delete('/posts/:slug', deletePost)

export default router
