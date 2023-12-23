let isExtensionEnabled = false;
let rulesFromFile = [];

function onIconClicked() {
  isExtensionEnabled = !isExtensionEnabled;
  if (isExtensionEnabled) {
    chrome.action.setBadgeText({
      text: "ON",
    });
    console.log("Extension enabled");
    updateDNRRules(true); // Enable DNR
  } else {
    chrome.action.setBadgeText({
      text: "OFF",
    });
    console.log("Extension disabled");
    updateDNRRules(false); // Disable DNR
  }
}

chrome.action.onClicked.addListener(onIconClicked);

// Load the file containing the DNR rules from local storage, parse it, and set global variables accordingly
function updateDNRRules(isEnabled) {
  if (isEnabled) {
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rulesFromFile,
    });
  } else {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: rulesFromFile.map((rule) => rule.id),
    });
  }
}

// Load rules from rules.js
async function loadRulesFromFile() {
  try {
    const response = await fetch(chrome.runtime.getURL("rules.json"));
    const rulesText = await response.text();
    return JSON.parse(rulesText);
  } catch (error) {
    console.error("Error loading rules from rules.js:", error);
    throw error; // Rethrow the error to handle it further if needed
  }
}

loadRulesFromFile()
  .then((rules) => {
    rulesFromFile = rules;
    console.log("Rules loaded:", rules);
  })
  .catch((error) => {
    console.error("Error loading rules from rules.js:", error);
  });
