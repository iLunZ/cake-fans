import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import * as yup from 'yup'

const prisma = new PrismaClient()
// get
const querySchema = yup.object({
  page: yup.number().positive().default(1),
  limit: yup.number().positive().max(100).default(10)
})
// post:
const cakeSchema = yup.object({
  name: yup.string().required('Cake name is required'),
  imageUrl: yup.string().required('Image URL is required').url('Must be a valid URL'),
  comment: yup.string()
    .required('Comment is required')
    .min(5, 'Comment must be at least 5 characters')
    .max(200, 'Comment must not exceed 200 characters'),
  yumFactor: yup.number()
    .required('Yum factor is required')
    .min(1, 'Yum factor must be between 1 and 5')
    .max(5, 'Yum factor must be between 1 and 5')
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const {name: cakeName, imageUrl, comment: userComment, yumFactor} = await cakeSchema.validate(req.body, {
        abortEarly: false,
      });
  
      // Check for duplicate cake name
      const existingCake = await prisma.cake.findUnique({
        where: { name: cakeName },
      });
  
      if (existingCake) {
        return res.status(400).json({ message: 'A cake with this name already exists' });
      }
  
      // Get user ID from token/auth
      const token = req.cookies.token;
      const user = await prisma.user.findFirst({
        where: { token }
      });
  
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const cake = await prisma.cake.create({
        data: {
          name: cakeName,
          imageUrl,
          userId: user.id
        }
      });
      const comment = await prisma.comment.create({
        data: {
          comment: userComment,
          yumFactor,
          cakeId: cake.id,
          userId: user.id
        }
      });
  
      return res.status(201).json({
        message: 'Cake created successfully',
        cake,
        comment,
      });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: error.errors
        });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
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
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}
