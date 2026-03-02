/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://example.com',
    generateRobotsTxt: true,
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 5000,
    exclude: [
        '/admin/*',
        '/api/*',
        '/server-sitemap.xml'
    ],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/'],
            },
        ],
    },
    transform: async (config, path) => {
        // Custom transformation for specific paths
        if (path === '/') {
            return {
                loc: path,
                changefreq: 'daily',
                priority: 1.0,
                lastmod: new Date().toISOString(),
            }
        }

        // Default transformation
        return {
            loc: path,
            changefreq: config.changefreq,
            priority: config.priority,
            lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
        }
    },
}