console.log("Starting Receipt Printer v1.0");

// const test = document.getElementsByClassName("shopee-button");
// console.log("test", test);
// console.log("url: ", window.location.href);
// const imageLink = document.getElementsByClassName(
//   "gallery-preview-panel__image"
// );

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("msg: ", message, " sender: ", sender);
  if (message.action === "PING") {
    console.log("ping");
    sendResponse({ test: "abc" });
  }
});
