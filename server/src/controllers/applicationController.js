import Application from '../models/Application.js';
import Job from '../models/Job.js';

export async function applyToJob(req, res) {
  const job = await Job.findOne({ _id: req.params.jobId, status: 'published' });
  if (!job) return res.status(404).json({ message: 'Job not found or no longer accepting applications' });

  try {
    const application = await Application.create({
      job: job.id,
      candidate: req.user.id,
      coverLetter: req.body.coverLetter || ''
    });
    return res.status(201).json(application);
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: 'You have already applied for this role' });
    throw error;
  }
}

export async function listJobApplicants(req, res) {
  const job = await Job.findOne({ _id: req.params.jobId, createdBy: req.user.id });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  const applications = await Application.find({ job: job.id })
    .sort({ createdAt: -1 })
    .populate('candidate', 'name email skills');
  return res.json({ job: { id: job.id, title: job.title, company: job.company }, applications });
}

export async function updateApplicationStatus(req, res) {
  const application = await Application.findById(req.params.applicationId).populate('job');
  if (!application || String(application.job.createdBy) !== String(req.user.id)) {
    return res.status(404).json({ message: 'Application not found' });
  }
  const allowed = ['submitted', 'reviewing', 'interview', 'rejected', 'offered'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid application status' });
  application.status = req.body.status;
  await application.save();
  return res.json(application);
}
