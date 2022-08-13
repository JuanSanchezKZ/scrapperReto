export async function inyect(path: string, tabId: any) {
  const options = {
    target: { tabId },
    files: [path],
  };
  return chrome.scripting.executeScript(options);
}

export async function inyectScrapCandidates(tabId) {
  return inyect("scripts/scrapCandidates.js", tabId);
}

export async function CreateTab(url: string) {
  try {
    // eslint-disable-next-line no-undef
    // chrome.tabs.remove(oldId);
    // eslint-disable-next-line no-undef
    const { id } = await chrome.tabs.create({ url });
    return id;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("🚀 ~ chrome.js ~ line 24 ~ deleteAndCreateTab ~ error", error);
    throw error;
  }
}

export async function deleteTab(oldId: number) {
  chrome.tabs.remove(oldId);
}
