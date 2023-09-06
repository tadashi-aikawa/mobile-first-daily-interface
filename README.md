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

<div class="link-card">
	<div class="link-card-header">
		<img src="https://publish-01.obsidian.md/access/35d05cd1bf5cc500e11cc8ba57daaf88/favicon-64.png" class="link-card-site-icon"/>
		<span class="link-card-site-name">minerva.mamansoft.net</span>
	</div>
	<div class="link-card-body">
		<div class="link-card-content">
			<div>
				<p class="link-card-title">📘Obsidian Memos みたいなプラグイン Mobile First Daily Interfaceを作ったワケ</p>
			</div>
			<div class="link-card-description">
Obsidian Memosの影響を受けて、🦉Mobile First Daily InterfaceというObsidianプラグインを作りました。
本記事では🦉Mobile First Daily Interfaceについて、なぜ作ったのか? 何ができるのか? どう使うのか? を紹介します。
			</div>
		</div>
		<img src="https://publish-01.obsidian.md/access/35d05cd1bf5cc500e11cc8ba57daaf88/%F0%9F%93%98Articles/attachments/2023-08-25.jpg" class="link-card-image" />
	</div>
	
    <a
      class="internal-link"
      data-href="📘Obsidian Memos みたいなプラグイン Mobile First Daily Interfaceを作ったワケ"
    ></a>
  
</div>


[Obsidian]: https://obsidian.md/
[BRAT]: https://github.com/TfTHacker/obsidian42-brat
[Obsidian Memos]: https://github.com/Quorafind/Obsidian-Memos
[コミュニティプラグイン]: https://help.obsidian.md/Advanced+topics/Community+plugins
