import mongoose from 'mongoose';

// #region agent log
fetch('http://127.0.0.1:7356/ingest/f2bbb2a3-c016-48c5-8c3f-7d86788fca17',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1d61fd'},body:JSON.stringify({sessionId:'1d61fd',runId:'pre-fix',hypothesisId:'H2',location:'server/src/models/Project.js:3',message:'v1_project_model_module_loaded',data:{hasExistingProjectModel:Boolean(mongoose.models?.Project)},timestamp:Date.now()})}).catch(()=>{});
// #endregion agent log

const projectSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 4000 },
    color: { type: String, required: true, trim: true, maxlength: 32 },
    status: { type: String, enum: ['active', 'on_hold', 'completed', 'archived'], default: 'active', index: true },
    department: { type: String, trim: true, maxlength: 120, default: 'General' },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }],
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    tasksCount: { type: Number, default: 0, min: 0 },
    completedTasksCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

projectSchema.index({ workspaceId: 1, status: 1 });
projectSchema.index({ workspaceId: 1, department: 1 });
projectSchema.index({ workspaceId: 1, name: 'text' });

projectSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    ret.workspaceId = String(ret.workspaceId);
    ret.ownerId = String(ret.ownerId);
    ret.teamId = ret.teamId ? String(ret.teamId) : undefined;
    ret.members = Array.isArray(ret.members) ? ret.members.map((m) => String(m)) : [];
    ret.createdAt = ret.createdAt?.toISOString?.() || ret.createdAt;
    ret.updatedAt = ret.updatedAt?.toISOString?.() || ret.updatedAt;
    ret.startDate = ret.startDate ? new Date(ret.startDate).toISOString().split('T')[0] : undefined;
    ret.endDate = ret.endDate ? new Date(ret.endDate).toISOString().split('T')[0] : undefined;
    delete ret._id;
    delete ret.__v;
    delete ret.companyId;
    return ret;
  },
});

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export default Project;

