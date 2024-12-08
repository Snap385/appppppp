'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SplashScreen } from '../components/SplashScreen'
import { motion, AnimatePresence } from 'framer-motion'

export default function AuthScreens() {
  const [isLogin, setIsLogin] = useState(true)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [showSplash, setShowSplash] = useState(true)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 1) return '+7'
    if (numbers.length <= 4) return `+7 (${numbers.slice(1)}`
    if (numbers.length <= 7) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4)}`
    if (numbers.length <= 9) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7)}`
    return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    if (formatted.length <= 18) {
      setPhoneNumber(formatted)
    }
  }

  const handleSendCode = async () => {
    try {
      const response = await fetch('/api/sendVerificationCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      })
      const data = await response.json()
      setMessage(data.message)
      if (response.ok) {
        setIsCodeSent(true)
      }
    } catch (error) {
      console.error('Error sending verification code:', error)
      setMessage('Error sending verification code')
    }
  }

  const handleRegister = async () => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, code: verificationCode, password }),
      })
      const data = await response.json()
      setMessage(data.message)
    } catch (error) {
      console.error('Error registering:', error)
      setMessage('Error registering user')
    }
  }

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, password }),
      })
      const data = await response.json()
      setMessage(data.message)
    } catch (error) {
      console.error('Error logging in:', error)
      setMessage('Error logging in')
    }
  }

  return (
    <AnimatePresence>
      {showSplash ? (
        <SplashScreen key="splash" />
      ) : (
        <motion.div
          key="auth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-[2340px] w-[1080px] bg-white mx-auto px-6 py-12 flex flex-col items-center"
        >
          <div className="w-full max-w-sm space-y-8">
            <div className="flex flex-col items-center space-y-2">
              <h1 className="text-2xl font-bold">Вход/Регистрация</h1>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp_Image_2024-11-21_at_21.46.57-removebg-preview-AykeJrYNwSVYnNT3aI8IURhBBbZyUU.png"
                alt="TKM Service Logo"
                width={150}
                height={75}
                priority
              />
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" onClick={() => setIsLogin(true)}>Вход</TabsTrigger>
                <TabsTrigger value="register" onClick={() => setIsLogin(false)}>Регистрация</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone-login">Номер телефона</Label>
                  <Input
                    id="phone-login"
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="+7 (___) ___-__-__"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login">Пароль</Label>
                  <Input
                    id="password-login"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button className="w-full h-12 text-lg" onClick={handleLogin}>
                  Войти
                </Button>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Запомнить
                    </label>
                  </div>
                  <Button variant="link" className="px-0">
                    Забыли пароль?
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone-register">Номер телефона</Label>
                  <Input
                    id="phone-register"
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="+7 (___) ___-__-__"
                    className="h-12"
                  />
                </div>
                {!isCodeSent ? (
                  <Button className="w-full h-12 text-lg" onClick={handleSendCode}>
                    Получить код
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="verification-code">Код подтверждения</Label>
                      <Input
                        id="verification-code"
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-register">Придумайте пароль</Label>
                      <Input
                        id="password-register"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <Button className="w-full h-12 text-lg" onClick={handleRegister}>
                      Зарегистрироваться
                    </Button>
                  </>
                )}
              </TabsContent>
            </Tabs>
            {message && (
              <div className="mt-4 p-2 bg-blue-100 text-blue-800 rounded">
                {message}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

