import express from 'express'

// expects: title, content, media (optional for now)
export const CreateNormalPost = async (req, res) => {
    try {
        // get authenticated user
        const authorId = req.user._id

    } catch (err) {
        console.error(err)
        return res.status(400).send({ status: 'error', msg: err })
    }
}
