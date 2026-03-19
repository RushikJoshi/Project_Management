import mongoose from 'mongoose';

const roles = ['super_admin', 'admin', 'manager', 'team_leader', 'team_member'];

const userSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: roles, required: true, default: 'team_member' },
    jobTitle: { type: String, trim: true, maxlength: 120 },
    department: { type: String, trim: true, maxlength: 120 },
    avatar: { type: String, trim: true, maxlength: 2048 },
    isActive: { type: Boolean, default: true },
    color: { type: String, trim: true, maxlength: 32 },
  },
  { timestamps: true }
);

userSchema.index({ companyId: 1, email: 1 }, { unique: true });

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    return ret;
  },
});

export function getUserModel(conn) {
  return conn.models.User || conn.model('User', userSchema);
}

export { userSchema };

