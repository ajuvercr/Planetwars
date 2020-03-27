import { set_game_name, set_instance } from './index.ts'
export { handle }
from './games.ts' // IMPORT GAMES PLEASE, thank you webpack <3

const URL = window.location.origin + window.location.pathname;
const LOCATION = URL.substring(0, URL.lastIndexOf("/") + 1);

const game_location = LOCATION + "static/games/Chandra Garrett.json";

fetch(game_location)
    .then((r) => r.text())
    .then((response) => {
        set_instance(response);
        set_game_name("Chandra Garrett");
    }).catch(console.error);