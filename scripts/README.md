# Rai Pal DB Scripts

Requires [Deno](https://deno.com/).

Run `deno task generate-types` for development, otherwise you'll get type
errors.

## Environment variables

Copy `.env.example` to `.env` and fill in what you need. The `update-game-db`
and `update-mod-db` tasks load it automatically.

- `GITHUB_TOKEN` — used by the mod DB to avoid GitHub API rate limits.
- `PCGAMINGWIKI_USERNAME` / `PCGAMINGWIKI_PASSWORD` — PCGamingWiki credentials
  used by the game DB. Anonymous Cargo queries are rejected, so you need a bot
  account with the `runcargoqueries` permission. Create a bot password at
  https://www.pcgamingwiki.com/wiki/Special:BotPasswords and set the username to
  the bot login (e.g. `Account@Bot`) plus the generated password. Without these,
  the game DB update aborts instead of silently dropping all non-Steam data.
- `ALLOW_PARTIAL_GAME_DB=1` — write the game DB even when a source fails. Only
  use this if you understand the data loss it causes.
