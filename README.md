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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## テスト

### ローカル PWA テスト（iPhone Safari）
1. `npm run build` を実行し、プロダクションビルドを作成
2. `npm run start` でサーバーを起動
3. PC と同じネットワーク上の iPhone で `http://<開発マシンのIP>:3000` にアクセス
4. Safari の共有メニューから「ホーム画面に追加」を選択し PWA としてインストール
5. オフライン時に起動してキャッシュ動作を確認

### Docker コンテナでのテスト
1. `docker-compose up --build -d` でコンテナを起動
2. ブラウザで `http://localhost:3001` にアクセス
3. Safari の共有メニューから「ホーム画面に追加」を選択し PWA としてインストール
4. オフライン時に起動してキャッシュ動作を確認

## デプロイ

### Vercel へのデプロイ
1. GitHub（または Git リポジトリ）を作成してコードをプッシュ
2. Vercel ダッシュボードで新規プロジェクトをインポート
3. 必要に応じて環境変数を設定（例：NEXT_PUBLIC_*）
4. `main` ブランチへのプッシュで自動的にビルド・デプロイが実行される
