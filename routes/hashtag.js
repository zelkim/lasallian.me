import express from "express";
import { validateSession } from "../services/session.js";
import { searchHashtags } from "../services/hashtag.js";

const router = express.Router();

router.get("/:hashtag", validateSession, searchHashtags);

export default router;
