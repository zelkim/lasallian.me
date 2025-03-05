import Org from "../models/Org.js";
import OrgMember from "../models/OrgMembers.js";

/**
 * Creates a new organization.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const createOrg = async (req, res) => {
    const data = req.body;

    Org.create(data)
        .then((org) => {
            return res
                .status(200)
                .send({ status: "ok", msg: "Organization created.", data: org });
        })
        .catch((err) => {
            console.error(err);
            return res
                .status(400)
                .send({ status: "error", msg: "Organization could not be created." });
        });
};

/**
 * Retrieves an organization by its ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getOrgById = async (req, res) => {
    try {
        const org = await Org.findById(req.params.id).exec();

        if (!org)
            return res
                .status(400)
                .json({ status: "error", error: "Could not find organization" });

        return res.status(200).json({ status: "ok", data: org });
    } catch (err) {
        console.error(err);
        return res
            .status(400)
            .json({ status: "error", error: "Could not get organization" });
    }
};

/**
 * Retrieves an organization by its acronym.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getOrgByAcronym = async (req, res) => {
    try {
        const org = await Org.findOne({
            "info.acronym": req.params.acronym,
        }).exec();

        if (!org)
            return res
                .status(400)
                .json({ status: "error", error: "Could not find organization" });

        return res.status(200).json({ status: "ok", data: org });
    } catch (err) {
        console.error(err);
        return res
            .status(400)
            .json({ status: "error", error: "Could not get organization" });
    }
};

/**
 * Updates organization information.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const UpdateOrgInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            $set: {
                ...req.body,
            },
        };

        const updatedOrg = await Org.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedOrg) {
            return res
                .status(404)
                .json({ status: "error", msg: "Organization not found" });
        }

        res.status(200).json({
            status: "success",
            organization: updatedOrg,
        });
    } catch (err) {
        console.error("UpdateOrgInfo Error:", err);
        res.status(400).json({
            status: "error",
            msg: err.message.replace("Error: ", ""),
        });
    }
};

/**
 * Deletes an organization by its ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const DeleteOrgInfo = async (req, res) => {
    try {
        const org = await Org.findByIdAndDelete(req.params.id);
        if (!org) {
            return res
                .status(404)
                .json({ status: "error", msg: "Organization not found" });
        }

        return res.status(200).json({
            status: "success",
            message: "Organization deleted successfully.",
        });
    } catch (err) {
        console.error("DeleteOrgInfo Error:", err);
        return res.status(400).json({
            status: "error",
            msg: err.message.replace("Error: ", ""),
        });
    }
};

export const AddOrgMember = async (req, res) => {
    try {
        const { orgId } = req.params;
        const userId = req.user._id;

        // check if already a member
        const existingMember = await OrgMember.findOne({
            author: userId,
            org: orgId
        });
        if (existingMember) {
            return res.status(400).json({
                status: "error",
                msg: "User is already a member of this organization"
            });
        }

        const newMember = await OrgMember.create({
            author: userId,
            org: orgId,
            joindate: new Date(),
            position: 'MEM' // default position
        });

        // add member ref to org members array
        await Org.findByIdAndUpdate(
            orgId,
            {
                $push: { members: newMember._id },
                "meta.updated_at": new Date()
            }
        );

        return res.status(200).json({
            status: "success",
            member: newMember
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            status: "error",
            msg: "Could not add member to organization"
        });
    }
};

// Get all members of an organization
export const GetOrgMembers = async (req, res) => {
    try {
        const { orgId } = req.params;

        const org = await Org.findById(orgId)
            .populate({
                path: 'members',
                populate: {
                    path: 'author',
                    select: 'vanity info'
                }
            });
        if (!org) {
            return res.status(404).json({
                status: "error",
                msg: "Organization not found"
            });
        }

        return res.status(200).json({
            status: "success",
            members: org.members
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            status: "error",
            msg: "Could not get organization members"
        });
    }
};

export const isOrgMember = async (userId, orgId) => {
    const org = await Org.findById(orgId);
    if (!org) return false;

    const member = await OrgMember.findOne({
        _id: { $in: org.members },
        author: userId
    });

    return !!member;
};

export const getOrgMemberRole = async (userId, orgId) => {
    const org = await Org.findById(orgId);
    if (!org) return null;

    const member = await OrgMember.findOne({
        _id: { $in: org.members },
        author: userId
    });

    return member ? member.position : null;
};
