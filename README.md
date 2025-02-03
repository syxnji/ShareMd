# ShareMd

## 概要
ShareMdは、グループ間でマークダウン形式のノートを共有できるサービスです。

## デモ・スクリーンショット
![0w](https://github.com/user-attachments/assets/383b2dfc-e276-4b24-a6fa-5485295875ce)
![1w](https://github.com/user-attachments/assets/e341bd58-31ce-4758-9c4e-636d5b2633c2)
![2w](https://github.com/user-attachments/assets/597770d1-8012-4ae1-a6e8-77a13b015a8d)

## 主な機能
- **ノート作成・編集**: マークダウン形式でノートを作成・編集可能
- **グループ共有**: 特定のグループ内でノートを共有
- **グループ検索**: 公開されたグループを検索し、参加リクエストの送信が可能
- **アクセス権管理**: 読み取り専用/編集権限を設定可能

## 技術スタック
- **フロントエンド**: Next.js, React
- **バックエンド**: Next.js API Routes
- **データベース**: MySQL

## セットアップ方法
### 必要な環境・依存関係
1. リポジトリをクローン
   ```sh
   git clone <リポジトリURL>
   cd <リポジトリ名>
   ```
2. MySQLに`md.sql`のデータベースを作成
3. `.env`ファイルを設定（必要なら環境変数を記載）

### インストール・起動手順
```sh
yarn install
yarn run dev
```
アプリにアクセス: `http://localhost:3000`

## 使用方法
基本的な操作方法については、以下の動画を参照してください。
- **動画URL**: （[操作ガイド](https://drive.google.com/file/d/1KgkUoBwQ1sK66dzMynPiRdbFGXvk3BHe/view?usp=drive_link)）
