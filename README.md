# Mobile First Daily Interface (MFDI)

[![release](https://img.shields.io/github/release/tadashi-aikawa/mobile-first-daily-interface.svg)](https://github.com/tadashi-aikawa/mobile-first-daily-interface/releases/latest)
![downloads](https://img.shields.io/github/downloads/tadashi-aikawa/mobile-first-daily-interface/total)

![image](https://raw.githubusercontent.com/tadashi-aikawa/mobile-first-daily-interface/master/image.png)


[Obsidian]にてモバイルに最適なインターフェースでデイリーノートを扱うプラグインです。

- SNSやチャットツールのようなUI
- 記録先はデイリーノート

> **Note**
> 本プラグインは[Obsidian Memos]の影響を強く受けています。そのため、[コミュニティプラグイン]には登録しません。また、英語のREADMEを記載する予定もありません。

## 対応OS

[Obsidian]がサポートする全てのプラットフォーム/OSに対応しているつもりです。

- Windows
- macOS (動作未確認)
- Linux (動作未確認)
- Android
- iOS (動作未確認)
- iPadOS (動作未確認)

画面はスマートフォンに最適化されていますが、PCやタブレットでも利用できます。

## ⏬インストール

[BRAT]を使って`tadashi-aikawa/mobile-first-daily-interface`でインストールします。

## 起動方法

- メインのタブに表示する場合
    - リボンメニューの『Mobile First Daily Interface』という鉛筆マークをクリック
- レフトリーフ(左サイドバー)に表示する場合
    - レフトリーフの『Mobile First Daily Interface』という鉛筆マークをクリック

## 対応機能/ロードマップ

- [x] メッセージの投稿
  - [x] Markdown形式に対応
  - [x] サイトや画像のURLはプレビュー展開
- [x] タスクの追加・完了/未完了の切り替え
- [x] デイリーノートの自動生成
- [x] カレンダーUI
- [x] サイドリーフ表示
- [ ] タイムラインの時刻昇順表示

## FAQ

### なぜMFDIを作ったのか?

[Obsidian Memos]を使わず、自作した背景には動作速度の問題があります。

デイリーノートが1000ファイル近くあるせいか、[Obsidian Memos]ではメモの表示や投稿時に3～5秒程度固まってしまい実用に支障がありました。また、[Obsidian Memos]はしばらく更新されていなそうだったため、自分で必要な機能のみを搭載したプラグインを開発した方が良いと判断しました。

> **Note**
> 2023-07-09現在、[Obsidian Memos]はバージョン2.0に向けて開発を行っており、クローズドベータ版を提供されているようです。もしかすると、私が直面した問題は2.0ですべて解決しているかもしれません。

### [Obsidian Memos]との違いは?

[Obsidian Memos]と一番異なるのは、**1度に1日分のデイリーノートしか読み込まない**点です。そのため、表示速度が速く、メモリ使用量が小さくなり、性能の悪い端末や大きなVaultでの利用に適しています。

また、タスク管理などデイリーに関連する機能は積極的にサポートしていく予定です。

### 投稿を編集/削除したい場合は?

デイリーノートを直接編集してください。

## その他

Mobile First Daily Interfaceに関するブログ記事もご覧ください。

[📘Obsidian Memos みたいなプラグイン Mobile First Daily Interfaceを作ったワケ \- Minerva](https://minerva.mamansoft.net/%F0%9F%93%98Articles/%F0%9F%93%98Obsidian+Memos+%E3%81%BF%E3%81%9F%E3%81%84%E3%81%AA%E3%83%97%E3%83%A9%E3%82%B0%E3%82%A4%E3%83%B3+Mobile+First+Daily+Interface%E3%82%92%E4%BD%9C%E3%81%A3%E3%81%9F%E3%83%AF%E3%82%B1)


[Obsidian]: https://obsidian.md/
[BRAT]: https://github.com/TfTHacker/obsidian42-brat
[Obsidian Memos]: https://github.com/Quorafind/Obsidian-Memos
[コミュニティプラグイン]: https://help.obsidian.md/Advanced+topics/Community+plugins
