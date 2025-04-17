# ベースイメージ
FROM node:18-alpine

# 作業ディレクトリ
WORKDIR /app

# 依存関係を先にインストール
COPY package*.json ./
RUN npm ci

# アプリケーションコードをコピー
COPY . .

# ポートの公開
EXPOSE 3000

# 開発サーバ起動
CMD ["npm", "run", "dev"] 