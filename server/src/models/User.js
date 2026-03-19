import mongoose from 'mongoose';

// #region agent log
fetch('http://127.0.0.1:7356/ingest/f2bbb2a3-c016-48c5-8c3f-7d86788fca17',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1d61fd'},body:JSON.stringify({sessionId:'1d61fd',runId:'pre-fix',hypothesisId:'H1',location:'server/src/models/User.js:3',message:'v1_user_model_module_loaded',data:{hasExistingUserModel:Boolean(mongoose.models?.User)},timestamp:Date.now()})}).catch(()=>{});
// #endregion agent log

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

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;

