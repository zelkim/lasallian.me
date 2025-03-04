import Badge from '../models/Badge.js';

class HexCodeFormatError extends Error {
    constructor(message) {
      super(message);
      this.name = 'HexCodeFormatError';
    }
}

function checkHexCode(request) {   
    let regex = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i
    let errString = 'Invalid hex code provided for:'

    if(!regex.test(request.body.text_color)) {
        errString += ` text_color: ${request.body.text_color}`
    }
    if(!regex.test(request.body.main_color)) {
        errString += ` main_color: ${request.body.main_color}`
    }
    if(!regex.test(request.body.sub_color)) {
        errString += ` sub_color: ${request.body.sub_color}`
    }

    if (errString !== 'Invalid hex code provided for:') {
        throw new HexCodeFormatError(errString)
    }
}

// TODO: Add individual checking of body parameters
// TODO: Add specific error checking
export const CreateBadge = async (req, res) => {
    try {
        checkHexCode(req)

        const badge = new Badge({
            ...req.body
        })

        const savedBadge = await badge.save()
        return res.status(201).json({
            status: 'ok',
            msg: 'badge created',
            data: savedBadge
        })
    } catch (err) {
        console.error(err)
        return res.status(400).send({ status: 'error', msg: err.message})
    }
}

export const GetBadgeById = async (req, res) => {
    try {
        const badge_id = req.params.id
        const badge = await Badge.findById(badge_id)
        return res.status(200).json(badge)
    } catch (err) {
        console.error('Error fetching badge data:', err)
        return res.status(500).json({ status: 'error', msg: 'An error occurred while fetching badge data.' })
    }
}

export const GetAllBadges = async (req, res) => {
    try {
        const badges = await Badge.find()
        return res.status(200).json(badges)
    } catch (err) {
        console.error('Error fetching badge data:', err)
        return res.status(500).json({ status: 'error', msg: 'An error occurred while fetching badge data.' })
    }
}

export const UpdateBadge = async (req, res) => {
    try {
        checkHexCode(req)

        const badge_id = req.params.id
        const badge = await Badge.findByIdAndUpdate(badge_id, {
            ...req.body
        })
        return res.status(200).json({
            status: 'ok',
            old: badge,
            updated: await Badge.findById(badge_id)
        })

    } catch (err) {
        console.error('Error updating badge data:', err)
        return res.status(500).json({ status: 'error', msg: err.message})
    }
}

export const DeleteBadge = async (req, res) => {
    try {
        const badge_id = req.params.id
        const badge = await Badge.findByIdAndDelete(badge_id)
        return res.status(200).json(badge)

    } catch (err) {
        console.error('Error deleting badge data:', err)
        return res.status(500).json({ status: 'error', msg: 'An error occurred while fetching badge data.' })
    }
}