import Org from '../models/Org.js';
import OrgMember from '../models/OrgMembers.js';

/**
 * Creates a new organization.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const createOrg = async (req, res) => {
    const data = req.body;

    Org.create(data)
        .then(async (org) => {
            // AddOrgMember(req, res, org._id);
            const newMember = await OrgMember.create({
                author: req.user._id,
                org: org._id,
                joindate: new Date(),
                position: 'PRES', // default position
                meta: {
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });

            // add member ref to org members array
            await Org.findByIdAndUpdate(org._id, {
                $push: { members: newMember._id },
                'meta.updated_at': new Date(),
            });

            return res.status(200).send({
                status: 'ok',
                msg: 'Organization created.',
                data: org,
            });
        })
        .catch((err) => {
            console.error(err);
            return res.status(400).send({
                status: 'error',
                msg: 'Organization could not be created.',
            });
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
            return res.status(400).json({
                status: 'error',
                error: 'Could not find organization',
            });

        return res.status(200).json({ status: 'ok', data: org });
    } catch (err) {
        console.error(err);
        return res
            .status(400)
            .json({ status: 'error', error: 'Could not get organization' });
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
            'info.acronym': req.params.acronym,
        }).exec();

        if (!org)
            return res.status(400).json({
                status: 'error',
                error: 'Could not find organization',
            });

        return res.status(200).json({ status: 'ok', data: org });
    } catch (err) {
        console.error(err);
        return res
            .status(400)
            .json({ status: 'error', error: 'Could not get organization' });
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
                .json({ status: 'error', msg: 'Organization not found' });
        }

        res.status(200).json({
            status: 'success',
            organization: updatedOrg,
        });
    } catch (err) {
        console.error('UpdateOrgInfo Error:', err);
        res.status(400).json({
            status: 'error',
            msg: err.message.replace('Error: ', ''),
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
                .json({ status: 'error', msg: 'Organization not found' });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Organization deleted successfully.',
        });
    } catch (err) {
        console.error('DeleteOrgInfo Error:', err);
        return res.status(400).json({
            status: 'error',
            msg: err.message.replace('Error: ', ''),
        });
    }
};

export const AddOrgMember = async (req, res, org_id) => {
    try {
        const orgId = org_id || req.params.orgId;
        const userId = req.user._id;

        const org = await Org.findById(orgId);
        if (!org) {
            return res.status(404).json({
                status: 'error',
                msg: 'Organization not found',
            });
        }

        // check if already a member
        const existingMember = await OrgMember.findOne({
            author: userId,
            org: orgId,
        });
        if (existingMember) {
            return res.status(400).json({
                status: 'error',
                msg: 'User is already a member of this organization',
            });
        }

        const newMember = await OrgMember.create({
            author: userId,
            org: orgId,
            joindate: new Date(),
            position: org_id ? 'PRES' : req.body.position || 'MEM', // default position
            meta: {
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        // add member ref to org members array
        await Org.findByIdAndUpdate(orgId, {
            $push: { members: newMember._id },
            'meta.updated_at': new Date(),
        });

        return res.status(201).json({
            status: 'success',
            member: newMember,
        });
    } catch (err) {
        console.error('AddOrgMember Error:', err);
        return res.status(400).json({
            status: 'error',
            msg: err.message || 'Could not add member to organization',
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
                    select: 'vanity info meta',
                },
            })
            .select('members');
        if (!org) {
            return res.status(404).json({
                status: 'error',
                msg: 'Organization not found',
            });
        }

        const members = org.members.map((member) => ({
            _id: member._id,
            user: member.author,
            position: member.position,
            joindate: member.joindate,
            meta: member.meta,
        }));

        return res.status(200).json({
            status: 'success',
            count: members.length,
            members,
        });
    } catch (err) {
        console.error('GetOrgMembers Error:', err);
        return res.status(400).json({
            status: 'error',
            msg: err.message || 'Could not get organization members',
        });
    }
};

export const isOrgMember = async (userId, orgId) => {
    const org = await Org.findById(orgId);
    if (!org) return false;

    const member = await OrgMember.findOne({
        _id: { $in: org.members },
        author: userId,
    });

    return !!member;
};

export const getOrgMemberRole = async (userId, orgId) => {
    const org = await Org.findById(orgId);
    if (!org) return null;

    const member = await OrgMember.findOne({
        _id: { $in: org.members },
        author: userId,
    });

    return member ? member.position : null;
};

/**
 * Gets all organization IDs where the user is a member
 * @param {string} userId - The user's ID
 * @returns {Promise<Array<string>>} Array of organization IDs
 */
export const GetUserOrganizations = async (userId) => {
    try {
        // find all org member records for this user
        const memberships = await OrgMember.find({ author: userId })
            .select('org')
            .exec();

        // then get organization IDs
        const orgIds = memberships.map((membership) => membership.org);

        return orgIds;
    } catch (error) {
        console.error('Error getting user organizations:', error);
        return [];
    }
};

/**
 * Checks if a user is a member of a specific organization
 * @param {string} userId - The user's ID
 * @param {string} orgId - The organization's ID
 * @returns {Promise<boolean>} True if user is a member
 */
export const IsUserInOrganization = async (userId, orgId) => {
    try {
        const membership = await OrgMember.findOne({
            author: userId,
            org: orgId,
        }).exec();

        return !!membership;
    } catch (error) {
        console.error('Error checking organization membership:', error);
        return false;
    }
};
