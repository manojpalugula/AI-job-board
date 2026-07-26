import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, maxlength: 3000 },
  status: { type: String, enum: ['submitted', 'reviewing', 'interview', 'rejected', 'offered'], default: 'submitted' }
}, { timestamps: true });

// A candidate can apply to a role once; this keeps recruiter counts accurate.
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
