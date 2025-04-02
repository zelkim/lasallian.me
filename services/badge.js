import Badge from '../models/Badge.js';
import Org from '../models/Org.js';
import User from '../models/UserInfo.js';

class HexCodeFormatError extends Error {
    constructor(message) {
        super(message);
        this.name = 'HexCodeFormatError';
    }
}

function checkHexCode(request) {
    let regex = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
    let errString = 'Invalid hex code provided for:';

    if (!regex.test(request.body.main_text_color)) {
        errString += ` main_text_color: ${request.body.main_text_color}`;
    }
    if (!regex.test(request.body.sub_text_color)) {
        errString += ` sub_text_color: ${request.body.sub_text_color}`;
    }
    if (!regex.test(request.body.main_color)) {
        errString += ` main_color: ${request.body.main_color}`;
    }
    if (!regex.test(request.body.sub_color)) {
        errString += ` sub_color: ${request.body.sub_color}`;
    }

    if (errString !== 'Invalid hex code provided for:') {
        throw new HexCodeFormatError(errString);
    }
}

export const CreateBadge = async (req, res) => {
    try {
        checkHexCode(req);

        const badge = new Badge({
            ...req.body,
        });

        const savedBadge = await badge.save();
        return res.status(201).json({
            status: 'ok',
            msg: 'badge created',
            data: savedBadge,
        });
    } catch (err) {
        console.error(err);
        return res.status(400).send({ status: 'error', msg: err.message });
    }
};

export const GetBadgeById = async (req, res) => {
    try {
        const badge_id = req.params.id;
        const badge = await Badge.findById(badge_id);
        return res.status(200).json(badge);
    } catch (err) {
        console.error('Error fetching badge data:', err);
        return res.status(500).json({
            status: 'error',
            msg: 'An error occurred while fetching badge data.',
        });
    }
};

export const GetAllBadges = async (req, res) => {
    try {
        const badges = await Badge.find();
        return res.status(200).json(badges);
    } catch (err) {
        console.error('Error fetching badge data:', err);
        return res.status(500).json({
            status: 'error',
            msg: 'An error occurred while fetching badge data.',
        });
    }
};

export const UpdateBadge = async (req, res) => {
    try {
        checkHexCode(req);

        const badge_id = req.params.id;
        const badge = await Badge.findByIdAndUpdate(badge_id, {
            ...req.body,
        });
        return res.status(200).json({
            status: 'ok',
            old: badge,
            updated: await Badge.findById(badge_id),
        });
    } catch (err) {
        console.error('Error updating badge data:', err);
        return res.status(500).json({ status: 'error', msg: err.message });
    }
};

export const DeleteBadge = async (req, res) => {
    try {
        const badge_id = req.params.id;
        const badge = await Badge.findByIdAndDelete(badge_id);
        return res.status(200).json(badge);
    } catch (err) {
        console.error('Error deleting badge data:', err);
        return res.status(500).json({
            status: 'error',
            msg: 'An error occurred while deleting badge data.',
        });
    }
};

export const GetBadgeByIdArray = async (req, res) => {
    try {
        const badgeIds = req.body.badgeIds;

        // Validate the IDs array
        if (!Array.isArray(badgeIds) || badgeIds.length === 0) {
            return res
                .status(400)
                .json({ error: 'Badge IDs must be provided as an array.' });
        }

        const badges = await Badge.find({ _id: { $in: badgeIds } });

        // If no badges found for those ids
        if (badges.length === 0) {
            return res
                .status(404)
                .json({ error: 'No badges found for the provided IDs.' });
        }

        res.status(200).json(badges);
    } catch (err) {
        console.error(`Error getting badges: ${err}`);
        return res.status(500).json({
            status: 'error',
            msg: 'An error occurred while fetching badge data.',
        });
    }
};

// TODO: Test with organization
export const GiveBadge = async (req, res) => {
    try {
        const { target_id, badge_id, type } = req.body;
        let target;
        const badge = await Badge.findById(badge_id).exec();

        if (!badge) {
            return res.status(404).json({
                status: 'error',
                error: 'Badge not found',
            });
        }

        if (!Badge.schema.path('badge_type').enumValues.includes(type)) {
            return res.status(404).json({
                status: 'error',
                error: 'Invalid Badge Type',
            });
        }

        if (badge.badge_type === type && type === 'organization') {
            target = await Org.findByIdAndUpdate(
                target_id,
                { $addToSet: { 'vanity.badges': badge_id } },
                { new: true }
            );

            if (!target) {
                return res.status(404).json({
                    status: 'error',
                    error: 'Organization not found',
                });
            }

            return res.status(200).json({
                status: 'Successfully added badge to organization',
                org: target,
            });
        } else if (badge.badge_type === type && type === 'user') {
            target = await User.findByIdAndUpdate(
                target_id,
                { $addToSet: { 'vanity.badges': badge_id } },
                { new: true }
            );

            if (!target) {
                return res.status(404).json({
                    status: 'error',
                    error: 'User not found',
                });
            }

            return res.status(200).json({
                status: 'Successfully added badge to user',
                user: target,
            });
        }

        return res.status(404).json({
            status: 'error',
            error: 'Type mismatch between badge, target, and provided type',
        });
    } catch (err) {
        console.error(`Error giving badge: ${err}`);
        return res.status(500).json({
            status: 'error',
            msg: 'An error occurred while giving badge.',
        });
    }
};

// TODO: Test with organization
export const RevokeBadge = async (req, res) => {
    try {
        const { target_id, badge_id, type } = req.body;
        let target;
        const badge = await Badge.findById(badge_id).exec();

        if (!badge) {
            return res.status(404).json({
                status: 'error',
                error: 'Badge not found',
            });
        }

        if (!Badge.schema.path('badge_type').enumValues.includes(type)) {
            return res.status(404).json({
                status: 'error',
                error: 'Invalid Badge Type',
            });
        }

        if (badge.badge_type === type && type === 'organization') {
            target = await Org.findById(target_id);

            if (!target.vanity.badges.includes(badge_id)) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Organization does not have this badge',
                });
            }

            target = await Org.findByIdAndUpdate(
                target_id,
                { $pull: { 'vanity.badges': badge_id } },
                { new: true }
            );

            if (!target) {
                return res.status(404).json({
                    status: 'error',
                    error: 'Organization not found',
                });
            }

            return res.status(200).json({
                status: 'Successfully removed badge from organization',
                org: target,
            });
        } else if (badge.badge_type === type && type === 'user') {
            target = await User.findById(target_id);

            if (!target.vanity.badges.includes(badge_id)) {
                return res.status(400).json({
                    status: 'error',
                    error: 'User does not have this badge',
                });
            }

            target = await User.findByIdAndUpdate(
                target_id,
                { $pull: { 'vanity.badges': badge_id } },
                { new: true }
            );

            if (!target) {
                return res.status(404).json({
                    status: 'error',
                    error: 'User not found',
                });
            }

            return res.status(200).json({
                status: 'Successfully removed badge from user',
                user: target,
            });
        }

        return res.status(404).json({
            status: 'error',
            error: 'Type mismatch between badge, target, and provided type',
        });
    } catch (err) {
        console.error(`Error giving badge: ${err}`);
        return res.status(500).json({
            status: 'error',
            msg: 'An error occurred while revoking badge.',
        });
    }
};

export const addBadgeToUser = async (userId, badgeId) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { 'vanity.badges': badgeId } },
            { new: true, runValidators: true }
        ).exec();

        return updatedUser;
    } catch (error) {
        console.error('Error adding badge to user:', error);
        return null;
    }
};
