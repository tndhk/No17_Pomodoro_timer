# FocusNest Web App - 詳細設計 & タスクリスト

## 1. プロジェクト概要

iOSユーザー向けに、スマホ使用を抑えるためのPomodoroタイマーとShortcuts連携を活用したWebアプリ。PWA対応でホーム画面からワンタップ起動可能。

---

## 2. 技術スタック

- フレームワーク: **Next.js v14 (App Router)**
- 言語: **TypeScript**
- UI: **Tailwind CSS**
- 状態管理: **React Hooks**
- PWA対応: **next-pwa**
- デプロイ: **Vercel**
- 対応端末: **iPhone Safari (PWA化前提)**

---

## 4. 機能詳細

### 4.1 Pomodoro タイマー

- 25分集中 → 5分休憩（ループなし・手動リスタート）
- 状態: `idle | running | break | completed`
- Hooksで実装：`usePomodoro.ts`

### 4.2 Shortcuts起動ボタン

- URL: `shortcuts://run-shortcut?name=FocusStart`
- `<a href={url}>` タグで開く形式（Safari限定）

### 4.3 メッセージ表示

- 開始時: ランダム表示（3〜5種類を配列管理）
- 終了時: ブレイク時間中に表示

### 4.4 PWA対応

- `next-pwa`でキャッシュ・オフライン対応
- `manifest.json`, `service-worker.js`, `icons` 設置

---

## 5. UI構成（1ページ構成）

+------------------------------+
|      FocusNest Logo         |
|-----------------------------|
|      [25:00]                | ← タイマー
|  "今、何に集中したい？"      | ← メッセージ
|                             |
| [Start Focus Session]       | ← Shortcutsリンク
| [Reset]                     | ← 状態リセット用
+------------------------------+


## 7. メッセージサンプル

```ts
export const focusMessages = [
  "今、何に集中したい？",
  "スマホを触る前に、目的を考えよう。",
  "25分間、自分の未来に投資しよう。",
  "その通知、本当に今必要？"
];

export const breakMessages = [
  "よく頑張ったね！少し休憩しよう。",
  "スクロールする前に、深呼吸1つ。",
  "今、スマホに何を求めてる？"
];
```

---

## 8. 今後の拡張案（タスク外）

- [ ] セッションログをローカルストレージに保存
- [ ] タイマー時間の変更機能（15/25/50）
- [ ] ウィジェット（iOS 17以降のWeb対応を見て）

---

## 9. 注意事項（iOS特有）

- `shortcuts://` は **Safariからのみ有効**
- ホーム画面追加時は PWA内でも起動可能
- 他ブラウザでは挙動保証しない（対応は最低限で）

---

## 10. ショートカット作成ガイド（README内に記述）

### FocusStartショートカットの作成方法

1. iPhoneの「ショートカット」アプリを開く
2. 「+」から新規作成
3. 「集中モードを開始」→ 時間指定（例：30分）
4. （任意）「特定のアプリを制限」アクションを追加（iOS 17+）
5. 名前を「FocusStart」に設定
6. 完了後、Webアプリから「Start Focus Session」をタップすると起動

---
