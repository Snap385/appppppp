import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { phoneNumber } = req.body

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' })
  }

  try {
    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Save the code to the database
    await prisma.verificationCode.create({
      data: {
        phoneNumber,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // Code expires in 10 minutes
      },
    })

    // In a real application, you would send this code via SMS
    console.log(`Verification code for ${phoneNumber}: ${code}`)

    res.status(200).json({ message: 'Verification code sent' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error sending verification code' })
  }
}

