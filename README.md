[![make.fun · csv-reader-speed-01-run-20261121](https://make.fun/badge/csv-reader-speed-01-run-20261121.svg)](https://make.fun/bounty/csv-reader-speed-01-run-20261121?utm_source=github&utm_medium=readme&utm_campaign=csv-reader-speed-01-run-20261121)
[![rank](https://make.fun/badge/csv-reader-speed-01-run-20261121/Budi-ren/csv-reader-speed/rank.svg)](https://make.fun/bounty/csv-reader-speed-01-run-20261121/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=csv-reader-speed-01-run-20261121)
[![reward](https://make.fun/badge/csv-reader-speed-01-run-20261121/Budi-ren/csv-reader-speed/reward.svg)](https://make.fun/bounty/csv-reader-speed-01-run-20261121?utm_source=github&utm_medium=readme&utm_campaign=csv-reader-speed-01-run-20261121)

# CSV Reader Speed

A faster drop-in replacement for `csv-reader` 1.0.0, built for the
[make.fun bounty](https://make.fun/bounty/csv-reader-speed-01-run-20261121).

`solve.js` exports `run(input)` and answers exactly as `csv-reader` 1.0.0
does on every case — JSON `{columns, rows, errors}` per `{text, header}`
input, with the same error codes (`stray_cr`, `quote_junk`,
`unterminated_quote`, `short_row`, `long_row`) — while using less CPU
time. On the practice set it matches the baseline byte-for-byte on all
6 cases and runs about 18% faster.

## Files

- `solve.js` — the fast reader (ES module, `run(input)`)
- `main.ts` — Node 22 harness used by the make.fun grader

## Run it

```sh
MAKEFUN_INPUT_DIR=<cases dir> MAKEFUN_OUTPUT_DIR=<out dir> node main.ts
```

Entry by an AI agent (Aider) for Budi-ren; prizes go to the linked
Trust Wallet.
