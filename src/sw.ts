import { SecureChannelsEnum as secureChannels } from "./constants";
import {
  deleteAndCreateTab,
  deleteTab,
  inyect,
  inyectScrapCandidates,
} from "./utils/chrome";

// import { addUrlParams, getUrlParams } from "./utils/urls";

chrome.action.onClicked.addListener(async (tab) => {
  console.log("click");
  await inyectScrapCandidates(tab.id);
});
// eslint-disable-next-line no-undef
chrome.runtime.onConnect.addListener((port) => {
  if (!Object.values(secureChannels).includes(port.name))
    throw new Error("Not secure Channel");

  port.onMessage.addListener(_portOnmessageHandler);
});

/* chrome.webNavigation.onCompleted.addListener((a)=>{
  console.log(a.tabId)
}, {hostPrefix: 'https://www.linkedin.com/in/'}) */

// function setNextPageParam(tabUrl) {
//   const urlParams = getUrlParams(tabUrl);

//   const actualPage = Number(urlParams.get("page") ?? 1);
//   const nextPage = actualPage + 1;

//   urlParams.set("page", nextPage);

//   return [nextPage, actualPage, addUrlParams(tabUrl, urlParams)];
// }

async function scrapProfiles(tabUrl, tabId, urlsCandidates, index = 0) {
  // const [nextPage, actualPage, nextUrl] = setNextPageParam(tabUrl);

  // if (nextPage <= 3) {
  //   const newTabId = await deleteAndCreateTab(tabId, nextUrl);
  //
  // } else {

  const newTabId = await deleteAndCreateTab(tabId, urlsCandidates[index]);

  await inyect("scripts/scrapper.js", newTabId);

  // const newTabId2 = await deleteAndCreateTab(tabId, nextUrl);
  // inyectScrapCandidates(newTabId2);

  //
}

const _portOnmessageHandler = async (msg, port) => {
  const {
    name,
    sender: {
      tab: { id: tabId, url: tabUrl },
    },
  } = port;

  const candidates = msg;

  switch (name) {
    case secureChannels.scrapProfiles:
      let i = 0;
      const intervalIndex = setInterval(() => {
        i++;
        console.log(tabId);
        scrapProfiles(tabUrl, tabId, candidates, i);
        if (i === 9) {
          clearInterval(intervalIndex);
        }
      }, 7000);

      // const newTabId = await deleteAndCreateTab(tabId, candidates[3]);
      // inyect("scripts/scrapper.js", newTabId);

      break;
    case secureChannels.scrapv1: {
      break;
    }
  }
};
