import express from 'express'
import { CreateBadge, DeleteBadge, GetAllBadges, GetBadgeById, GetBadgeByIdArray, UpdateBadge } from '../services/badge.js'

const router = express.Router()

// Get badge routes
router.get("/:id", GetBadgeById)
router.get("/", GetAllBadges)
router.post("/getByIdArray", GetBadgeByIdArray)

// Manage badge routes
router.post("/", CreateBadge)
router.put("/:id", UpdateBadge)
router.delete("/:id", DeleteBadge)

export default router