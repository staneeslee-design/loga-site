import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  agentRules: false, // no auto-generated AGENTS.md / CLAUDE.md
  images: { localPatterns: [{ pathname: '/api/media/file/**' }] },
  // Lithuanian is the default language and lives at the site root (/, /automobiliai…).
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/lt' },
        { source: '/automobiliai', destination: '/lt/automobiliai' },
        { source: '/automobiliai/:slug', destination: '/lt/automobiliai/:slug' },
        { source: '/varikliai', destination: '/lt/varikliai' },
        { source: '/varikliai/:slug', destination: '/lt/varikliai/:slug' },
        { source: '/privatumas', destination: '/lt/privatumas' },
      ],
      afterFiles: [],
      fallback: [],
    }
  },
  async redirects() {
    return [
      { source: '/lt', destination: '/', permanent: true },
      { source: '/lt/:path*', destination: '/:path*', permanent: true },
    ]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: { root: path.resolve(dirname) },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
