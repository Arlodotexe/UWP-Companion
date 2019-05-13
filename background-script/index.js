import { getProtocolUri } from '../core/libs.js';
import { setSettings, getSettings } from '../core/helpers/settings.js';
import { debounce } from '../core/helpers/misc.js';
import { YouTube } from '../core/lib/youtube/master.js';

if (!(chrome && chrome.tabs) && (browser && browser.tabs)) {
    // Replacing chrome.tabs with browser.tabs for Firefox / other browsers that may need it
    chrome.tabs = browser.tabs;
}

let currentTabId;
getSettings();

chrome.webRequest.onBeforeRequest.addListener(
    requestCatcher,
    {
        urls: ["<all_urls>"],
        tabId: currentTabId
    }
);

function requestCatcher(requestDetails) {
    let protocolUrl = getProtocolUri(requestDetails.url, requestDetails.tabId, false);

    if (protocolUrl != undefined) {
        document.getElementsByTagName("iframe")[0].src = protocolUrl;
    }
}

chrome.tabs.onActivated.addListener((activeInfo) => {
    currentTabId = activeInfo.tabId;
});

chrome.runtime.onMessage.addListener(function(request) {
    console.log("message received: ", request);
    if (request.updateSettings != undefined) {
        setSettings(request.updateSettings);
    }

    if (request.pauseVideo != undefined) {
        YouTube.pauseVideo(request.tabId);
    }
});

