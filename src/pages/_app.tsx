import ProgressBar from '@badrap/bar-of-progress'
import { Provider } from 'next-auth/client'
import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import Router from 'next/router'
import type { ReactNode } from 'react'
import { Fragment } from 'react'

import 'tailwindcss/tailwind.css'
import { SEO } from '../constants/seo-constants'
import '../styles/globals.css'

const progress = new ProgressBar({
  size: 2,
  color: '#22D3EE',
  className: 'bar-of-progress',
  delay: 100,
})

Router.events.on('routeChangeStart', progress.start)
Router.events.on('routeChangeComplete', () => {
  progress.finish()
  window.scrollTo(0, 0)
})
Router.events.on('routeChangeError', progress.finish)

const {
  DEFAULT_TITLE_TEMPLATE,
  DEFAULT_DESCRIPTION,
  DEFAULT_CANONICAL,
  SITE_NAME,
  DEFAULT_TITLE,
  DEFAULT_OG_IMAGE,
  TWITTER_HANDLE,
  FAVICON_LINK,
} = SEO

function MyApp({ Component, pageProps, router }: AppProps): JSX.Element {
  const canonicalPath = router.pathname === '/' ? '' : router.pathname
  const url = `${DEFAULT_CANONICAL}${canonicalPath}`
  const Layout =
    (Component as typeof Component & {
      layoutProps: {
        Layout: (props: { children: ReactNode } & unknown) => JSX.Element
      }
    }).layoutProps?.Layout || Fragment
  return (
    <>
      <DefaultSeo
        title={DEFAULT_TITLE}
        titleTemplate={DEFAULT_TITLE_TEMPLATE}
        description={DEFAULT_DESCRIPTION}
        canonical={url}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url,
          site_name: SITE_NAME,
          title: DEFAULT_TITLE,
          description: DEFAULT_DESCRIPTION,
          images: [
            {
              url: DEFAULT_OG_IMAGE,
              alt: SITE_NAME,
            },
          ],
        }}
        twitter={{
          handle: TWITTER_HANDLE,
          site: TWITTER_HANDLE,
          cardType: 'summary_large_image',
        }}
        additionalLinkTags={[
          {
            rel: 'shortcut icon',
            href: FAVICON_LINK,
          },
        ]}
      />
      <Provider session={pageProps.session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </>
  )
}

export default MyApp
