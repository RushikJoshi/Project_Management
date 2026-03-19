import mongoose from 'mongoose';

const quickTaskSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },

    title: { type: String, required: true, trim: true, maxlength: 300 },
    description: { type: String, trim: true, maxlength: 10000 },
    status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo', index: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium', index: true },
    assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    dueDate: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

quickTaskSchema.index({ workspaceId: 1, status: 1 });

quickTaskSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    ret.assigneeId = ret.assigneeId ? String(ret.assigneeId) : null;
    ret.reporterId = String(ret.reporterId);
    ret.createdAt = ret.createdAt?.toISOString?.() || ret.createdAt;
    ret.updatedAt = ret.updatedAt?.toISOString?.() || ret.updatedAt;
    ret.dueDate = ret.dueDate ? new Date(ret.dueDate).toISOString().split('T')[0] : undefined;
    delete ret._id;
    delete ret.__v;
    delete ret.companyId;
    delete ret.workspaceId;
    return ret;
  },
});

const QuickTask = mongoose.model('QuickTask', quickTaskSchema);
export default QuickTask;

