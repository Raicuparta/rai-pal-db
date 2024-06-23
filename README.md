# Rai Pal Mod Database

Simple database made up of json files, to be used by [Rai Pal](https://raicuparta.com/rai-pal) for fetching available mods.

## Structure

The database JSON files are stored in this repo, in the path `mod-db/[db-version]/[mod-loader-id].json`.

### Database Version

`[db-version]` just a number we increment, so we can serve multiple incompatible versions of the database simultaneously and avoid breaking old versions of Rai Pal.

Whenever a backwards-incompatible change needs to be made to the database, or whenever we want to add mods / mod loaders that rely on new changes to Rai Pal, we make a new copy of the database files in the next version folder.

We then need to update the `DATABASE_VERSION` constant in Rai Pal to match the latest database version number. This constant is in [rai-pal/backend/src/mod_loaders/mod_database.rs](https://github.com/Raicuparta/rai-pal/blob/main/backend/src/mod_loaders/mod_database.rs) at the time of writing this, but I'll probably move that file at some point and forget to update this readme.

### Mod Loader ID

The name of the JSON file needs to match the mod loader ID used in Rai Pal. For example, BepInEx has the ID `bepinex`, which you can find in [rai-pal/backend/src/mod_loaders/bepinex.rs](https://github.com/Raicuparta/rai-pal/blob/main/backend/src/mod_loaders/bepinex.rs):

```rust
impl ModLoaderStatic for BepInEx {
	const ID: &'static str = "bepinex";
// ...
}
```

So when adding support for different mod loaders in Rai Pal, you'd just need to make sure to give it a unique ID in the implementation, and a matching json file in the database.

## Reading the Database

This repo is automatically deployed to GitHub pages, so the best way to access the data and avoid agressive caching is via this URL:

`https://raicuparta.github.io/rai-pal-db/mod-db/[db-version]/[mod-loader-id].json`

Example: https://raicuparta.github.io/rai-pal-db/mod-db/0/bepinex.json

There are JSON schemas available in [/mod-db/schema](/mod-db/schema) that you can use to understand the format of the database files.

## Steam IDs

In [/steam-ids](/steam-ids) you'll find a bunch of text files. These contain flat lists of Steam IDs, one file per game engine. This is just an easier way for Rai Pal to fetch engine information about each Steam game.

## Legacy Files

A few of the files in this repo are only here to make sure old versions of Rai Pal don't stop working, but will likely be removed in the future.
- `./bepinex.json`
- `./runnable.json`
- `./uevr.json`
- `./steam-ds/uevr-scores.json`

You can safely ignore these.