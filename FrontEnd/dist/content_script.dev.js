"use strict";

var aTag = document.createElement("a");
aTag.target = "_blank"; // Open in new tab

aTag.textContent = "Click";
aTag.position = "absolute"; // Hide the link

aTag.style.top = "0";
aTag.style.zIndex = "9999";
aTag.style.left = "0";
aTag.style.padding = "6px 12px";
aTag.style.textAlign = "center";
aTag.style.fontSize = "24px";
aTag.style.display = "inline";
aTag.style.color = "white";
aTag.style.backgroundColor = "rgb(0, 89, 255)";
aTag.style.borderRadius = "25%";
aTag.style.textDecoration = "none";
aTag.cursor = "pointer";
var senderEmail = ""; // Use MutationObserver to monitor the DOM for the Send button

var observeSendButton = function observeSendButton() {
  var observer = new MutationObserver(function () {
    var sendButtons = document.querySelectorAll('div[aria-label*="Send"][role="button"]');
    sendButtons.forEach(function (button) {
      if (!button.dataset.listenerAttached) {
        button.addEventListener("mousedown", function () {
          injectTrackingLink();
        });
      }
    });
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

var observeMailSeen = function observeMailSeen() {
  var lastEmailId = "";
  var observer = new MutationObserver(function () {
    var aTag = document.querySelector("a[href*='blank?email_id=']");

    if (aTag && aTag.href.includes("blank?email_id=")) {
      var emailId = aTag.href.split("email_id=")[1];
      if (emailId === lastEmailId) return; // skip duplicate checks

      lastEmailId = emailId;
      var toFetchURL = 'https://cce8-2409-40d2-305e-bfb5-8cee-44db-b555-51b0.ngrok-free.app';
      fetch("".concat(toFetchURL, "/mail/isvisited/").concat(emailId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function (res) {
        return res.json();
      }).then(function (data) {
        var elements = document.querySelectorAll("span[data-hovercard-id=\"".concat(senderEmail, "\"]"));
        elements.forEach(function (el) {
          if (el.className && el.className.trim() !== "") {
            el.style.backgroundColor = data ? "green" : "red";
            el.style.color = "white";
          }
        });
      })["catch"](function () {
        var elements = document.querySelectorAll("span[data-hovercard-id=\"".concat(senderEmail, "\"]"));
        elements.forEach(function (el) {
          if (el.className && el.className.trim() !== "") {
            el.style.backgroundColor = "black";
            el.style.color = "white";
          }
        });
      });
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}; // Inject tracking link into compose box


var injectTrackingLink = function injectTrackingLink() {
  var emailBody = document.querySelector("div[aria-label*='Message Body']");

  if (emailBody) {
    var id = senderEmail + Date.now();

    if (!emailBody.innerHTML.includes("blank?email_id=")) {
      var URL = "http://localhost:3000/blank?email_id=".concat(id);
      var URL1 = 'https://cce8-2409-40d2-305e-bfb5-8cee-44db-b555-51b0.ngrok-free.app';
      aTag.href = URL;
      emailBody.innerHTML += "<BR>";
      emailBody.appendChild(aTag);
      chrome.runtime.sendMessage({
        type: "PIXEL_INSERTED",
        id: id
      });
      fetch("".concat(URL1, "/mail/create/").concat(id), {
        method: 'POST'
      });
    }
  }
}; // Run observer once Gmail is ready


window.addEventListener("load", function () {
  setTimeout(function () {
    observeSendButton();
    observeMailSeen();
  }, 1000);

  if (localStorage.getItem("senderEmail")) {
    senderEmail = localStorage.getItem("senderEmail");
  } else {
    while (true) {
      var email = prompt("Please enter your email address to track opens:");

      if (email) {
        localStorage.setItem("senderEmail", email);
        senderEmail = email;
        break;
      }
    }
  }
});