const getEle = (eleName) => document.querySelector(`${eleName}`);
const errorContainer = getEle(".error-msg");
const root = document.documentElement.style;
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const modeText = getEle("#mode-text");
const modeIcon = getEle("#mode-icon");
let darkMode = false;

fetchAndRenderUserInfo("sunny8080");

getEle("#input").addEventListener("input", (e) => {
    errorContainer.classList.remove("active");
});

getEle(".search-container").addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = getEle("#input");
    const userName = input.value;
    input.value = "";
    input.blur();
    if (userName) {
        await fetchAndRenderUserInfo(userName);
    }
});

async function fetchAndRenderUserInfo(userName) {
    fetch(`https://api.github.com/users/${userName}`)
        .then((response) => response.json())
        .then((data) => renderUserInfo(data))
        .catch((err) => {
            errorContainer.classList.add("active");
        });
}

function renderUserInfo(data) {
    if (data.message === "Not Found") {
        errorContainer.classList.add("active");
        return;
    }

    errorContainer.classList.remove("active");

    function checkNull(value, ele) {
        if (value === "" || value === null) {
            ele.style.opacity = 0.5;
            ele.previousElementSibling.style.opacity = 0.5;
            return false;
        }
        return true;
    }

    getEle("#avatar").src = data.avatar_url;
    getEle("[data-userName]").innerText = data.name === null ? data.login : data.name;

    getEle("[data-userProfileLink]").innerText = `@${data.login}`;
    getEle("[data-userProfileLink]").href = data.html_url;

    const date = data.created_at.split("T").shift().split("-");
    getEle("#date").innerText = `Joined ${date[2]} ${months[date[1] - 1]} ${date[0]}`;

    // getEle("#bio").innerText = data.bio == null ? "This profile has no bio" : data.bio;
    getEle("#bio").innerText = data.bio == null ? "This profile has no bio" : data.bio;

    getEle("#repos").innerText = data.public_repos;
    getEle("#followers").innerText = data.followers;
    getEle("#following").innerText = data.following;

    const dataUserLocation = getEle("[data-userLocation]");
    dataUserLocation.innerText = checkNull(data.location, dataUserLocation) ? data.location : "Not Available";

    const dataUserWebsiteLink = getEle("[data-userWebsiteLink]");
    dataUserWebsiteLink.innerText = checkNull(data.blog, dataUserWebsiteLink) ? data.blog : "Not Available";
    dataUserWebsiteLink.href = checkNull(data.blog, dataUserWebsiteLink) ? data.blog : "#";

    const dataUserTwitterLink = getEle("[data-userTwitterLink]");
    dataUserTwitterLink.innerText = checkNull(data.twitter_username, dataUserTwitterLink) ? `@${data.twitter_username}` : "Not Available";
    dataUserTwitterLink.href = checkNull(data.twitter_username, dataUserTwitterLink) ? `https://twitter.com/${data.twitter_username}` : "#";

    const dataUserCompany = getEle("[data-userCompany]");
    dataUserCompany.innerText = checkNull(data.company, dataUserCompany) ? data.company : "Not Available";
}

// apply dark and light mode
getEle(".btn-mode").addEventListener("click", () => {
    if (darkMode == false) applyDarkMode();
    else applyLightMode();
});

// dark mode default
const prefersDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

if (localStorage.getItem("dark-mode")) {
    darkMode = localStorage.getItem("dark-mode");
    darkMode === "true" ? applyDarkMode() : applyLightMode();
} else {
    localStorage.setItem("dark-mode", prefersDarkMode);
    darkMode = prefersDarkMode;
    applyLightMode();
}

// apply dark mode
function applyDarkMode() {
    root.setProperty("--lm-bg", "#141D2F");
    root.setProperty("--lm-bg-content", "#1E2A47");
    root.setProperty("--lm-text", "white");
    root.setProperty("--lm-text-alt", "white");
    root.setProperty("--lm-shadow-xl", "rgba(70,88,109,0.15)");
    root.setProperty("--lm-icon-bg", "brightness(1000%)");
    modeText.innerText = "Light";
    modeIcon.src = "./assets/sun-icon.svg";
    darkMode = true;
    localStorage.setItem("dark-mode", true);
}

// apply light mode
function applyLightMode() {
    root.setProperty("--lm-bg", "#F6F8FF");
    root.setProperty("--lm-bg-content", "#FEFEFE");
    root.setProperty("--lm-text", "#4B6A9B");
    root.setProperty("--lm-text-alt", "#2B3442");
    root.setProperty("--lm-shadow-xl", "rgba(70, 88, 109, 0.25)");
    root.setProperty("--lm-icon-bg", "brightness(100%)");
    modeText.innerText = "Dark";
    modeIcon.src = "./assets/moon-icon.svg";
    darkMode = false;
    localStorage.setItem("dark-mode", false);
    console.log(localStorage.getItem("dark-mode"));
}
