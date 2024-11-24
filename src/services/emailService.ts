import nodemailer from 'nodemailer'

export const sendEmail = async (to: string, subject: string, text: string) => {
  console.log(process.env.SMTP_USER)
  console.log(process.env.SMTP_PORT)
  console.log(process.env.SMTP_USER)
  console.log(process.env.SMTP_PASS)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // Use true para 465, false para outras portas
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
  }

  return transporter.sendMail(mailOptions)
}
