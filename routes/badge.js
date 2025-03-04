import express from 'express'
import { CreateBadge, DeleteBadge, GetAllBadges, GetBadgeById, UpdateBadge } from '../services/badge.js'

const router = express.Router()

router.get("/:id", GetBadgeById)
router.get("/", GetAllBadges)

router.post("/", CreateBadge)

router.put("/:id", UpdateBadge)

router.delete("/:id", DeleteBadge)

export default router