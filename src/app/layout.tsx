import './globals.css';

export const metadata = {
  title: 'Markdown Editor',
  description: 'Markdown editor with emoji support',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
