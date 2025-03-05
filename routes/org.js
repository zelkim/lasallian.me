import express from "express";
import {
    createOrg,
    getOrgById,
    getOrgByAcronym,
    UpdateOrgInfo,
    DeleteOrgInfo,
} from "../services/org.js";

const router = express.Router();

/**
 * @route POST /
 * @description Creates a new organization.
 * @access Public
 */
router.post("/", createOrg);

/**
 * @route GET /:id
 * @description Retrieves an organization by its ID.
 * @access Public
 */
router.get("/:id", getOrgById);

/**
 * @route GET /acronym/:acronym
 * @description Retrieves an organization by its acronym.
 * @access Public
 */
router.get("/acronym/:acronym", getOrgByAcronym);

// TODO: add auth middleware below to check if current user is valid org member with permissions to update and delete the org

/**
 * @route PUT /:id
 * @description Updates organization information.
 * @access Public
 */
router.put("/:id", UpdateOrgInfo);

/**
 * @route DELETE /:id
 * @description Deletes an organization by its ID.
 * @access Public
 */
router.delete("/:id", DeleteOrgInfo);

export default router;
