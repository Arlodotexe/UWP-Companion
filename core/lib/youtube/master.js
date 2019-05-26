import myTube from './mytube.js';
import YTParser from './parsing.js';

export default {
    name: "YouTube",
    logo: "https://arlo.site/projects/UWPCompanion/logos/platforms/YouTube.png",
    icon: "https://arlo.site/projects/UWPCompanion/icons/platforms/YouTube.png",
    baseUrlMatch: YTParser.isYoutube,
    clients: {
        myTube
    }
};

export function pauseVideo(tabId) {
    if (tabId == undefined || tabId < 1) return;
    let pauseRepeater = setInterval(() => {
        chrome.tabs.executeScript(tabId, {
            code: `
            var vids = document.querySelectorAll('video');

            for(let vid of vids) {
                    vid.pause();
                    if(vid.paused) {
                        "success";
                        continue;
                    }
                    "failed";
                }
            `
        }, results => {
            if (results) {
                for (let result of results) {
                    // If anything failed, return. It will be tried again
                    if (result == "failed" || result == null) {
                        return;
                    }
                }
                // If this point is reached without failures, stop trying to pause the videos
                clearInterval(pauseRepeater);
            }
        });
    }, 200);

    // If a user has _really_ slow internet, it could take this long. Any longer is probably an indication of a glitch and the repeating code needs to be stopped
    setTimeout(() => {
        clearInterval(pauseRepeater);
    }, 15000);
}