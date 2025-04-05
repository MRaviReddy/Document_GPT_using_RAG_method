const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    useFileSystemPublicRoutes: false,
    basePath: process.env.UI_CONTEXT_ROOT,
    compress: false,
    publicRuntimeConfig: {
        appInfo: {
            name: 'DOC Gpt',
            version: '1.0.0',            
        },
        homePage: '/',
        BASE_URL: process.env.BASE_URL || 'http://localhost:8000',        
    }
}
module.exports = nextConfig