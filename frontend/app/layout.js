import './globals.css'

export const metadata = {
  title: 'WhatsApp Web Clone',
  description: 'A WhatsApp Web clone built with Next.js and Socket.IO',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden">
        {children}
      </body>
    </html>
  )
}
