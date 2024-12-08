import Image from 'next/image'
import { motion } from 'framer-motion'

export function SplashScreen() {
  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp_Image_2024-11-21_at_21.46.57-removebg-preview-AykeJrYNwSVYnNT3aI8IURhBBbZyUU.png"
        alt="TKM Service Logo"
        width={300}
        height={150}
        priority
      />
    </motion.div>
  )
}

