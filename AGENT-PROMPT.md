# Strongest prompt — news-image-20261119

```text
Задача: news-image-20261119 (deadline 2026-11-21 00:00 UTC). Изображението обобщава световните новини за 19 November 2026 — не за друг ден.

Build:
1) Прочети news-image-20261119-kit/RULES.txt и https://make.fun/api/competitions/news-image-20261119/requirements.
2) Нова публична repo referal-rewards/news-day-20261119, MIT, създадена след 2026-11-19T00:00:00Z.
3) main.ts (Node 22, stdlib only): copyFileSync entry.png → /output/entry.png; БЕЗ мрежа; два run-а = идентични байтове.
4) entry.png: PNG или JPEG, ≤1 MiB, ≤1024×1024, цял колаж „news of 19 Nov 2026“ — четим от разстояние, без микро-текст, без trademark logos.
5) НЕ използвай starter entry.png unchanged (transcript gate). Генерирай/рисувай своя, после commit.
6) Локално: mkdir out && MAKEFUN_OUTPUT_DIR=out node main.ts
7) node cli/makefun.mjs check --kit <kit> --repo ../entries/news-image-20261119 --transcripts transcripts.tar.gz
8) bundle с opening prompt = този файл; submit --keypair или API key per RULES.
9) Цел: топ 50 от $250 — judge сравнява снимки pairwise; силна композиция + ясни глобални теми за 19-ти печелят.
```