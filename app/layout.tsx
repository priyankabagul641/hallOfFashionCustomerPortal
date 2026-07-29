import type { Metadata } from 'next'
import { Playfair_Display, Cormorant_Garamond, Inter, Poppins } from 'next/font/google'
import { Toaster } from 'sonner'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import { MeasurementProvider } from '@/context/MeasurementContext'
import Navbar from '@/components/layout/Navbar'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair"
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant"
});

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter"
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: 'Hall of Fashion - Premium Men\'s Ethnic & Designer Wear',
  description: 'Discover premium handcrafted sherwanis, kurtas, Indo-western wear and luxury menswear. Premium Men\'s Couture.',
  generator: 'Hall of Fashion',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Hall of Fashion - Premium Men\'s Couture',
    description: 'Ultra-premium men\'s ethnic and designer fashion marketplace',
    type: 'website',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0F0F0F',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable} ${poppins.variable}`}
    >
      <body className="font-inter bg-background text-foreground antialiased">
        <AuthProvider>
          <MeasurementProvider>
            <CartProvider>
              <Navbar />
              {children}
              <Toaster position="bottom-right" richColors closeButton />
            </CartProvider>
          </MeasurementProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
