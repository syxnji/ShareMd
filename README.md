This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# フォルダ構成をツリー
my-next-app/
├── public/                   # 静的ファイル（画像、フォント、favicon など）
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
├── src/                      # ソースコードを一元管理
│   ├── app/                  # App Router のエントリポイント
│   │   ├── layout.tsx        # 全ページで共有されるレイアウト
│   │   ├── page.tsx          # ルートページ
│   │   └── [dynamic]/        # ダイナミックルート
│   │       └── page.tsx
│   ├── components/           # 再利用可能なUIコンポーネント
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── styles/               # CSS/SCSS モジュールやグローバルスタイル
│   │   ├── globals.css
│   │   └── Header.module.css
│   ├── utils/                # ユーティリティ関数やヘルパー
│   │   └── formatDate.ts
│   ├── hooks/                # カスタムフック
│   │   └── useAuth.ts
│   ├── lib/                  # APIクライアントや外部サービスとの統合
│   │   └── apiClient.ts
│   ├── types/                # TypeScript の型定義
│   │   └── user.d.ts
│   ├── middleware.ts         # Next.js のミドルウェア
│   └── pages/                # API Routes（必要に応じて使用）
│       ├── api/
│       │   └── hello.ts
│       └── _document.tsx     # HTML構造のカスタマイズ
├── .env                      # 環境変数
├── next.config.js            # Next.js の設定
├── tsconfig.json             # TypeScript の設定
├── package.json              # npm パッケージ管理
└── README.md                 # プロジェクト説明