# Mobile First Daily Interface (MFDI)

[![release](https://img.shields.io/github/release/tadashi-aikawa/mobile-first-daily-interface.svg)](https://github.com/tadashi-aikawa/mobile-first-daily-interface/releases/latest)
![downloads](https://img.shields.io/github/downloads/tadashi-aikawa/mobile-first-daily-interface/total)

![image](https://raw.githubusercontent.com/tadashi-aikawa/mobile-first-daily-interface/master/image.png)

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

[BRAT]を使って`tadashi-aikawa/mobile-first-daily-interface`でインストールします。

## 起動方法

[リボン]の『Mobile Memo』という鉛筆マークをクリックしてください。

クイック投稿（モーダル）

- [リボン]の『+』アイコン（ツールチップ: "Mobile Memo（モーダル投稿）"）をクリック
- もしくは、コマンドパレットで「Mobile Memo: モーダルで投稿」を実行

デフォルトでは左サイドリーフに開かれます。

## 設定

### 投稿形式

`default: コードブロック`

MFDI の投稿がエディタ上でどのような形式になるかを指定します。

- コードブロック
- 見出し 1
- 見出し 2
- 見出し 3
- 見出し 4
- 見出し 5
- 見出し 6
- リスト

### 表示リーフ（PC/モバイル）

`default: left`

PC とモバイルで MFDI View を表示するリーフをそれぞれ指定できます。

- PC 向け: 表示リーフ（PC）
- モバイル向け: 表示リーフ（モバイル）

| 設定値  | 意味                               |
| ------- | ---------------------------------- |
| left    | 左サイドリーフに表示します         |
| right   | 右サイドリーフに表示します         |
| current | **現在選択中のリーフ**に表示します |

### Obsidian 起動時に自動起動・アクティブにする

`default: false`

有効にすると、Obsidian 起動時に MFDI が立ち上がります。

- 1 つ以上の MFDI View が存在する場合
  - 最初の 1 つをアクティブにします (**[表示リーフ]の設定は考慮しません**)
- MFDI View が存在しない場合
  - [表示リーフ]の設定に従い、View を新規作成してアクティブにします

### モバイル起動時にクイックメモを自動表示

`default: false`

モバイル環境で Obsidian を起動したときに、クイックメモのモーダルを自動で開きます。

また、アプリを一度閉じる（バックグラウンドへ移動）→再度開く場合にも自動表示します。

### デイリーノート

#### デイリーノートのディレクトリ

`default: ''`（空）

Vault 相対のフォルダを指定します。空の場合は Obsidian の「Daily Notes」設定（フォルダ/フォーマット）に従います。

- 例: `Journal/Daily`
- 空でない場合は、そのフォルダ配下に `YYYY-MM-DD.md`（Daily Notes のフォーマットに準拠）を作成・利用します。
- 注意: ディレクトリを上書きしている場合、現時点では Daily Notes のテンプレートは適用されず、空ファイルから作成します。

#### メモの追記先見出し

`default: ''`（空）

追記先を“# …”のように指定します。該当見出しが存在しない場合は自動で見出しを作成して、そのセクション末尾に追記します。空の場合はファイル末尾に追記します。

- 例: `## つぶやき`
- 対象見出しの「同レベル以上の次見出し」直前、またはファイル末尾に追記します。

#### メモの追記区切り

`default: ''`（空）

指定された見出しの下からこの区切り文字列の上までが追記先になります。

#### 投稿日時フォーマット

`default: YYYY-MM-DD HH:mm`

投稿時に付与する日時のフォーマットを指定します。

#### 投稿見出しを自動で段下げ

`default: true`

「投稿形式」が見出しの場合、追記先見出しより 1 段下のレベルに自動調整します（例: 追記先が`##`なら投稿は`###`）。

- OFF にすると、設定した見出しレベルのまま投稿します。

### タスク

タスクは常に `- [ ] <接頭辞><本文><接尾辞>` の形式で追加されます。

#### タスクの追記先見出し

`default: ## ☑️ タスク`

タスクを追加する見出しを指定します。見出しが存在しない場合は、デイリーノートの末尾に見出しとタスクを作成します。

#### タスクの追記区切り

`default: ---`

指定したタスク見出しの下から、この区切り文字列の上までが追記先になります。

#### タスクの接頭辞・接尾辞

`default: ''`（空）

タスク本文の前後に付ける文字列を個別に指定できます。空白は自動補完せず、入力されたとおりに使用します。

接頭辞と接尾辞では `{{timestamp}}` を使用できます。「投稿日時フォーマット」が `HH:mm` の場合、接頭辞を `{{timestamp}} `、接尾辞を ` #todo` にすると、次のように追加されます。

```markdown
- [ ] 12:34 タスク本文 #todo
```

## 対応機能/ロードマップ

- [x] メッセージの投稿
  - [x] Markdown 形式に対応
  - [x] サイトや画像の URL はプレビュー展開
- [x] タスクの追加・完了/未完了の切り替え
- [x] デイリーノートの自動生成
- [x] カレンダー UI
- [x] サイドリーフ表示
- [x] 自動起動
- [x] Bluesky 投稿機能
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

以下のケースに該当しないか確認してください。たとえば、カレントリーフへ自動起動したいのに、左サイドリーフにも MFDI の View が存在する場合はそれを削除する必要があります。

> - 1 つ以上の MFDI View が存在する場合
>   - 最初の 1 つをアクティブにします (**[表示リーフ]の設定は考慮しません**)

また、[表示リーフ]が左サイドリーフや右サイドリーフになっている場合は、サイドリーフ内で MFDI がアクティブになっているだけです。いきなりサイドリーフが Open されるわけではありません。

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

[Release Action](https://github.com/tadashi-aikawa/mobile-first-daily-interface/actions/workflows/release.yaml) を実行。

[Obsidian]: https://obsidian.md/
[BRAT]: https://github.com/TfTHacker/obsidian42-brat
[Obsidian Memos]: https://github.com/Quorafind/Obsidian-Memos
[Thino]: https://github.com/Quorafind/Obsidian-Thino
[コミュニティプラグイン]: https://help.obsidian.md/Advanced+topics/Community+plugins
[表示リーフ]: #表示リーフ
[リボン]: https://minerva.mamansoft.net/Notes/%E3%83%AA%E3%83%9C%E3%83%B3%20(Obsidian)
[Obsidian起動時に自動起動・アクティブにする]: #obsidian起動時に自動起動・アクティブにする
