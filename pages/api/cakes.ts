import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import * as yup from 'yup'

const prisma = new PrismaClient()

const querySchema = yup.object({
  page: yup.number().positive().default(1),
  limit: yup.number().positive().max(100).default(10)
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { page, limit } = await querySchema.validate(req.query, { 
      abortEarly: false,
      stripUnknown: true
    })

    const skip = (page - 1) * limit

    const cakes = await prisma.cake.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    const total = await prisma.cake.count()

    return res.status(200).json({
      cakes,
      metadata: {
        currentPage: page,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    })
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ errors: error.errors })
    }
    return res.status(500).json({ message: 'Internal server error' })
  }
}
