import nodemailer from 'nodemailer'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import type { Request, Response } from 'express'

const prisma = new PrismaClient()

// Configuração do transporter usando nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // Use 'true' para 465, 'false' para outros ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Função para enviar o e-mail com o token de redefinição de senha
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body

  try {
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Gerar um token de redefinição de senha (pode ser um código de 6 dígitos ou um hash)
    const resetToken = crypto.randomBytes(32).toString('hex')

    // Criptografar o token antes de salvar no banco
    const hashedToken = await bcrypt.hash(resetToken, 10)

    // Armazenar o token no banco com uma data de expiração (ex: 1 hora)
    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: new Date(Date.now() + 3600000), // 1 hora
      },
    })

    // Format the reset URL correctly, passing both the token and email as query parameters
    const urlFront = `https://front-next-payment.vercel.app/auth/new-password?token=${resetToken}&email=${encodeURIComponent(email)}`

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Solicitação de Redefinição de Senha',
      html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://i.ibb.co/L15m4sM/logo.png" alt="Logo da Marca" style="max-width: 150px; border-radius: 5px;" />
      </div>
      <h2 style="text-align: center; color: #320B4E; margin-bottom: 30px;">Solicitação de Redefinição de Senha</h2>
      <p>Olá,</p>
      <p>Você solicitou a redefinição de senha da sua conta. Por favor, utilize o botão abaixo para redefinir sua senha:</p>

      <p style="text-align: center; margin-bottom: 30px;">
        <a href="${urlFront}" style="padding: 15px 30px; background-color: #FF1FFF; color: #fff; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; font-size: 18px; font-weight: bold;">Ir para redefinir senha</a>
      </p>

      <p style="text-align: center; color: #777; font-size: 14px;">Se você não solicitou essa ação, por favor, ignore este email. O código expirará em 1 hora.</p>
      <p style="margin-top: 30px;">Atenciosamente,</p>
      <p style="font-weight: bold; color: #320B4E;">Next Payment</p>
    </div>
  `,
    }

    // Log the email sending step for debugging purposes
    console.log('Sending reset password email to:', email)

    await transporter.sendMail(mailOptions)

    res.status(200).json({ message: 'Reset token sent to email' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  const { email, token, newPassword } = req.body

  try {
    // Verificar se o usuário existe e tem um token de redefinição
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.passwordResetToken || !user.passwordResetExpires) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    // Verificar se o token não expirou
    if (user.passwordResetExpires < new Date()) {
      return res.status(400).json({ message: 'Token expired' })
    }

    // Comparar o token recebido com o armazenado no banco
    const isTokenValid = await bcrypt.compare(token, user.passwordResetToken)

    if (!isTokenValid) {
      return res.status(400).json({ message: 'Invalid token' })
    }

    // Criptografar a nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Atualizar a senha do usuário e remover o token de redefinição
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    })

    res.status(200).json({ message: 'Password reset successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}
