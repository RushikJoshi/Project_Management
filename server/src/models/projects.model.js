import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: [true, "Name is required"] },
    id: { type: String, unique: true, required: [true, "Project ID is required"] },
    startDate: { type: Date, default: Date.now },
    dueDate: { type: Date, default: Date.now },
    creationDate: { type: Date, default: Date.now },
    color: { type: String },
    description: { type: String },
    status: { type: String, default: 'active' },
    department: { type: String, default: 'General' },
    workspaceId: { type: String, unique: true },
    // owner: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    // },
    ownerId: String,
    members: [String],
    endDate: Date,
    progress: Number,
    taskCount: Number,
    completedTasksCount: Number,
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminConversation'
    }
}, { timestamps: true });


const Project = mongoose.model("Project", projectSchema);
export default Project;