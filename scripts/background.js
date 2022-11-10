chrome.runtime.onInstalled.addListener(async () => {
    await chrome.scripting.unregisterContentScripts();
    await chrome.scripting.registerContentScripts([
        {
            id: "a-script",
            js: ["content.js"],
            matches: ["https://twitter.com/*"],
            runAt: "document_start", // fixme: too aggressive?
            world: 'MAIN'
        }
    ]);
});
