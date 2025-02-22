import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import * as yup from 'yup'

const prisma = new PrismaClient()

const commentSchema = yup.object({
  comment: yup.string()
    .required('Comment is required')
    .min(5, 'Comment must be at least 5 characters')
    .max(200, 'Comment must not exceed 200 characters'),
  yumFactor: yup.number()
    .required('Yum factor is required')
    .min(1, 'Yum factor must be between 1 and 5')
    .max(5, 'Yum factor must be between 1 and 5')
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { id } = req.query

  try {
    const validatedData = await commentSchema.validate(req.body, {
      abortEarly: false,
    })

    const token = req.cookies.token
    const user = await prisma.user.findFirst({
      where: { token }
    })

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const comment = await prisma.comment.create({
      data: {
        ...validatedData,
        userId: user.id,
        cakeId: Number(id)
      }
    })

    return res.status(201).json({
      message: 'Comment added successfully',
      comment
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
