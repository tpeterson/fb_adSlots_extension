"use strict";!function(){var e={};chrome.runtime.onMessage.addListener(function(t,n,s){"content_script"===t.from&&"postLinks"===t.subject&&(e=t.ad_data,chrome.browserAction.setBadgeText({text:t.badge_num}))}),chrome.runtime.onMessage.addListener(function(t,n,s){"popup"===t.from&&"sendAds"===t.subject&&s(e)})}();
//# sourceMappingURL=background.js.map
