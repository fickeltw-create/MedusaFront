import { MetadataRoute } from 'next'

// The crawl was done on the www version, so www is used as the canonical host.
// If your canonical domain is the non-www one, change this line only.
const BASE_URL = 'https://www.modura.be'

type Entry = MetadataRoute.Sitemap[number]

// Models shared by /catalogue/[slug] and /promotion/[slug]
const modelSlugs = [
  'maison-etudiante',
  'tiny-house',
  'maison-appartement',
  'maison-familiale',
  'space-capsule',
]

// Public documents
const documents = [
  '/documents/cahier-des-charges-fr.pdf',
  '/documents/cahier-des-charges-nl.pdf',
  '/documents/cahier-des-charges-en.pdf',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const staticPages: Entry[] = [
    { url: `${BASE_URL}`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/catalogue`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/promotion`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/financement`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/energie`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/distributeurs`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${BASE_URL}/faq`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
  ]

  const catalogueModels: Entry[] = modelSlugs.map((slug) => ({
    url: `${BASE_URL}/catalogue/${slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const promotionModels: Entry[] = modelSlugs.map((slug) => ({
    url: `${BASE_URL}/promotion/${slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const docs: Entry[] = documents.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency: 'yearly',
    priority: 0.4,
  }))

  return [...staticPages, ...catalogueModels, ...promotionModels, ...docs]
}
