function updateClock() {
  const now = new Date();

  let dd = String(now.getDate()).padStart(2, "0");
  let mm = String(now.getMonth() + 1).padStart(2, "0"); // Months start at 0
  let yyyy = now.getFullYear();

  let hh = String(now.getHours()).padStart(2, "0");
  let min = String(now.getMinutes()).padStart(2, "0");
  let sec = String(now.getSeconds()).padStart(2, "0");

  const formattedTime = `${dd}/${mm}/${yyyy} ${hh}:${min}:${sec}`;

  document.getElementById("clock").textContent = formattedTime;
}

setInterval(updateClock, 1000);
updateClock();

// ================= LOGIN SYSTEM =================
const menuBtn = document.getElementById("menuBtn");
const loginBtnHome = document.getElementById("loginBtnHome");

const popup = document.getElementById("loginPopup");
const closeBtn = document.getElementById("closeBtn");

const loginBtn = document.getElementById("loginBtn");
const username = document.getElementById("username");
const password = document.getElementById("password");
const errorMsg = document.getElementById("errorMsg");


// ================= CHECK LOGIN STATE ON PAGE LOAD =================
window.addEventListener("load", () => {
    updateLoginButton();
});


// ================= UPDATE BUTTON TEXT =================
function updateLoginButton() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
        loginBtnHome.textContent = "Logout";
        loginBtnHome.classList.remove("login-style");
        loginBtnHome.classList.add("logout-style");
    } else {
        loginBtnHome.textContent = "Login";
        loginBtnHome.classList.remove("logout-style");
        loginBtnHome.classList.add("login-style");
    }
}


// ================= MENU BUTTON =================
menuBtn.addEventListener("click", () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
        window.location.href = "menu.html";
    } else {
        popup.style.display = "flex";
    }
});
const adminName = document.getElementById("adminName");



// ================= LOGIN / LOGOUT BUTTON =================
loginBtnHome.addEventListener("click", () => {

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
        // 🔴 LOGOUT
        localStorage.removeItem("isLoggedIn");
localStorage.removeItem("username");
updateLoggedUser();;
        updateLoginButton();
        alert("Logged out successfully");
    } else {
        // 🟢 OPEN LOGIN POPUP
        popup.style.display = "flex";
    }

});


// ================= CLOSE POPUP =================
closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
});


// ================= LOGIN VALIDATION =================
loginBtn.addEventListener("click", () => {

    const user = username.value.trim();
    const pass = password.value.trim();

    if (user === "" || pass === "") {
        errorMsg.textContent = "Please enter username and password";
        return;
    }

    // ADMIN LOGIN
    if (user === "admin" && pass === "1234") {

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", "admin");
        localStorage.setItem("username", user);

        popup.style.display = "none";
        updateLoginButton();

        window.location.href = "menu.html";
    }

    // OPERATOR LOGIN
    else if (user === "operator" && pass === "5678") {

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", "operator");
        localStorage.setItem("username", user);

        popup.style.display = "none";
        updateLoginButton();

        window.location.href = "menu.html";
    }

    // INVALID LOGIN
    else {
        errorMsg.textContent = "Invalid username or password";
    }

});


window.addEventListener("load", () => {
    updateLoginButton();
    updateLoggedUser();
});
function updateLoggedUser() {
    const adminName = document.getElementById("adminName");
    const savedUser = localStorage.getItem("username");

    if (savedUser) {
        adminName.textContent = savedUser;
    } else {
        adminName.textContent = "Not Logged In";
    }
}







document.addEventListener("DOMContentLoaded", () => {

    // Get saved data
    const allData = JSON.parse(sessionStorage.getItem("testData")) || {};

    // Get Test Status value
    const statusValue = document.querySelector("#resistanceCard .value");

    // If test data exists
    if (Object.keys(allData).length > 0) {

        statusValue.innerText = "Running";
        statusValue.style.color = "black";

    } else {

        statusValue.innerText = "Stop";
        statusValue.style.color = "black";
    }

});