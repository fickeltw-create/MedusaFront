import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://modura.be',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // If you have other main pages (like /catalog or /contact), add them here later like this:
    // {
    //   url: 'https://modura.be/catalog',
    //   lastModified: new Date(),
    //   changeFrequency: 'weekly',
    //   priority: 0.8,
    // },
  ]
}
