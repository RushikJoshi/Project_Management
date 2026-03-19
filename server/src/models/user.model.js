import mongoose from 'mongoose';

// #region agent log
fetch('http://127.0.0.1:7356/ingest/f2bbb2a3-c016-48c5-8c3f-7d86788fca17',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1d61fd'},body:JSON.stringify({sessionId:'1d61fd',runId:'pre-fix',hypothesisId:'H1',location:'server/src/models/user.model.js:3',message:'legacy_user_model_module_loaded',data:{hasExistingUserModel:Boolean(mongoose.models?.User)},timestamp:Date.now()})}).catch(()=>{});
// #endregion agent log

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['employee', 'team-leader', 'manager', 'admin', 'super-admin'],
        default: 'employee' 
    }
}, { timestamps: true });

// Avoid OverwriteModelError when both legacy + v1 models are imported
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;