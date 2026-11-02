/** @type {import('next').NextConfig} */

// Canonical production address: always https + www.
const CANONICAL_HOST = "www.fiveboroughbulletin.com";
const APEX_HOST = "fiveboroughbulletin.com";

const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      // fiveboroughbulletin.com (http or https)  ->  https://www.fiveboroughbulletin.com
      {
        source: "/:path*",
        has: [{ type: "host", value: APEX_HOST }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
      // http://www.fiveboroughbulletin.com  ->  https://www.fiveboroughbulletin.com
      // (Vercel already forces HTTPS on its edge; this is a safety net.)
      {
        source: "/:path*",
        has: [
          { type: "host", value: CANONICAL_HOST },
          { type: "header", key: "x-forwarded-proto", value: "http" },
        ],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
      // Note: only the custom domain is redirected. The *.vercel.app URL(s)
      // are deliberately left alone so they keep serving the site.
    ];
  },
};

export default nextConfig;
