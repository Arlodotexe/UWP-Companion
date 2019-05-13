import myTube from './mytube.js';
import YTParser from './parsing.js';

let clients = {
    myTube: myTube
};

function shouldCloseOnSwitch(url) {
    // If the url isn't a youtube url, don't close the tab
    return (YTParser.isYoutube(url) ? true : false);
}

function pauseVideo(tabId) {
    if (tabId == undefined || tabId < 1) return;
    chrome.tabs.executeScript(tabId, {
        // Confirm that the videos are playing and loaded before trying to pause it
        code: `
                function recursiveVideoCheck() {
                    document.querySelectorAll('video').forEach(vid => {
                        if(vid.currentTime > 0 && !vid.paused) {
                           vid.pause();
                        } else {
                            setTimeout(()=>{
                                recursiveVideoCheck();
                            }, 200);
                        }
                    });
                }
                window.addEventListener("load", function(event) { 
                    recursiveVideoCheck(); // For when it fires before the page is loaded
                });
                recursiveVideoCheck(); // For when it fires after the page is loaded
                `
    });
}

export const YouTube = {
    name: "YouTube",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_(2017).svg/1280px-YouTube_full-color_icon_(2017).svg.png",
    baseUrlMatch: YTParser.isYoutube,
    shouldCloseOnSwitch: shouldCloseOnSwitch,
    pauseVideo: pauseVideo,
    clients: clients
};