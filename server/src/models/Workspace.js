import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'pro' },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    logo: { type: String, trim: true, maxlength: 2048 },
  },
  { timestamps: true }
);

workspaceSchema.index({ companyId: 1, slug: 1 }, { unique: true });

workspaceSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Workspace = mongoose.model('Workspace', workspaceSchema);
export default Workspace;

