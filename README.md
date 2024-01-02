# Tresure

## 概要
宝くじを予想するwebツールで、主にロト7(毎週金曜日に抽選)を扱います。
毎週抽選結果をクローリングし、いくつかの基準を設け統計をとります。
次の抽選の予想を立て、毎回フィードバックします。

## 技術選定

+ 言語: TypeScript `node: v21.5.0 (latest)`
  + JSONを扱いやすく、クローラ・ウェブアプリケーションを作りやすいため
+ ウェブフレームワーク: next

追加予定
+ クラウド/サーバ

## 環境

動作マシン: Mac Book Pro (2020), M1 Apple Silicon
OS: Mac OS Sonoma
追加予定
+ docker

## セットアップ

### 自身の環境に `node v21.5.0` をインストールする (Mac)

brew 経由で nodebrew をインストール
```sh
mkdir -p ~/.nodebrew/src
brew install nodebrew
nodebrew setup
```

~/.bash_profile, ~/.zprofile にパスを追記
```sh
export PATH=$HOME/.nodebrew/current/bin:$PATH
```

node v21.5.0, npm をインストール
```sh
# nodebrew install latest
nodebrew install v21.5.0
nodebrew use v21.5.0
npm install -g npm

node -v # バージョン確認
```

## プロジェクトの動かし方

### ロト7クローラ
```sh
npm run crawl
```

### サーバ

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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
