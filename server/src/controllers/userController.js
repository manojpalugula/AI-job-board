import { z } from 'zod';
import User from '../models/User.js';

const updateUserInput = z.object({
  skills: z.array(z.string()).optional()
});

export async function getProfile(req, res) {
  const user = await User.findById(req.user.id).populate('selectedBy', 'name email role skills');
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    skills: user.skills || [],
    selectedBy: user.selectedBy || []
  });
}

export async function updateProfile(req, res) {
  try {
    const data = updateUserInput.parse(req.body);
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (data.skills) user.skills = data.skills;
    await user.save();
    return res.json({ id: user.id, name: user.name, email: user.email, role: user.role, skills: user.skills || [] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0]?.message || 'Invalid input' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Unable to update profile' });
  }
}

export async function listUsers(req, res) {
  const { role } = req.query;
  const filter = {};
  if (role) filter.role = role;
  const users = await User.find(filter).select('name role skills selectedBy').populate('selectedBy', 'name');
  return res.json({ users });
}

export async function selectCandidate(req, res) {
  const candidateId = req.params.id;
  const candidate = await User.findOneAndUpdate(
    { _id: candidateId, role: 'candidate' },
    { $addToSet: { selectedBy: req.user.id } },
    { new: true }
  ).populate('selectedBy', 'name role skills');
  if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
  return res.json({ id: candidate.id, name: candidate.name, skills: candidate.skills || [], selectedBy: candidate.selectedBy || [] });
}
