import {z} from 'zod'; import Job from '../models/Job.js'; import Application from '../models/Application.js'; const jobInput=z.object({title:z.string().min(3).max(120),company:z.string().min(2),description:z.string().min(40),location:z.string().optional(),employmentType:z.enum(['full-time','part-time','contract','internship']).optional(),skills:z.array(z.string()).max(20).optional(),salary:z.object({min:z.number().nonnegative(),max:z.number().nonnegative(),currency:z.string().optional()}).optional()});
export async function listJobs(req,res){const {q='',page='1',limit='12'}=req.query;const filter={status:'published',...(q&&{$text:{$search:q}})};const [jobs,total]=await Promise.all([Job.find(filter).sort({createdAt:-1}).skip((+page-1)*+limit).limit(+limit).populate('createdBy','name'),Job.countDocuments(filter)]);res.json({jobs,total,page:+page})} export async function getJob(req,res){const job=await Job.findById(req.params.id).populate('createdBy','name');if(!job)return res.status(404).json({message:'Job not found'});res.json(job)} export async function createJob(req,res){const data=jobInput.parse(req.body);const job=await Job.create({...data,createdBy:req.user.id});res.status(201).json(job)} export async function updateJob(req,res){const data=jobInput.partial().parse(req.body);const job=await Job.findOneAndUpdate({_id:req.params.id,createdBy:req.user.id},data,{new:true,runValidators:true});if(!job)return res.status(404).json({message:'Job not found'});res.json(job)} export async function deleteJob(req,res){const job=await Job.findOneAndDelete({_id:req.params.id,createdBy:req.user.id});if(!job)return res.status(404).json({message:'Job not found'});res.status(204).end()}

export async function listMyJobs(req, res) {
  const jobs = await Job.find({ createdBy: req.user.id }).sort({ createdAt: -1 }).lean();
  const counts = await Application.aggregate([
    { $match: { job: { $in: jobs.map((job) => job._id) } } },
    { $group: { _id: '$job', applicantCount: { $sum: 1 } } }
  ]);
  const countByJob = new Map(counts.map((item) => [String(item._id), item.applicantCount]));
  res.json({ jobs: jobs.map((job) => ({ ...job, applicantCount: countByJob.get(String(job._id)) || 0 })) });
}
