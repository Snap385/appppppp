import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { phoneNumber, password } = req.body

  if (!phoneNumber || !password) {
    return res.status(400).json({ message: 'Phone number and password are required' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { phoneNumber },
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid phone number or password' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid phone number or password' })
    }

    // In a real application, you would generate and return a JWT token here
    res.status(200).json({ message: 'Login successful' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error logging in' })
  }
}

