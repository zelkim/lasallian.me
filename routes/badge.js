import express from 'express'
import { CreateBadge, DeleteBadge, GetAllBadges, GetBadgeById, GetBadgeByIdArray, GiveBadge, RevokeBadge, UpdateBadge } from '../services/badge.js'

const router = express.Router()

// Get badge routes
router.get("/:id", GetBadgeById)
router.get("/", GetAllBadges)
router.post("/get-by-id-array", GetBadgeByIdArray)

// Manage badge routes
router.post("/", CreateBadge)
router.put("/:id", UpdateBadge)
router.delete("/revoke-badge", RevokeBadge)
router.delete("/:id", DeleteBadge)
router.post("/give-badge", GiveBadge)

export default router