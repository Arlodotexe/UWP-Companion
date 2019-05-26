import SpotifyParsers from './parsing.js';

import Spotimo from './spotimo.js';
import Xpotify from './xpotify.js';

export default {
    name: "Spotify",
    logo: "https://arlo.site/projects/UWPCompanion/logos/platforms/Spotify.png",
    icon: "https://arlo.site/projects/UWPCompanion/icons/platforms/Spotify.png",
    baseUrlMatch: SpotifyParsers.isSpotify,
    clients: {
        Spotimo, Xpotify
    }
};