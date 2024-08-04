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


def normalize_title(title):
    return re.sub(r'\W+', '', title).lower()


def fetch_epic_games_store_items():
    # array where shape is { "id": "item_id", "title": "game_title" }
    response = requests.get(epic_games_store_items)

    # map where keys are normalized titles, and values are the ids
    return {normalize_title(item['title']): item['id'] for item in response.json()}


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
            'fields': 'Game._pageName=title,Engine.Engine=engine,Game.Steam_AppID=steamIds,Game.GOGcom_ID=gogIds,Engine.Build=engineVersions',
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


def get_epic_game_id_from_title(title):
    return epic_games_store_items.get(normalize_title(title), None)


def comma_separated_to_array(comma_separated):
    return [id.strip() for id in comma_separated.split(',')]


def clean_up_properties(game):
    cleaned_game = {k: v for k, v in game.items() if v is not None}

    if 'engine' in cleaned_game:
        cleaned_game['engine'] = cleaned_game['engine'].replace('Engine:', '')

    if 'steamIds' in cleaned_game:
        cleaned_game['steamIds'] = comma_separated_to_array(
            cleaned_game['steamIds'])

    if 'gogIds' in cleaned_game:
        cleaned_game['gogIds'] = comma_separated_to_array(
            cleaned_game['gogIds'])

    epic_id = get_epic_game_id_from_title(cleaned_game['title'])
    if epic_id:
        cleaned_game['epicIds'] = [epic_id]

    return cleaned_game


output_path = f"{database_version}/games.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)

engine_names = ["GameMaker", "Unity", "Godot", "Unreal"]

all_games = []
for engine_name in engine_names:
    games = fetch_games_by_engine(engine_name)
    all_games.extend(clean_up_properties(game) for game in games)

# create map where keys are game titles and values are a list of games with the same title
games_by_title = {}
for game in all_games:
    title = game['title']
    if title not in games_by_title:
        games_by_title[title] = []
    games_by_title[title].append(game)

# now flatten it back down into a list, where engineVersions is now a list of versions
# TODO: actually the engine itself can be different,
# so we should group it into a single "engines" property that includes engine id and version
unique_games = []

for title, games in games_by_title.items():
    unique_game = None
    for game in games:
        if unique_game is None:
            unique_game = game
            if 'engineVersions' in game:
                unique_game['engineVersions'] = [game['engineVersions']]
            continue

        if 'engineVersions' in game:
            unique_game['engineVersions'] = unique_game.get(
                'engineVersions', []) + [game['engineVersions']]

    unique_games.append(unique_game)

with open(output_path, "w") as json_file:
    json.dump(unique_games, json_file, indent=4)
