const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title:
        credentials: {
    email: { type: String, required: true },
    password: { type: String, required: true },
},
})

module.exports = mongoose.model("posts", postSchema)
