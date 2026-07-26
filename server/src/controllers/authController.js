import jwt from 'jsonwebtoken'; import {z} from 'zod'; import User from '../models/User.js';

const registerInput = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  password: z.string().trim().min(8),
  role: z.enum(['candidate', 'recruiter']).optional(),
  skills: z.array(z.string()).optional()
});

const loginInput = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(1)
});

const sign = user => jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

export async function register(req, res) {
  try {
    const data = registerInput.parse(req.body);
    if (await User.exists({ email: data.email })) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }
    const user = await User.create(data);
    return res.status(201).json({ token: sign(user), user: { id: user.id, name: user.name, email: user.email, role: user.role, skills: user.skills || [] } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0]?.message || 'Invalid input' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Registration failed' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = loginInput.parse(req.body);
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }
    return res.json({ token: sign(user), user: { id: user.id, name: user.name, email: user.email, role: user.role, skills: user.skills || [] } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0]?.message || 'Invalid input' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Login failed' });
  }
}
