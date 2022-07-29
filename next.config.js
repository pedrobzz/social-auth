/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ["blog.123milhas.com", "avatars.dicebear.com"],
  },
};

module.exports = nextConfig;
