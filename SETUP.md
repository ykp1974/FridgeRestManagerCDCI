# プロジェクト初期化手順

## Step 1: Viteプロジェクト作成

以下のコマンドを実行してください（リポジトリ直下で実行）：

```bash
npm create vite@latest fridge-recipe-app -- --template react-ts
cd fridge-recipe-app
npm install
```

## Step 2: 依存パッケージ追加

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install lucide-react
```

## Step 3: 開発サーバー起動

```bash
npm run dev
```

注意: 上記コマンド実行後、`fridge-recipe-app/` ディレクトリが作成されます。
その後、以下のファイル構成に従って実装を進めます。
