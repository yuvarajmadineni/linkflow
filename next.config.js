/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/workflow",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
