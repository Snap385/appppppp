import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { phoneNumber, code, password } = req.body

  if (!phoneNumber || !code || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    // Verify the code
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        phoneNumber,
        code,
        expiresAt: { gt: new Date() },
      },
    })

    if (!verificationCode) {
      return res.status(400).json({ message: 'Invalid or expired verification code' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the user
    const user = await prisma.user.create({
      data: {
        phoneNumber,
        password: hashedPassword,
      },
    })

    // Delete the used verification code
    await prisma.verificationCode.delete({
      where: { id: verificationCode.id },
    })

    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error registering user' })
  }
}

