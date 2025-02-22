import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import * as crypto from 'crypto';
import * as yup from 'yup';

const prisma = new PrismaClient();

const registerSchema = yup.object({
  name: yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: yup.string()
    .required('Email is required')
    .email('Must be a valid email'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const validatedData = await registerSchema.validate(req.body, {
      abortEarly: false,
    });

    const { name, email, password } = validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const timestamp = Date.now().toString();
    const tokenData = `${timestamp}${email}${name}`;
    const token = crypto.createHash('sha256').update(tokenData).digest('hex');

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        token
      }
    });

    // Set cookie
    res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`);

    return res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
        return res.status(400).json({
          status: 'error',
          type: 'validation',
          errors: error.errors.reduce((acc: Record<string, string>, curr: string) => {
            const [field, message] = curr.split(' at ');
            acc[field] = message || curr;
            return acc;
          }, {})
        });
    }
    return res.status(500).json({ 
      status: 'error',
      type: 'server',
      message: 'Internal server error' 
    });
  }
}