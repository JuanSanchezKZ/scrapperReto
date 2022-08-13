import { $, $form } from "../utils/selectors";
import { urls as configUrls } from "../config/scrapper.config";

$("#search-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const { baseUrl } = configUrls;
  const keyword = $form("#search").value;
  const url = baseUrl + "search/results/people/?keywords=" + keyword;

  const { id } = await chrome.tabs.create({ url });

  const options = {
    target: { tabId: id },
    files: ["scripts/scrapCandidates.js"],
  };

  // eslint-disable-next-line no-undef
  await chrome.scripting.executeScript(options);
});
