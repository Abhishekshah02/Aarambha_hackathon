'use strict';

/**
 * navbar toggle
 */

const overlay = document.querySelector("[data-overlay]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbar = document.querySelector("[data-navbar]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");
const navLinks = document.querySelectorAll("[data-nav-link]");

const navElemArr = [navOpenBtn, navCloseBtn, overlay];

const navToggleEvent = function (elem) {
  for (let i = 0; i < elem.length; i++) {
    elem[i].addEventListener("click", function () {
      navbar.classList.toggle("active");
      overlay.classList.toggle("active");
    });
  }
}

navToggleEvent(navElemArr);
navToggleEvent(navLinks);

/**
 * Real-time date and time update
 */

function updateDateTime() {
  const now = new Date();
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,  // This ensures 24-hour format
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  const dateTimeString = now.toLocaleString('en-US', options).replace(',', '').replace('at', '');
  document.getElementById('currentDateTime').textContent = dateTimeString;
}

// Update immediately and then every second
updateDateTime();
setInterval(updateDateTime, 1000);


/**
 * header sticky & go to top
 */

const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {

  if (window.scrollY >= 200) {
    header.classList.add("active");
    goTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    goTopBtn.classList.remove("active");
  }

});

document.addEventListener("DOMContentLoaded", () => {
  const chatbotIcon = document.getElementById("chatbot-icon");
  const chatbotContainer = document.getElementById("chatbot-container");
  const closeChat = document.getElementById("close-chat");
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const chatMessages = document.getElementById("chat-messages");

  chatbotIcon.addEventListener("click", () => {
    chatbotContainer.style.display =
      chatbotContainer.style.display === "none" ||
      chatbotContainer.style.display === ""
        ? "flex"
        : "none";
  });

  closeChat.addEventListener("click", () => {
    chatbotContainer.style.display = "none";
  });

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (message) {
      addMessage("You", message);
      userInput.value = "";

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        addMessage("Bot", data.response);
      } catch (error) {
        console.error("Error:", error);
        addMessage(
          "Bot",
          "I'm sorry, I encountered an error. Please try again."
        );
      }
    }
  });

  function addMessage(sender, text) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", `${sender.toLowerCase()}-message`);
    messageElement.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  addMessage(
    "Bot",
    "Hello! How can I assist you with your travel plans in Nepal today?"
  );
});
