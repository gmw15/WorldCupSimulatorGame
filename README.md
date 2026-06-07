# World Cup Squad Simulator

This is a static World Cup squad simulator built with HTML, CSS, and JavaScript. It uses a JSON file to store teams, player squads, formations, and group stage assignments, so there is no database required.

## Features

- Draw a random team from the remaining pool or choose a team manually
- Each drawn team is removed from the pool and cannot be drawn again
- Pick a formation and assign active players to each position (players cannot be selected twice)
- Auto-fill the best available XI for the formation
- Simulate a group stage using real fixture pairings and a knockout path to see how far your team can progress
- All tournament data is loaded from `data/worldcup.json`

## Files

- `index.html` — the game UI
- `styles.css` — styling and layout
- `script.js` — simulator logic and tournament rules
- `data/worldcup.json` — teams, player squads, formations, and tournament groups

## How to run

Open `index.html` in a browser. No server is required, but if the browser prevents JSON loading due to file permissions, use a simple local server such as:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Extending the game

To add full World Cup squads or more teams, edit `data/worldcup.json`:
- Add new `teams` entries with `id`, `name`, `abbreviation`, `rating`, `formationOptions`, and `squad`
- Add new player objects with `id`, `name`, `position`, `rating`, and `active`
- Update `groups` and `knockoutOpponents` to include the new teams

Enjoy building your own World Cup challenge!
