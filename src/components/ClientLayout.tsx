'use client'

import { I18nProvider } from '@/i18n/context'
import NotificationBar from './NotificationBar'
import Header from './Header'
import Footer from './Footer'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <NotificationBar />
      <Header />
      <main>{children}</main>
      <Footer />
    </I18nProvider>
  )
}
