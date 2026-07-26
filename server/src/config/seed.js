import User from '../models/User.js';
import Job from '../models/Job.js';

const candidateProfiles = [
  { name: 'Asha Menon', email: 'asha.menon@example.com', password: 'Password123!', role: 'candidate', skills: ['React', 'TypeScript', 'Design systems'] },
  { name: 'Rohan Verma', email: 'rohan.verma@example.com', password: 'Password123!', role: 'candidate', skills: ['Node.js', 'MongoDB', 'REST APIs'] },
  { name: 'Meera Joseph', email: 'meera.joseph@example.com', password: 'Password123!', role: 'candidate', skills: ['Figma', 'UX research', 'Product strategy'] },
  { name: 'Arjun Pillai', email: 'arjun.pillai@example.com', password: 'Password123!', role: 'candidate', skills: ['Python', 'AWS', 'Data pipelines'] },
  { name: 'Kavya Reddy', email: 'kavya.reddy@example.com', password: 'Password123!', role: 'candidate', skills: ['Vue', 'Accessibility', 'Testing'] },
  { name: 'Dinesh Rao', email: 'dinesh.rao@example.com', password: 'Password123!', role: 'candidate', skills: ['Java', 'Spring Boot', 'Microservices'] },
  { name: 'Nia Shah', email: 'nia.shah@example.com', password: 'Password123!', role: 'candidate', skills: ['Next.js', 'AI product design', 'Prompt engineering'] },
  { name: 'Sanjay Patel', email: 'sanjay.patel@example.com', password: 'Password123!', role: 'candidate', skills: ['Go', 'Distributed systems', 'Cloud'] },
  { name: 'Priya Das', email: 'priya.das@example.com', password: 'Password123!', role: 'candidate', skills: ['React Native', 'Mobile UX', 'Growth'] },
  { name: 'Joel Thomas', email: 'joel.thomas@example.com', password: 'Password123!', role: 'candidate', skills: ['DevOps', 'CI/CD', 'Docker'] }
];

const recruiterProfiles = [
  { name: 'Aisha Kapoor', email: 'aisha.kapoor@example.com', password: 'Password123!', role: 'recruiter', skills: ['Hiring', 'Interviewing', 'People operations'] },
  { name: 'Madhav Nair', email: 'madhav.nair@example.com', password: 'Password123!', role: 'recruiter', skills: ['Talent sourcing', 'Stakeholder alignment', 'Employer branding'] },
  { name: 'Lina Chen', email: 'lina.chen@example.com', password: 'Password123!', role: 'recruiter', skills: ['Candidate experience', 'Performance hiring', 'Data-driven hiring'] },
  { name: 'Samir Bose', email: 'samir.bose@example.com', password: 'Password123!', role: 'recruiter', skills: ['Recruiting strategy', 'Interview design', 'Offer management'] },
  { name: 'Neha Rao', email: 'neha.rao@example.com', password: 'Password123!', role: 'recruiter', skills: ['Onboarding', 'HR operations', 'Talent analytics'] }
];

const jobSeeds = [
  {
    title: 'Senior Frontend Engineer',
    company: 'Arcade',
    description: 'Build polished product experiences for a fast-growing creative platform and help shape the design system.',
    location: 'Remote · India',
    employmentType: 'full-time',
    skills: ['React', 'TypeScript', 'Design systems'],
    salary: { min: 2400000, max: 3200000, currency: 'INR' }
  },
  {
    title: 'Product Designer',
    company: 'Northstar',
    description: 'Create thoughtful, research-led product journeys and partner closely with engineering and growth teams.',
    location: 'Bengaluru, India',
    employmentType: 'full-time',
    skills: ['Figma', 'UX research', 'Product strategy'],
    salary: { min: 1800000, max: 2600000, currency: 'INR' }
  },
  {
    title: 'Backend Engineer',
    company: 'Vertex Labs',
    description: 'Own APIs and backend services that power a modern AI-driven hiring product.',
    location: 'Remote · APAC',
    employmentType: 'full-time',
    skills: ['Node.js', 'MongoDB', 'REST APIs'],
    salary: { min: 2200000, max: 3000000, currency: 'INR' }
  },
  {
    title: 'AI Engineer',
    company: 'Luma',
    description: 'Design reliable AI features and evaluation loops that improve candidate and recruiter workflows.',
    location: 'Mumbai, India',
    employmentType: 'Hybrid',
    skills: ['Python', 'AWS', 'LLMs'],
    salary: { min: 2800000, max: 3800000, currency: 'INR' }
  },
  {
    title: 'Staff Mobile Engineer',
    company: 'Pulse',
    description: 'Ship highly polished mobile experiences for a fast-scaling consumer product.',
    location: 'Remote · India',
    employmentType: 'full-time',
    skills: ['React Native', 'Mobile UX', 'Growth'],
    salary: { min: 2600000, max: 3400000, currency: 'INR' }
  },
  {
    title: 'DevOps Engineer',
    company: 'BrightPath',
    description: 'Improve release reliability and infrastructure automation for a modern SaaS platform.',
    location: 'Pune, India',
    employmentType: 'full-time',
    skills: ['Docker', 'CI/CD', 'AWS'],
    salary: { min: 2000000, max: 2800000, currency: 'INR' }
  },
  {
    title: 'Data Platform Engineer',
    company: 'Reframe',
    description: 'Build scalable data pipelines and internal analytics systems that inform every product decision.',
    location: 'Remote · India',
    employmentType: 'full-time',
    skills: ['Python', 'Data pipelines', 'Snowflake'],
    salary: { min: 2400000, max: 3200000, currency: 'INR' }
  },
  {
    title: 'Lead Product Manager',
    company: 'Innova',
    description: 'Advocate for customers and shape the roadmap for a high-impact workflow platform.',
    location: 'Bengaluru, India',
    employmentType: 'full-time',
    skills: ['Product strategy', 'Analytics', 'Leadership'],
    salary: { min: 3000000, max: 4200000, currency: 'INR' }
  }
];

export async function seedDatabase() {
  const userSeeds = [...candidateProfiles, ...recruiterProfiles];

  for (const profile of userSeeds) {
    const existingUser = await User.findOne({ email: profile.email });

    if (existingUser) {
      existingUser.name = profile.name;
      existingUser.role = profile.role;
      existingUser.skills = profile.skills || existingUser.skills || [];
      existingUser.password = profile.password;
      await existingUser.save();
    } else {
      await User.create(profile);
    }
  }

  const existingJobs = await Job.countDocuments();
  if (existingJobs === 0) {
    const recruiters = await User.find({ role: 'recruiter' }).lean();
    const fallbackRecruiter = recruiters[0];
    const recruiterPool = recruiters.length ? recruiters : (fallbackRecruiter ? [fallbackRecruiter] : []);

    if (recruiterPool.length) {
      await Job.create(jobSeeds.map((job, index) => ({
        ...job,
        createdBy: recruiterPool[index % recruiterPool.length]._id,
        status: 'published'
      })));
    }
  }
}
