import './globals.css'
import { nunito } from '/public/fonts/fonts.js';

export const metadata = {
  title: 'Orthomoji',
  description: 'Create emoji-based text art!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={nunito.className}>{children}</body>
    </html>
  )
}
