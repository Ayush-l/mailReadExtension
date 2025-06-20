const aTag=document.createElement("a");
aTag.target="_blank"; // Open in new tab
aTag.textContent="Click";
aTag.position="absolute"; // Hide the link
aTag.style.top = "0";
aTag.style.zIndex = "9999";
aTag.style.left = "0";
aTag.style.padding="6px 12px"
aTag.style.textAlign = "center";
aTag.style.fontSize = "24px";
aTag.style.display="inline";
aTag.style.color="white"
aTag.style.backgroundColor="rgb(0, 89, 255)";
aTag.style.borderRadius = "25%";
aTag.style.textDecoration = "none";
aTag.cursor = "pointer";
let senderEmail="";

// Use MutationObserver to monitor the DOM for the Send button
const observeSendButton = () => {
    const observer = new MutationObserver(() => {
        const sendButtons = document.querySelectorAll('div[aria-label*="Send"][role="button"]');

        sendButtons.forEach(button => {
            if (!button.dataset.listenerAttached) {
                button.addEventListener("mousedown", () => {
                    injectTrackingLink();
                });
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

};


const observeMailSeen = () => {
    let lastEmailId = "";

    const observer = new MutationObserver(() => {
        const aTag = document.querySelector("a[href*='blank?email_id=']");
        if (aTag && aTag.href.includes("blank?email_id=")) {
            const emailId = aTag.href.split("email_id=")[1];
            if (emailId === lastEmailId) return; // skip duplicate checks
            lastEmailId = emailId;

            const toFetchURL = '<BackEnd_URL>'; // Replace with your backend URL
            fetch(`${toFetchURL}/mail/isvisited/${emailId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => res.json())
            .then(data => {
                const elements = document.querySelectorAll(`span[data-hovercard-id="${senderEmail}"]`);
                elements.forEach(el => {
                    if (el.className && el.className.trim() !== "") {
                        el.style.backgroundColor = data ? "green" : "red";
                        el.style.color = "white";
                    }
                });
            })
            .catch(() => {
                const elements = document.querySelectorAll(`span[data-hovercard-id="${senderEmail}"]`);
                elements.forEach(el => {
                    if (el.className && el.className.trim() !== "") {
                        el.style.backgroundColor = "black";
                        el.style.color = "white";
                    }
                });
            });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
};



// Inject tracking link into compose box
const injectTrackingLink = () => {
    const emailBody=document.querySelector("div[aria-label*='Message Body']");
    if (emailBody) {
        const id=senderEmail+Date.now();
        if (!emailBody.innerHTML.includes("blank?email_id=")) { 
            const URL = `<Replace with url provided by server.js>${id}`;
            const URL1='<BackEnd_URL>';
            aTag.href=URL
            emailBody.innerHTML+="<BR>"
            emailBody.appendChild(aTag); 
            chrome.runtime.sendMessage({ type: "PIXEL_INSERTED", id: id });
            fetch(`${URL1}/mail/create/${id}`,{method: 'POST'})
        }

    }
};

// Run observer once Gmail is ready
window.addEventListener("load", () => {
    setTimeout(() => {
        observeSendButton();
        observeMailSeen();
    },1000);
    if(localStorage.getItem("senderEmail")) {
        senderEmail = localStorage.getItem("senderEmail");
    }
    else{
        while(true){
            const email=prompt("Please enter your email address to track opens:");
            if(email) {
                localStorage.setItem("senderEmail", email);
                senderEmail = email;
                break;
            }
        }
    }
});
