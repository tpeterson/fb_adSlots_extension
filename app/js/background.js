"use strict";var ad_load={};chrome.runtime.onMessage.addListener(function(e,t,o){"content_script"===e.from&&"postLinks"===e.subject&&(ad_load=e.ad_data,chrome.browserAction.setBadgeText({text:e.badge_num}))}),chrome.runtime.onMessage.addListener(function(e,t,o){"popup"===e.from&&"sendAds"===e.subject&&o(ad_load)});
//# sourceMappingURL=background.js.map
