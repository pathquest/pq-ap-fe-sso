/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    GOOGLE_ACCOUNT_OAUTH_URL: process.env.GOOGLE_ACCOUNT_OAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    QUICKBOOKS_CLIENT_ID: process.env.QUICKBOOKS_CLIENT_ID,
    QUICKBOOKS_CLIENT_SECRET: process.env.QUICKBOOKS_CLIENT_SECRET,
    QUICKBOOKS_REDIRECT_URI: process.env.QUICKBOOKS_REDIRECT_URI,
    OPEN_AI: process.env.OPEN_AI,
    AUTH_SECRET: process.env.AUTH_SECRET,

    STRAPI_URL: process.env.STRAPI_URL,

    API_SSO: process.env.API_SSO,
    API_PROFILE: process.env.API_PROFILE,
    API_MANAGE: process.env.API_MANAGE,
    HOST_URL: process.env.HOST_URL,

    SSO_SUCCESS_REDIRECT_URI: process.env.SSO_SUCCESS_REDIRECT_URI,
    BI_REDIRECTURI: process.env.BI_REDIRECTURI
  },
  images: {
    domains: ['nextpqap.azurewebsites.net'],
  },
  // output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  future: { webpack5: true },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    return config
  },
}

module.exports = nextConfig
