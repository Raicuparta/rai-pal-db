import requests
import json
import os

# If any backwards-incompatible changes are made to the database, increment this number.
# This will be used as the folder name where the database files are stored,
# which means the database URLs also change.
database_version = 0

# PCGamingWiki seems to allow for this many elements per page for now.
# If this limit goes down, we might have problems.
limit_per_page = 500


def fetch_games_by_engine(engine_name):
    url = "https://www.pcgamingwiki.com/w/api.php"
    all_games = []
    offset = 0

    # TODO: There can be multiple Steam/GOG ids per game, need to be careful with that.

    while True:
        params = {
            'action': 'cargoquery',
            'tables': 'Infobox_game_engine,Infobox_game',
            'join_on': 'Infobox_game._pageName=Infobox_game_engine._pageName',
            'fields': 'Infobox_game._pageName=Title,Infobox_game_engine.Engine,Infobox_game.Steam_AppID,Infobox_game.GOGcom_ID,Infobox_game_engine.Build',
            'where': f'Engine LIKE "Engine:{engine_name}%"',
            'format': 'json',
            'limit': limit_per_page,
            'offset': offset
        }

        response = requests.get(url, params=params)
        print(response.url)
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


engine_names = ["Unity", "Godot", "Unreal", "GameMaker"]

all_games = []
for engine_name in engine_names:
    games = fetch_games_by_engine(engine_name)
    all_games.extend(games)

output_path = f"{database_version}/games.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, "w") as json_file:
    json.dump(all_games, json_file, indent=4)
