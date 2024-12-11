/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Reactの厳密モードを有効化
  images: {
    domains: ['example.com'], // 画像を許可する外部ドメイン
  },
  env: {
    CUSTOM_API_URL: process.env.CUSTOM_API_URL, // 環境変数をクライアントに渡す
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, // クライアントで不要なモジュールを無効化
      };
    }
    return config;
  },
};

export default nextConfig;
