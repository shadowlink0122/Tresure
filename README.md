# Tresure

## 概要
宝くじを予想するwebツールで、主にロト7(毎週金曜日に抽選)を扱います。
毎週抽選結果をクローリングし、いくつかの基準を設け統計をとります。
次の抽選の予想を立て、毎回フィードバックします。

## 技術選定

+ 言語: TypeScript `node: v21.5.0 (latest)`
  + JSONを扱いやすく、クローラ・ウェブアプリケーションを作りやすいため

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

ロト7クローラ
```sh
npm run crawl
```
