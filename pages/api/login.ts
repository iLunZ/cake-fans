import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { compare } from 'bcryptjs'
import * as yup from 'yup'

const prisma = new PrismaClient()

const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Must be a valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const validatedData = await loginSchema.validate(req.body, {
      abortEarly: false,
    })

    const { email, password } = validatedData

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Set cookie with user's token
    res.setHeader('Set-Cookie', `token=${user.token}; Path=/; HttpOnly; SameSite=Strict`)

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.errors
      })
    }
    return res.status(500).json({ message: 'Internal server error' })
  }
}
