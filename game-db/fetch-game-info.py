import requests
import json
import os
import re

# If any backwards-incompatible changes are made to the database, increment this number.
# This will be used as the folder name where the database files are stored,
# which means the database URLs also change.
database_version = 0

# PCGamingWiki seems to allow for this many elements per page for now.
# If this limit goes down, we might have problems.
limit_per_page = 500

# Someone was nice enough to do all the work for mapping Epic Games Store item IDs to game titles.
epic_games_store_items = "https://raw.githubusercontent.com/nachoaldamav/items-tracker/main/database/titles.json"

# These are all the engines that exist in the universe.
engine_names = ["GameMaker", "Unity", "Godot", "Unreal"]


def normalize_title(title):
    return re.sub(r'\W+', '', title).lower()


def fetch_epic_games_store_items():
    # array where shape is { "id": "item_id", "title": "game_title" }
    response = requests.get(epic_games_store_items)

    # map where keys are normalized titles, and values are the ids
    return {normalize_title(item['title']): item['id'] for item in response.json()}

# Read Steam IDs from files in the steam-ids directory
# Each file should contain a list of Steam IDs, one per line
# The file name will be used as the engine name
# returns a map where the keys are steam ids and the values are the engine id


def read_steam_ids():
    steam_ids = {}

    steam_ids_path = "../steam-ids"
    for provider in engine_names:
        provider_path = os.path.join(steam_ids_path, provider)

        # now read each line, and make the appid be the key, and the file name (provider id) be the value
        with open(provider_path, "r") as file:
            for line in file:
                steam_id = line.strip()
                steam_ids[steam_id] = provider

    # save to json
    with open(f"{database_version}/steam_ids.json", "w") as json_file:
        json.dump(steam_ids, json_file, indent=4)

    return steam_ids


def fetch_games_by_engine(engine_name):
    url = "https://www.pcgamingwiki.com/w/api.php"
    all_games = []
    offset = 0

    while True:
        print(
            f"Fetching games for engine {engine_name} with offset {offset}...")

        params = {
            'action': 'cargoquery',
            'tables': 'Infobox_game_engine=Engine,Infobox_game=Game',
            'join_on': 'Game._pageName=Engine._pageName',
            'fields': 'Game._pageName=title,Engine.Engine=engineBrand,Game.Steam_AppID=steamIds,Game.GOGcom_ID=gogIds,Engine.Build=engineVersion',
            'where': f'Engine LIKE "Engine:{engine_name}%"',
            'format': 'json',
            'limit': limit_per_page,
            'offset': offset
        }

        response = requests.get(url, params=params)
        data = response.json()

        if 'cargoquery' in data:
            games = [item['title'] for item in data['cargoquery']]

            all_games.extend(games)
            if len(games) < limit_per_page:
                break
            offset += limit_per_page
        else:
            break

    return all_games


# array where shape is { "id": "item_id", "title": "game_title" }
epic_games_store_items = fetch_epic_games_store_items()

engines_per_steam_appid = read_steam_ids()


def get_epic_game_id_from_title(title):
    return epic_games_store_items.get(normalize_title(title), None)


def comma_separated_to_array(comma_separated):
    return [id.strip() for id in comma_separated.split(',')]


def clean_up_properties(game):
    cleaned_game = {k: v for k, v in game.items() if v is not None}

    if 'engineBrand' in cleaned_game:
        cleaned_game['engineBrand'] = cleaned_game['engineBrand'].replace(
            'Engine:', '')

    if 'steamIds' in cleaned_game:
        cleaned_game['steamIds'] = comma_separated_to_array(
            cleaned_game['steamIds'])
        # remove steam ids from engines_per_steam_appid
        for steam_id in cleaned_game['steamIds']:
            if steam_id in engines_per_steam_appid:
                del engines_per_steam_appid[steam_id]

    if 'gogIds' in cleaned_game:
        cleaned_game['gogIds'] = comma_separated_to_array(
            cleaned_game['gogIds'])

    epic_id = get_epic_game_id_from_title(cleaned_game['title'])
    if epic_id:
        cleaned_game['epicIds'] = [epic_id]

    return cleaned_game


output_path = f"{database_version}/games.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)

all_games = []
for engine_name in engine_names:
    games_with_same_title = fetch_games_by_engine(engine_name)
    all_games.extend(clean_up_properties(game)
                     for game in games_with_same_title)

# create map where keys are game titles and values are a list of games with the same title
games_by_title = {}
for game in all_games:
    title = game['title']
    if title not in games_by_title:
        games_by_title[title] = []
    games_by_title[title].append(game)

unique_games = []

for title, games_with_same_title in games_by_title.items():
    unique_game = None
    for game in games_with_same_title:
        if unique_game is None:
            unique_game = game

        if 'engineBrand' not in game:
            continue

        engine = {'brand': game['engineBrand']}
        del game['engineBrand']

        if 'engineVersion' in game:
            engine['version'] = game['engineVersion']
            del game['engineVersion']

        unique_game['engines'] = unique_game.get(
            'engines', []) + [engine]

    unique_games.append(unique_game)

for steam_appid, engine_brand in engines_per_steam_appid.items():
    unique_games.append({
        'steamIds': [steam_appid],
        'engines': [{'brand': engine_brand}]
    })

with open(output_path, "w") as json_file:
    json.dump(unique_games, json_file, indent=4)
