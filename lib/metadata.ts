import type { Metadata } from 'next'

interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

const defaultMetadata: Metadata = {
  metadataBase: new URL('https://amarplot.com'),
  title: {
    default: 'AmarPlot - Premium Real Estate Platform in Bangladesh',
    template: '%s | AmarPlot'
  },
  description: 'Discover premium properties, apartments, and real estate opportunities in Bangladesh. Buy, sell, and rent with confidence on AmarPlot.',
  keywords: [
    'real estate Bangladesh',
    'property Bangladesh',
    'apartment rent Dhaka',
    'buy property Bangladesh',
    'real estate platform',
    'property listing',
    'AmarPlot'
  ],
  authors: [{ name: 'AmarPlot Team' }],
  creator: 'AmarPlot',
  publisher: 'AmarPlot',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://amarplot.com',
    siteName: 'AmarPlot',
    title: 'AmarPlot - Premium Real Estate Platform in Bangladesh',
    description: 'Discover premium properties, apartments, and real estate opportunities in Bangladesh. Buy, sell, and rent with confidence on AmarPlot.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AmarPlot - Real Estate Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AmarPlot - Premium Real Estate Platform in Bangladesh',
    description: 'Discover premium properties, apartments, and real estate opportunities in Bangladesh.',
    images: ['/twitter-image.jpg'],
    creator: '@amarplot',
    site: '@amarplot',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://amarplot.com',
    languages: {
      'en-US': 'https://amarplot.com',
      'bn-BD': 'https://amarplot.com/bn',
    },
  },
  category: 'Real Estate',
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = [],
  } = config

  const metadata: Metadata = {
    ...defaultMetadata,
    title,
    description,
    keywords: [...(defaultMetadata.keywords as string[]), ...keywords],
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
      type: type as 'website' | 'article',
      url: url || defaultMetadata.openGraph?.url,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : defaultMetadata.openGraph?.images,
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined,
      section,
      tags,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description,
      images: image ? [image] : defaultMetadata.twitter?.images,
    },
    alternates: {
      ...defaultMetadata.alternates,
      canonical: url || defaultMetadata.alternates?.canonical,
    },
  }

  return metadata
}

// Property-specific metadata generator
export function generatePropertyMetadata(property: {
  title: string
  description: string
  price: number
  location: string
  type: string
  images?: string[]
  id: string
}): Metadata {
  const { title, description, price, location, type, images, id } = property
  
  return generateMetadata({
    title: `${title} - ${type} in ${location} | AmarPlot`,
    description: `${description} Price: ৳${price.toLocaleString()}. Premium ${type.toLowerCase()} for sale/rent in ${location}, Bangladesh.`,
    keywords: [
      type.toLowerCase(),
      location.toLowerCase(),
      'property for sale',
      'property for rent',
      `${type} ${location}`,
      'Bangladesh real estate',
    ],
    image: images?.[0] || '/default-property-image.jpg',
    url: `https://amarplot.com/properties/${id}`,
    type: 'article',
    section: 'Real Estate',
    tags: [type, location, 'Property'],
  })
}

// Blog/Article metadata generator
export function generateArticleMetadata(article: {
  title: string
  description: string
  author: string
  publishedTime: string
  modifiedTime?: string
  image?: string
  slug: string
  tags?: string[]
}): Metadata {
  const { title, description, author, publishedTime, modifiedTime, image, slug, tags } = article
  
  return generateMetadata({
    title: `${title} | AmarPlot Blog`,
    description,
    keywords: tags || [],
    image: image || '/default-blog-image.jpg',
    url: `https://amarplot.com/blog/${slug}`,
    type: 'article',
    publishedTime,
    modifiedTime,
    author,
    section: 'Blog',
    tags,
  })
}

export { defaultMetadata }