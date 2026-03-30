const mongoose = require("mongoose")

const todoSchema = new mongoose.Schema(
    {
        title: {type: String, required: true},
        completed: {type: Boolean, default: false}, 
        completedAt: {type: Date},
        dueDate: {type: Date},
        reminder:{type: Date},
        color: {type: String, default: "#38bdf8"},
        board: {type: String, default: "General"},
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {timestamps: true}
)

module.exports = mongoose.model("Todo", todoSchema)