const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Top5ListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        userName: { type: String, required: true },
        views: {type: [String], required: true},
        likes: {type: [String], required: true},
        dislikes: {type: [String], required: true},
        comments: {type: [{text: {type: String, required: true}, user: {type:String, required: true}}], required: true},
        publishDate: {type: Date, required: false},
        published: {type: Boolean, required: true},
        votes: {type: [Number], required: false}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
