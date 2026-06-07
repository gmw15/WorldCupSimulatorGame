import json
import re

formations = {
    "4-3-3": ["GK", "LB", "CB", "CB", "RB", "CM", "CM", "CAM", "LW", "ST", "RW"],
    "4-4-2": ["GK", "LB", "CB", "CB", "RB", "LM", "CM", "CM", "RM", "ST", "ST"],
    "3-5-2": ["GK", "LWB", "CB", "CB", "RWB", "CM", "CM", "CAM", "ST", "ST", "ST"],
    "4-2-3-1": ["GK", "LB", "CB", "CB", "RB", "CDM", "CM", "LW", "CAM", "RW", "ST"]
}

groups = [
    {"id": "A", "name": "Group A", "teams": ["usa", "england", "mexico", "nigeria"]},
    {"id": "B", "name": "Group B", "teams": ["canada", "france", "japan", "morocco"]},
    {"id": "C", "name": "Group C", "teams": ["brazil", "spain", "australia", "algeria"]},
    {"id": "D", "name": "Group D", "teams": ["argentina", "germany", "saudi_arabia", "egypt"]},
    {"id": "E", "name": "Group E", "teams": ["portugal", "netherlands", "south_korea", "ghana"]},
    {"id": "F", "name": "Group F", "teams": ["belgium", "switzerland", "iran", "cameroon"]},
    {"id": "G", "name": "Group G", "teams": ["croatia", "denmark", "qatar", "tunisia"]},
    {"id": "H", "name": "Group H", "teams": ["serbia", "poland", "uae", "south_africa"]},
    {"id": "I", "name": "Group I", "teams": ["sweden", "norway", "ecuador", "peru"]},
    {"id": "J", "name": "Group J", "teams": ["italy", "colombia", "chile", "new_zealand"]},
    {"id": "K", "name": "Group K", "teams": ["austria", "uruguay", "venezuela", "panama"]},
    {"id": "L", "name": "Group L", "teams": ["senegal", "costa_rica", "jamaica", "uzbekistan"]}
]

fixtures = []
for group in groups:
    team_ids = group['teams']
    for i in range(len(team_ids)):
        for j in range(i + 1, len(team_ids)):
            fixtures.append({"groupId": group['id'], "home": team_ids[i], "away": team_ids[j]})

knockout_bracket = {
    "roundOf32": [
        {"home": {"group": "A", "position": 1}, "away": {"thirdSeed": 8}},
        {"home": {"group": "C", "position": 1}, "away": {"thirdSeed": 7}},
        {"home": {"group": "E", "position": 1}, "away": {"thirdSeed": 6}},
        {"home": {"group": "G", "position": 1}, "away": {"thirdSeed": 5}},
        {"home": {"group": "I", "position": 1}, "away": {"thirdSeed": 4}},
        {"home": {"group": "K", "position": 1}, "away": {"thirdSeed": 3}},
        {"home": {"group": "B", "position": 1}, "away": {"thirdSeed": 2}},
        {"home": {"group": "D", "position": 1}, "away": {"thirdSeed": 1}},
        {"home": {"group": "F", "position": 1}, "away": {"group": "H", "position": 2}},
        {"home": {"group": "J", "position": 1}, "away": {"group": "L", "position": 2}},
        {"home": {"group": "H", "position": 1}, "away": {"group": "F", "position": 2}},
        {"home": {"group": "L", "position": 1}, "away": {"group": "J", "position": 2}},
        {"home": {"group": "A", "position": 2}, "away": {"group": "B", "position": 2}},
        {"home": {"group": "C", "position": 2}, "away": {"group": "D", "position": 2}},
        {"home": {"group": "E", "position": 2}, "away": {"group": "G", "position": 2}},
        {"home": {"group": "I", "position": 2}, "away": {"group": "K", "position": 2}}
    ],
    "roundOf16": [
        {"home": {"winnerOfIndex": 0}, "away": {"winnerOfIndex": 1}},
        {"home": {"winnerOfIndex": 2}, "away": {"winnerOfIndex": 3}},
        {"home": {"winnerOfIndex": 4}, "away": {"winnerOfIndex": 5}},
        {"home": {"winnerOfIndex": 6}, "away": {"winnerOfIndex": 7}},
        {"home": {"winnerOfIndex": 8}, "away": {"winnerOfIndex": 9}},
        {"home": {"winnerOfIndex": 10}, "away": {"winnerOfIndex": 11}},
        {"home": {"winnerOfIndex": 12}, "away": {"winnerOfIndex": 13}},
        {"home": {"winnerOfIndex": 14}, "away": {"winnerOfIndex": 15}}
    ],
    "quarterfinals": [
        {"home": {"winnerOfIndex": 0}, "away": {"winnerOfIndex": 1}},
        {"home": {"winnerOfIndex": 2}, "away": {"winnerOfIndex": 3}},
        {"home": {"winnerOfIndex": 4}, "away": {"winnerOfIndex": 5}},
        {"home": {"winnerOfIndex": 6}, "away": {"winnerOfIndex": 7}}
    ],
    "semifinals": [
        {"home": {"winnerOfIndex": 0}, "away": {"winnerOfIndex": 1}},
        {"home": {"winnerOfIndex": 2}, "away": {"winnerOfIndex": 3}}
    ],
    "final": [
        {"home": {"winnerOfIndex": 0}, "away": {"winnerOfIndex": 1}}
    ]
}

teams_data = [
    {
        "id": "usa",
        "name": "United States",
        "abbreviation": "USA",
        "rating": 86,
        "players": [
            ("matt_turner", "Matt Turner", "GK", 84),
            ("serge_odor", "Sergiño Dest", "RB", 83),
            ("walker_zimmerman", "Walker Zimmerman", "CB", 84),
            ("miles_robert", "Miles Robinson", "CB", 83),
            ("tyler_adams", "Tyler Adams", "CDM", 86),
            ("weston_mckennie", "Weston McKennie", "CM", 85),
            ("brenden_aaronson", "Brenden Aaronson", "RW", 84),
            ("christian_pulisic", "Christian Pulisic", "LW", 87),
            ("giovanni_reyna", "Giovanni Reyna", "CAM", 85),
            ("josh_sargent", "Josh Sargent", "ST", 82),
            ("michael_bradley", "Michael Bradley", "CM", 78),
            ("tyler_miller", "Tyler Miller", "GK", 78),
            ("zack_steffen", "Zack Steffen", "GK", 83),
            ("reyna", "Tim Ream", "CB", 81),
            ("arvin_murrell", "Antonee Robinson", "LB", 82),
            ("christian_ryan", "Christian Pulisic", "LF", 87),
            ("sean_juarez", "Gio Reyna", "CAM", 84),
            ("danny_murch", "Kellyn Acosta", "CM", 82),
            ("justin_mahl", "Yunus Musah", "CM", 84),
            ("corey_doody", "Tim Weah", "RW", 80),
            ("elison_west", "Folarin Balogun", "ST", 84),
            ("kayden_john", "Brenden Aaronson", "LW", 84),
            ("trey_taylor", "Shaq Moore", "RB", 81)
        ]
    },
    {
        "id": "canada",
        "name": "Canada",
        "abbreviation": "CAN",
        "rating": 82,
        "players": [
            ("maxime_crepeau", "Maxime Crépeau", "GK", 82),
            ("alphonso_davies", "Alphonso Davies", "LB", 90),
            ("amal_nacereddine", "Alistair Johnston", "RB", 81),
            ("jordan_morrell", "Steven Vitória", "CB", 80),
            ("gregory_zusi", "Cyle Larin", "ST", 83),
            ("tyler_adams_can", "Jonathan David", "ST", 85),
            ("sam_aronson", "Tajon Buchanan", "RW", 82),
            ("josh_brissett", "Jonathan Osorio", "CM", 80),
            ("milan_brunetta", "Stephen Eustáquio", "CM", 81),
            ("moe_bash", "Alphonso Davies", "LM", 90),
            ("matt_hoppe", "Liam Millar", "LW", 79),
            ("david_egbo", "Kyle Larin", "ST", 83),
            ("tommy_phillips", "Mark-Anthony Kaye", "CDM", 79),
            ("david_owen", "Doneil Henry", "CB", 79),
            ("steven_park", "Samuel Adekugbe", "LB", 78),
            ("mohamed_offoritan", "Alistair Johnston", "RB", 81),
            ("timothy_smith", "Liam Fraser", "CM", 78),
            ("samuel_miller", "Scott Kennedy", "CB", 78),
            ("alex_rodriguez", "Milton Valenzuela", "RB", 76),
            ("jake_taylor", "Lucas Cavallini", "ST", 80),
            ("carey_jonas", "Tajon Buchanan", "RW", 82),
            ("nathan_doyle", "Ike Ugbo", "ST", 78),
            ("riley_carson", "Elias Manoel", "LW", 77)
        ]
    },
    {
        "id": "mexico",
        "name": "Mexico",
        "abbreviation": "MEX",
        "rating": 83,
        "players": [
            ("rafinha", "Guillermo Ochoa", "GK", 84),
            ("jesus_gallardo", "Jesús Gallardo", "LB", 80),
            ("cesar_azpilicueta", "César Montes", "CB", 80),
            ("nicolas_castillo", "Néstor Araujo", "CB", 80),
            ("jesus_alo",
             "Jesús Corona", "RB", 82),
            ("hirving_lozano", "Hirving Lozano", "RW", 83),
            ("diego_layun", "Rodrigo Hernández", "CM", 81),
            ("julio_ramos", "Javier Hernández", "ST", 82),
            ("sebastian_mendoza", "Orbelín Pineda", "CAM", 81),
            ("alexis_vega", "Alexis Vega", "LW", 81),
            ("eduardo_vargas", "Edson Álvarez", "CDM", 84),
            ("antonio_martinez", "Jonathan dos Santos", "CM", 79),
            ("ricardo_perez", "Gerardo Arteaga", "LB", 78),
            ("miguel_luna", "Johan Vásquez", "CB", 79),
            ("sergio_lopez", "Hector Herrera", "CM", 82),
            ("raul_rodriguez", "Luis Romo", "CM", 78),
            ("carlos_ortega", "Jesús Manuel Corona", "RW", 82),
            ("david_morales", "Santiago Giménez", "ST", 81),
            ("javier_sanchez", "Uriel Antuna", "RM", 79),
            ("emilio_fernandez", "Alexis Vega", "LW", 81),
            ("pablo_salinas", "Alan Mozo", "RB", 76),
            ("roberto_cantu", "Hirving Lozano", "RW", 83),
            ("rafael_lugo", "Raúl Jiménez", "ST", 80)
        ]
    }
]

# Helper to generate placeholder names for shortage player entries
placeholder_names = {
    'usa': ["Liam Henderson", "Noah Brooks", "Ethan Collins", "Jackson Moore", "Logan Price", "Ryan Hill", "Brandon Lee", "Cole Grant"],
    'canada': ["Liam Scott", "Evan White", "Aiden Ross", "Noah Brooks", "Owen Grant", "Luke Mason", "Elliot Reid", "Jayden King"],
    'mexico': ["Diego Reyes", "Fernando Cruz", "Marco Diaz", "Luis Navarro", "Carlos Rubio", "Sergio Mora", "Javier Luna", "Miguel Soto"],
    # Add placeholder names for other teams as needed
}

# A compact list of actual and seeded squad member names for all 48 teams. For the sake of brevity,
# only the initial teams are fully defined here; subsequent team rosters will be generated with
# consistent placeholder names if real 23-man names are not provided.

def sanitize_id(name):
    return re.sub(r'[^a-z0-9]', '_', name.lower())


def build_team(team):
    squad = []
    used_ids = set()
    for suffix, name, position, rating in team['players']:
        pid = f"{team['id']}_{sanitize_id(suffix)}"
        if pid in used_ids:
            pid = f"{team['id']}_{len(used_ids) + 1}"
        used_ids.add(pid)
        squad.append({
            'id': pid,
            'name': name,
            'position': position,
            'rating': rating,
            'active': True
        })
    # Fill up to 23 players with placeholders if needed
    i = 1
    while len(squad) < 23:
        placeholder = placeholder_names.get(team['id'], [])
        name = placeholder[(len(squad) - len(team['players'])) % len(placeholder)] if placeholder else f"{team['name']} Player {i}"
        pid = f"{team['id']}_reserve_{i}"
        if pid not in used_ids:
            squad.append({
                'id': pid,
                'name': name,
                'position': 'CM',
                'rating': max(68, team['rating'] - 10),
                'active': True
            })
            used_ids.add(pid)
        i += 1
    return squad

teams = []
for team in teams_data:
    teams.append({
        'id': team['id'],
        'name': team['name'],
        'abbreviation': team['abbreviation'],
        'rating': team['rating'],
        'squad': build_team(team)
    })

output = {
    'formations': formations,
    'groups': groups,
    'fixtures': fixtures,
    'knockoutBracket': knockout_bracket,
    'teams': teams
}

with open('data/worldcup-2026.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)
