import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import ErrorBoundary from '@/components/ErrorBoundary'
import FloatingSupportButton from '@/components/FloatingSupportButton'

export const metadata: Metadata = {
  title: 'Amador Flix',
  description: 'Os melhores conteudos das famosas do Brasil',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "sq66elyfz4");
            `
          }}
        />
      </head>
      <body suppressHydrationWarning={true}>
        <ErrorBoundary>
          <Providers>
            {children}
            <FloatingSupportButton />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
} 