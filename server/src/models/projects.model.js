import mongoose from 'mongoose';

// #region agent log
fetch('http://127.0.0.1:7356/ingest/f2bbb2a3-c016-48c5-8c3f-7d86788fca17',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1d61fd'},body:JSON.stringify({sessionId:'1d61fd',runId:'pre-fix',hypothesisId:'H2',location:'server/src/models/projects.model.js:3',message:'legacy_project_model_module_loaded',data:{hasExistingProjectModel:Boolean(mongoose.models?.Project)},timestamp:Date.now()})}).catch(()=>{});
// #endregion agent log

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


const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
export default Project;