import { Metadata } from 'next';

// SEO configuration types
interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultImage: string;
  twitterHandle: string;
  facebookAppId?: string;
  locale: string;
  alternateLocales?: string[];
  themeColor: string;
  backgroundColor: string;
}

interface PageSEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  type?: 'website' | 'article' | 'profile';
  price?: {
    amount: number;
    currency: string;
  };
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  rating?: {
    value: number;
    count: number;
    bestRating?: number;
  };
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
}

interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

// Default SEO configuration
const defaultSEOConfig: SEOConfig = {
  siteName: 'AmarPlot',
  siteUrl: 'https://amarplot.com',
  defaultTitle: 'AmarPlot - Find Your Perfect Property',
  defaultDescription: 'Discover and explore properties with AmarPlot. Find your dream home, investment property, or commercial space with our comprehensive property search platform.',
  defaultImage: '/images/og-default.jpg',
  twitterHandle: '@amarplot',
  locale: 'en_US',
  alternateLocales: ['bn_BD'],
  themeColor: '#2563eb',
  backgroundColor: '#ffffff',
};

/**
 * Generate comprehensive metadata for Next.js pages
 */
export function generateMetadata(
  pageData: PageSEOData,
  config: Partial<SEOConfig> = {}
): Metadata {
  const seoConfig = { ...defaultSEOConfig, ...config };
  
  const title = pageData.title 
    ? `${pageData.title} | ${seoConfig.siteName}`
    : seoConfig.defaultTitle;
  
  const description = pageData.description || seoConfig.defaultDescription;
  const image = pageData.image || seoConfig.defaultImage;
  const imageUrl = image.startsWith('http') ? image : `${seoConfig.siteUrl}${image}`;
  
  const metadata: Metadata = {
    title,
    description,
    keywords: pageData.keywords?.join(', '),
    authors: pageData.author ? [{ name: pageData.author }] : undefined,
    creator: seoConfig.siteName,
    publisher: seoConfig.siteName,
    
    // Robots
    robots: {
      index: !pageData.noindex,
      follow: !pageData.nofollow,
      googleBot: {
        index: !pageData.noindex,
        follow: !pageData.nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Open Graph
    openGraph: {
      type: pageData.type || 'website',
      title,
      description,
      url: pageData.canonical,
      siteName: seoConfig.siteName,
      locale: seoConfig.locale,
      alternateLocale: seoConfig.alternateLocales,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: pageData.imageAlt || title,
        },
      ],
      publishedTime: pageData.publishedTime,
      modifiedTime: pageData.modifiedTime,
      section: pageData.section,
      tags: pageData.tags,
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      site: seoConfig.twitterHandle,
      creator: seoConfig.twitterHandle,
      title,
      description,
      images: [imageUrl],
    },
    
    // Facebook
    facebook: seoConfig.facebookAppId ? {
      appId: seoConfig.facebookAppId,
    } : undefined,
    
    // Canonical URL
    alternates: pageData.canonical ? {
      canonical: pageData.canonical,
    } : undefined,
    
    // Theme and app configuration
    themeColor: seoConfig.themeColor,
    colorScheme: 'light dark',
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 5,
    },
    
    // App-specific metadata
    applicationName: seoConfig.siteName,
    appleWebApp: {
      capable: true,
      title: seoConfig.siteName,
      statusBarStyle: 'default',
    },
    
    // Verification tags (add your verification codes)
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
      other: {
        'msvalidate.01': process.env.BING_VERIFICATION || '',
      },
    },
    
    // Additional metadata
    other: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'format-detection': 'telephone=no',
      'mobile-web-app-capable': 'yes',
      'msapplication-TileColor': seoConfig.themeColor,
      'msapplication-config': '/browserconfig.xml',
    },
  };
  
  return metadata;
}

/**
 * Generate structured data for different content types
 */
export function generateStructuredData(
  type: string,
  data: any,
  config: Partial<SEOConfig> = {}
): StructuredData[] {
  const seoConfig = { ...defaultSEOConfig, ...config };
  const structuredData: StructuredData[] = [];
  
  // Website/Organization schema
  structuredData.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    logo: `${seoConfig.siteUrl}/images/logo.png`,
    sameAs: [
      'https://twitter.com/amarplot',
      'https://facebook.com/amarplot',
      'https://linkedin.com/company/amarplot',
    ],
  });
  
  // Website schema
  structuredData.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${seoConfig.siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  });
  
  // Content-specific schemas
  switch (type) {
    case 'property':
      structuredData.push(generatePropertySchema(data, seoConfig));
      break;
    
    case 'article':
      structuredData.push(generateArticleSchema(data, seoConfig));
      break;
    
    case 'product':
      structuredData.push(generateProductSchema(data, seoConfig));
      break;
    
    case 'breadcrumbs':
      if (data.breadcrumbs) {
        structuredData.push(generateBreadcrumbSchema(data.breadcrumbs, seoConfig));
      }
      break;
    
    case 'faq':
      if (data.faqs) {
        structuredData.push(generateFAQSchema(data.faqs));
      }
      break;
    
    case 'review':
      structuredData.push(generateReviewSchema(data, seoConfig));
      break;
  }
  
  return structuredData;
}

function generatePropertySchema(data: any, config: SEOConfig): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateProperty',
    name: data.title,
    description: data.description,
    url: `${config.siteUrl}/properties/${data.id}`,
    image: data.images?.map((img: string) => 
      img.startsWith('http') ? img : `${config.siteUrl}${img}`
    ),
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address?.street,
      addressLocality: data.address?.city,
      addressRegion: data.address?.state,
      postalCode: data.address?.zipCode,
      addressCountry: data.address?.country || 'BD',
    },
    geo: data.coordinates ? {
      '@type': 'GeoCoordinates',
      latitude: data.coordinates.lat,
      longitude: data.coordinates.lng,
    } : undefined,
    floorSize: data.area ? {
      '@type': 'QuantitativeValue',
      value: data.area,
      unitText: 'SQF',
    } : undefined,
    numberOfRooms: data.bedrooms,
    numberOfBathroomsTotal: data.bathrooms,
    yearBuilt: data.yearBuilt,
    offers: data.price ? {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.currency || 'BDT',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
    } : undefined,
    amenityFeature: data.amenities?.map((amenity: string) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
    })),
  };
}

function generateArticleSchema(data: any, config: SEOConfig): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    image: data.image ? [
      data.image.startsWith('http') ? data.image : `${config.siteUrl}${data.image}`
    ] : undefined,
    author: {
      '@type': 'Person',
      name: data.author || 'AmarPlot Team',
    },
    publisher: {
      '@type': 'Organization',
      name: config.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${config.siteUrl}/images/logo.png`,
      },
    },
    datePublished: data.publishedTime,
    dateModified: data.modifiedTime || data.publishedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url,
    },
  };
}

function generateProductSchema(data: any, config: SEOConfig): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.title,
    description: data.description,
    image: data.images?.map((img: string) => 
      img.startsWith('http') ? img : `${config.siteUrl}${img}`
    ),
    brand: {
      '@type': 'Brand',
      name: data.brand || config.siteName,
    },
    offers: {
      '@type': 'Offer',
      price: data.price?.amount,
      priceCurrency: data.price?.currency || 'BDT',
      availability: `https://schema.org/${data.availability || 'InStock'}`,
      seller: {
        '@type': 'Organization',
        name: config.siteName,
      },
    },
    aggregateRating: data.rating ? {
      '@type': 'AggregateRating',
      ratingValue: data.rating.value,
      reviewCount: data.rating.count,
      bestRating: data.rating.bestRating || 5,
    } : undefined,
  };
}

function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>,
  config: SEOConfig
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${config.siteUrl}${crumb.url}`,
    })),
  };
}

function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

function generateReviewSchema(data: any, config: SEOConfig): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': data.itemType || 'Thing',
      name: data.itemName,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: data.rating,
      bestRating: data.bestRating || 5,
    },
    author: {
      '@type': 'Person',
      name: data.author,
    },
    reviewBody: data.content,
    datePublished: data.publishedTime,
  };
}

/**
 * Generate sitemap data for dynamic routes
 */
export function generateSitemapUrls(
  routes: Array<{
    url: string;
    lastModified?: Date;
    changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
  }>,
  config: Partial<SEOConfig> = {}
) {
  const seoConfig = { ...defaultSEOConfig, ...config };
  
  return routes.map(route => ({
    url: route.url.startsWith('http') ? route.url : `${seoConfig.siteUrl}${route.url}`,
    lastModified: route.lastModified || new Date(),
    changeFrequency: route.changeFrequency || 'weekly',
    priority: route.priority || 0.5,
  }));
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(config: Partial<SEOConfig> = {}): string {
  const seoConfig = { ...defaultSEOConfig, ...config };
  
  return `User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Allow specific API endpoints for SEO
Allow: /api/sitemap
Allow: /api/rss

# Sitemap location
Sitemap: ${seoConfig.siteUrl}/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`;
}

/**
 * Utility functions for SEO optimization
 */
export const seoUtils = {
  /**
   * Clean and optimize title for SEO
   */
  optimizeTitle: (title: string, maxLength: number = 60): string => {
    return title.length > maxLength 
      ? `${title.substring(0, maxLength - 3)}...`
      : title;
  },
  
  /**
   * Clean and optimize description for SEO
   */
  optimizeDescription: (description: string, maxLength: number = 160): string => {
    return description.length > maxLength 
      ? `${description.substring(0, maxLength - 3)}...`
      : description;
  },
  
  /**
   * Generate keywords from content
   */
  extractKeywords: (content: string, maxKeywords: number = 10): string[] => {
    const words = content
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const frequency: Record<string, number> = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word);
  },
  
  /**
   * Generate slug from title
   */
  generateSlug: (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/^-|-$/g, '');
  },
  
  /**
   * Validate and clean URL
   */
  cleanUrl: (url: string, baseUrl: string): string => {
    if (url.startsWith('http')) {
      return url;
    }
    
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl.replace(/\/$/, '')}${cleanUrl}`;
  },
  
  /**
   * Calculate reading time
   */
  calculateReadingTime: (content: string, wordsPerMinute: number = 200): number => {
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  },
  
  /**
   * Generate social sharing URLs
   */
  generateSocialUrls: (url: string, title: string, description?: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = description ? encodeURIComponent(description) : '';
    
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    };
  },
};

/**
 * Hook for dynamic SEO management
 */
export function useSEO() {
  const updatePageSEO = (data: PageSEOData) => {
    // Update document title
    if (data.title) {
      document.title = `${data.title} | AmarPlot`;
    }
    
    // Update meta description
    if (data.description) {
      updateMetaTag('description', data.description);
    }
    
    // Update keywords
    if (data.keywords) {
      updateMetaTag('keywords', data.keywords.join(', '));
    }
    
    // Update canonical URL
    if (data.canonical) {
      updateLinkTag('canonical', data.canonical);
    }
    
    // Update Open Graph tags
    updateMetaTag('og:title', data.title || document.title, 'property');
    updateMetaTag('og:description', data.description || '', 'property');
    if (data.image) {
      updateMetaTag('og:image', data.image, 'property');
    }
    
    // Update Twitter tags
    updateMetaTag('twitter:title', data.title || document.title, 'name');
    updateMetaTag('twitter:description', data.description || '', 'name');
    if (data.image) {
      updateMetaTag('twitter:image', data.image, 'name');
    }
  };
  
  const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
    let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    meta.content = content;
  };
  
  const updateLinkTag = (rel: string, href: string) => {
    let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    link.href = href;
  };
  
  const addStructuredData = (data: StructuredData) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  };
  
  return {
    updatePageSEO,
    addStructuredData,
  };
}