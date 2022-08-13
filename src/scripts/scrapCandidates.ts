import { searchSelectors } from "../config/scrapper.config";
import { $$, $Anch } from "../utils/selectors";
import { waitForScroll, waitForSelector } from "../utils/waitFor";

// eslint-disable-next-line no-unused-vars
async function init() {
  await waitForSelector(searchSelectors.paginateResultsContainer);

  await waitForScroll(100, 100);

  const URLsCandidates = $$(searchSelectors.paginateResultsContainer).map(
    (element: HTMLElement) => $Anch(".app-aware-link", element).href
  );

  console.log(URLsCandidates);

  // eslint-disable-next-line no-undef
  const port = chrome.runtime.connect({ name: "secureChannelScrap" });

  port.postMessage(URLsCandidates);
}

init();
