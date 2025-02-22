import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      
      // Verify user authorization from token
      const token = req.cookies.token
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized, please login' })
      }
      const user = await prisma.user.findFirst({
        where: { token }
      })
  
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }
  
      // Check if cake exists and belongs to user
      const cake = await prisma.cake.findUnique({
        where: { id: Number(id) }
      })
  
      if (!cake) {
        return res.status(404).json({ message: 'Cake not found' })
      }
  
      if (cake.userId !== user.id) {
        return res.status(403).json({ message: 'Not authorized to delete this cake' })
      }
  
      // Delete the cake
      await prisma.$transaction([
        prisma.comment.deleteMany({
          where: { cakeId: Number(id) }
        }),
        prisma.cake.delete({
          where: { id: Number(id) }
        })
      ])
  
      return res.status(200).json({ message: 'Cake deleted successfully' })
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error: ' + error })
    }
  } else if (req.method === 'GET') {
    const { id } = req.query
  
    try {
      const cake = await prisma.cake.findUnique({
        where: { id: Number(id) },
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      })
  
      if (!cake) {
        return res.status(404).json({ message: 'Cake not found' })
      }
  
      return res.status(200).json(cake)
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error:' + error })
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}
