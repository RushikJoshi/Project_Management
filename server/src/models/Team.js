import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 2000 },
    leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }],
    projectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    color: { type: String, required: true, trim: true, maxlength: 32 },
  },
  { timestamps: true }
);

teamSchema.index({ workspaceId: 1, name: 1 }, { unique: true });

teamSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    ret.workspaceId = String(ret.workspaceId);
    ret.leaderId = String(ret.leaderId);
    ret.members = Array.isArray(ret.members) ? ret.members.map((m) => String(m)) : [];
    ret.projectIds = Array.isArray(ret.projectIds) ? ret.projectIds.map((p) => String(p)) : [];
    ret.createdAt = ret.createdAt?.toISOString?.() || ret.createdAt;
    delete ret._id;
    delete ret.__v;
    delete ret.companyId;
    return ret;
  },
});

const Team = mongoose.model('Team', teamSchema);
export default Team;

