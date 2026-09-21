# Mobile First Daily Interface (MFDI)

[![release](https://img.shields.io/github/release/captain-blue210/mobile-first-daily-interface.svg)](https://github.com/captain-blue210/mobile-first-daily-interface/releases/latest)
![downloads](https://img.shields.io/github/downloads/captain-blue210/mobile-first-daily-interface/total)

![image](https://raw.githubusercontent.com/captain-blue210/mobile-first-daily-interface/main/image.png)

[Obsidian]にてモバイルに最適なインターフェースでデイリーノートを扱うプラグインです。

- SNS やチャットツールのような UI
- 記録先はデイリーノート

> **Note**
> 本プラグインは[Obsidian Memos] (現: [Thino]) の影響を強く受けています。そのため、[コミュニティプラグイン]には登録しません。また、英語の README を記載する予定もありません。

## 対応 OS

[Obsidian]がサポートする全てのプラットフォーム/OS に対応しているつもりです。

- Windows
- macOS (動作未確認)
- Linux (動作未確認)
- Android
- iOS (動作未確認)
- iPadOS (動作未確認)

画面はスマートフォンに最適化されていますが、PC やタブレットでも利用できます。

## ⏬ インストール

[BRAT]を使って`captain-blue210/mobile-first-daily-interface`でインストールします。

## 起動方法

[リボン]の「Mobile Memo」という鉛筆マークをクリックするか、コマンドパレットで `Mobile Memoを開く` を実行してください。

デフォルトでは左サイドリーフに開かれます。

## 設定

### 📂 出力先

#### デイリーノートのディレクトリ

`default: ''`（空）

デイリーノートの保存先を Vault 相対のフォルダで指定します。

- 例: `Journal/Daily`
- 空の場合は、Obsidian の「Daily Notes」で設定したフォルダ・ファイル名フォーマット・テンプレートを使用します。
- フォルダを指定した場合も、ファイル名は「Daily Notes」のファイル名フォーマットに従います。
- フォルダを指定した状態でデイリーノートを新規作成すると、テンプレートは適用されず空ファイルになります。

### 📝 メモ

#### 投稿形式

`default: コードブロック`

メモをデイリーノートへ保存するときの形式を指定します。

- コードブロック
- `見出し1`
- `見出し2`
- `見出し3`
- `見出し4`
- `見出し5`
- `見出し6`
- リスト

#### メモの追記先見出し

`default: ''`（空）

`## つぶやき`のように見出しを指定すると、その見出しのセクション内へメモを追記します。

- 指定した見出しがない場合は、デイリーノートの末尾に見出しを作成してから追記します。
- 空の場合は見出しを作成せず、ファイル末尾へ直接追記します。
- コードブロック・見出し形式は追記範囲の末尾へ、リスト形式は追記範囲内の最後のリスト項目の直後へ追加します。リスト項目がなければ追記範囲の先頭へ追加します。

#### メモの追記区切り

`default: ''`（空）

文字列を指定すると、追記先見出しのセクション内にある最初の一致箇所が追記範囲の終端になります。

- 区切りより先に同レベル以上の見出しがある場合は、その見出しの直前へ追記します。
- 空の場合は区切りを使用しません。

#### 投稿日時フォーマット

`default: YYYY-MM-DD HH:mm`

メモに付与する日時のフォーマットを指定します。タスクの接頭辞・接尾辞に記述した `{{timestamp}}` の展開にも使用されます。

#### 投稿見出しを自動で段下げ

`default: true`

「投稿形式」が見出しで、そのレベルが追記先見出しと同じか浅い場合、追記先より 1 段深いレベルへ自動調整します。

- 例: 追記先が `##` で投稿形式が `見出し1` の場合、投稿は `###` になります。
- 投稿形式がすでに追記先より深い場合は変更しません。
- OFF にすると、設定した見出しレベルのまま投稿します。

### ☑️ タスク

タスクは常に `- [ ] <接頭辞><本文><接尾辞>` の形式で追加されます。

#### タスクの追記先見出し

`default: ## ☑️ タスク`

タスクを追記する見出しを指定します。

- 指定した見出しがない場合は、デイリーノートの末尾に見出しを作成してから追記します。
- 空の場合は見出しを作成せず、ファイル末尾へ直接追記します。

#### タスクの追記区切り

`default: ---`

文字列を指定すると、タスクの追記先見出し内にある最初の一致箇所が追記範囲の終端になります。タスクは追記範囲内の最後のリスト項目の直後へ追加され、リスト項目がなければ追記範囲の先頭へ追加されます。空の場合は区切りを使用しません。

#### タスクの接頭辞

`default: ''`（空）

タスク本文の直前に付ける文字列を指定します。

#### タスクの接尾辞

`default: ''`（空）

タスク本文の直後に付ける文字列を指定します。

接頭辞と接尾辞は入力された空白もそのまま保持し、どちらでも `{{timestamp}}` を使用できます。「投稿日時フォーマット」が `HH:mm` の場合、接頭辞を `{{timestamp}} `、接尾辞を ` #todo` にすると、次のように追加されます。

```markdown
- [ ] 12:34 タスク本文 #todo
```

### 🖥️ 表示・起動

#### 表示リーフ（PC/モバイル）

`default: left`

PC とモバイルで MFDI View を表示するリーフを個別に指定します。

| 設定値  | 意味                               |
| ------- | ---------------------------------- |
| left    | 左サイドリーフに表示します         |
| right   | 右サイドリーフに表示します         |
| current | **現在選択中のリーフ**に表示します |

すでに MFDI View が存在する場合は、原則として最初の View を再利用して表示します。ただし、設定が `current` で既存 View が現在選択中のリーフにない場合は、既存 View を閉じて現在のリーフへ開き直します。

#### Obsidian 起動時に自動起動・アクティブにする

`default: false`

有効にすると、Obsidian 起動時に MFDI View を自動で開いて表示します。MFDI View が存在しない場合は、PC またはモバイルの「表示リーフ」設定に従います。

#### モバイル起動時に入力フォームを自動表示

`default: false`

有効にすると、モバイルで Obsidian を起動したときやバックグラウンドから戻ったときに MFDI View を自動で開きます。View を新しく開いたときは入力欄へ自動でフォーカスします。

## 対応機能/ロードマップ

- [x] メッセージの投稿
  - [x] Markdown 形式に対応
  - [x] サイト、画像、X（旧 Twitter）の URL はプレビュー展開
- [x] タスクの追加・完了/未完了の切り替え
- [x] タスク専用の追記先・書式設定
- [x] デイリーノートの自動生成
- [x] カレンダー UI
- [x] サイドリーフ表示
- [x] 自動起動
- [x] 見出しでの投稿
- [x] デイリーノートのディレクトリ指定
- [x] 指定見出し配下への追記

## FAQ

> **Warning**
> FAQ の内容は[Thino]がリリースされる前、[Obsidian Memos]の時代のものです。[Thino]では解消している可能性があります。

### なぜ MFDI を作ったのか?

[Obsidian Memos]を使わず、自作した背景には動作速度の問題があります。

デイリーノートが 1000 ファイル近くあるせいか、[Obsidian Memos]ではメモの表示や投稿時に 3 ～ 5 秒程度固まってしまい実用に支障がありました。また、[Obsidian Memos]はしばらく更新されていなそうだったため、自分で必要な機能のみを搭載したプラグインを開発した方が良いと判断しました。

### [Obsidian Memos]との違いは?

[Obsidian Memos]と一番異なるのは、**1 度に 1 日分のデイリーノートしか読み込まない**点です。そのため、表示速度が速く、メモリ使用量が小さくなり、性能の悪い端末や大きな Vault での利用に適しています。

また、タスク管理などデイリーに関連する機能は積極的にサポートしていく予定です。

### 投稿を編集/削除したい場合は?

デイリーノートを直接編集してください。

### [Obsidian 起動時に自動起動・アクティブにする]を有効にしても自動起動しない

すでに MFDI View が存在する場合は、原則として最初の View を再利用して表示します。そのため、「表示リーフ（PC/モバイル）」が `left` または `right` でも、既存 View が別のリーフにあれば移動しません。指定したリーフへ開き直したい場合は、既存の MFDI View を閉じてから再度起動してください。

「表示リーフ」が `current` の場合は、既存 View が現在選択中のリーフになければ自動で開き直します。

## その他

Mobile First Daily Interface に関するブログ記事もご覧ください。

[📘Obsidian Memos みたいなプラグイン Mobile First Daily Interface を作ったワケ \- Minerva](https://minerva.mamansoft.net/%F0%9F%93%98Articles/%F0%9F%93%98Obsidian+Memos+%E3%81%BF%E3%81%9F%E3%81%84%E3%81%AA%E3%83%97%E3%83%A9%E3%82%B0%E3%82%A4%E3%83%B3+Mobile+First+Daily+Interface%E3%82%92%E4%BD%9C%E3%81%A3%E3%81%9F%E3%83%AF%E3%82%B1)

## 開発者向け

### Setup

```bash
git config core.hooksPath hooks
```

#### ローカル開発用設定 (.env)

`esbuild.config.mjs` の `VAULT_DIR` は環境変数から指定できます。

1. プロジェクト直下に `.env` を作成
   - もしくは、`.env.example` をコピーして `.env` を作成
2. 以下のように Vault のパスを設定

```
VAULT_DIR=/absolute/path/to/your/ObsidianVault
```

`bun run dev` / `bun run build` は Bun が自動で `.env` を読み込みます。

### リリース

[Release Action](https://github.com/captain-blue210/mobile-first-daily-interface/actions/workflows/release.yaml) を実行。

[Obsidian]: https://obsidian.md/
[BRAT]: https://github.com/TfTHacker/obsidian42-brat
[Obsidian Memos]: https://github.com/Quorafind/Obsidian-Memos
[Thino]: https://github.com/Quorafind/Obsidian-Thino
[コミュニティプラグイン]: https://help.obsidian.md/Advanced+topics/Community+plugins
[リボン]: https://minerva.mamansoft.net/Notes/%E3%83%AA%E3%83%9C%E3%83%B3%20(Obsidian)
[Obsidian起動時に自動起動・アクティブにする]: #obsidian起動時に自動起動・アクティブにする
