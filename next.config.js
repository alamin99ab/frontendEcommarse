/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com', //** খুবই গুরুত্বপূর্ণ **
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
             {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
        ],
    },
};

module.exports = nextConfig;