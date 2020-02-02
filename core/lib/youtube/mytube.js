import { settings } from '../../helpers/settings.js';
import YTParser from './parsing.js';
import { pauseVideo } from './helpers.js';

function urlToProtocolRaw(url) {
    if (YTParser.hasPlaylist(url) !== null) { // Is a playlist
        if (YTParser.hasVideo(url) !== null) { // Is a playlist with a video
            if (YTParser.hasTimestamp(url) !== null) { // Is a playlist with a video and a timestamp
                console.info('Playlist, video and timestamp detected.');
                return `rykentube:PlayVideo?ID=${YTParser.hasVideo(url)}&PlaylistID=${YTParser.hasPlaylist(url)}&Position=${YTParser.hasTimestamp(url)}`;
            } else {
                console.info('Playlist and video detected.');
                return `rykentube:PlayVideo?ID=${YTParser.hasVideo(url)}&PlaylistID=${YTParser.hasPlaylist(url)}`;
            }
        } else { // Is just a playlist with no video
            console.info('Playlist detected.');
            return `rykentube:Playlist?ID=${YTParser.hasPlaylist(url)}`;
        }
    } else if (YTParser.hasVideo(url) !== null) { // Is a video
        if (YTParser.hasTimestamp(url) !== null) { // Is a video with a timestamp
            console.info('Video and timestamp detected.');
            return `rykentube:PlayVideo?ID=${YTParser.hasVideo(url)}&Position=${YTParser.hasTimestamp(url)}`;
        } else {
            console.info('Video detected.');
            return `rykentube:PlayVideo?ID=${YTParser.hasVideo(url)}`;
        }
    } else if (YTParser.hasChannel(url) !== null) { // Is a channel
        console.info('Channel detected.');
        return `rykentube:Channel?ID=${YTParser.hasChannel(url)}`;
    }

    if (YTParser.isHomepage(url)) {
        return "rykentube:"
    }
}

function getProtocolFromUrl(url, tabId) {
    let protocol = urlToProtocolRaw(url);
    return protocol;
}

function postLaunch(tabId) {
    if (settings.platforms.YouTube.closeOnSwitch == false && tabId != undefined) {
        pauseVideo(tabId);
    }
}

export default {
    name: "myTube",
    parseUrl: getProtocolFromUrl,
    postLaunch: postLaunch,
    config: {
        color: "#303030",
        appProtocol: "rykentube"
    }
};