import { DatabaseSync } from "node:sqlite";
import {
  engineBrands,
  gameSubscriptions,
  ProviderId,
  providerIds,
  type Game,
} from "./main.ts";
import { existsSync, rmSync } from "node:fs";

export function createDatabase(path: string, games: Game[]) {
  // delete if exists
  if (existsSync(path)) {
    rmSync(path, { recursive: true, force: true });
  }
  const db = new DatabaseSync(path);

  db.exec(`
    CREATE TABLE games (
        provider_id TEXT NOT NULL,
        external_id TEXT NOT NULL,
        engine_brand TEXT,
        engine_version TEXT,
        subscriptions TEXT,
        PRIMARY KEY (provider_id, external_id)
    );
  `);

  const insertGame = db.prepare(`
    INSERT OR IGNORE INTO games (provider_id, external_id, engine_brand, engine_version, subscriptions) VALUES (?, ?, ?, ?, ?);
  `);

  // insert all games now with a single transaction
  db.exec("BEGIN TRANSACTION");

  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    const engine = game.engines?.[0]; // TODO take other engines into account.
    for (const [providerId, externalIds] of Object.entries(game.ids)) {
      externalIds.forEach((externalId) => {
        insertGame.run(
          providerId,
          externalId,
          engine?.brand ?? null,
          engine?.version ?? null,
          game.subscriptions?.join(",") ?? null
        );
      });
    }
  }

  db.exec("COMMIT");

  db.close();
}
