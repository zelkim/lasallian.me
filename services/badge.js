import Badge from '../models/Badge.js'

// TODO: Add individual checking of body parameters
// TODO: Add specific error checking
export const CreateBadge = async (req, res) => {
    try {
        const badge = new Badge({
            badge_type: req.body.badge_type,
            badge_key: req.body.badge_key,
            main_title: req.body.main_title,
            main_color: req.body.main_color,
            sub_title: req.body.sub_title,
            sub_color: req.body.sub_color,
            badge_expiry: req.body.badge_expiry
        })

        const savedBadge = await badge.save()
        return res.status(201).json({
            status: 'success',
            savedBadge
        })
    } catch (err) {
        console.error(err)
        return res.status(400).send({ status: 'error', msg: err })
    }
}

export const GetBadgeById = async (req, res) => {
    try {
        const badge_id = req.params.badge_id
        const badge = await Badge.findById(badge_id)
        return res.status(200).json(badge)
    } catch (err) {
        console.error('Error fetching badge data:', error);
        return res.status(500).json({ error: 'An error occurred while fetching badge data.' });
    }
}

export const GetAllBadges = async (req, res) => {
    try {
        const badges = await Badge.find(badge_id)
        return res.status(200).json(badges)
    } catch (err) {
        console.error('Error fetching badge data:', error);
        return res.status(500).json({ error: 'An error occurred while fetching badge data.' });
    }
}

export const UpdateBadge = async (req, res) => {
    try {
        const badge_id = req.params.badge_id
        const badge = await Badge.findByIdAndUpdate(badge_id, {
            badge_type: req.body.badge_type,
            badge_key: req.body.badge_key,
            main_title: req.body.main_title,
            main_color: req.body.main_color,
            sub_title: req.body.sub_title,
            sub_color: req.body.sub_color,
            badge_expiry: req.body.badge_expiry
        })
        return res.status(200).json(badge);

    } catch (err) {
        console.error('Error updating badge data:', error);
        return res.status(500).json({ error: 'An error occurred while updating badge data.' });
    }
}

export const DeleteBadge = async (req, res) => {
    try {
        const badge_id = req.params.badge_id
        const badge = await Badge.findByIdAndDelete(badge_id)
        return res.status(200).json(badge);

    } catch (err) {
        console.error('Error deleting badge data:', error);
        return res.status(500).json({ error: 'An error occurred while deleting badge data.' });
    }
}