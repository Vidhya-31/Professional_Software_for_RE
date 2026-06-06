function showPage(pageId, button = null) {

    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    document.querySelectorAll('.sidebar button').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(pageId).classList.add('active');

    if (button) {
        button.classList.add('active');
    }

    localStorage.setItem('activeTab', pageId);
}
document.addEventListener('DOMContentLoaded', function () {

    const activeTab =
        localStorage.getItem('activeTab') || 'testsettings';

    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    document.querySelectorAll('.sidebar button').forEach(btn => {
        btn.classList.remove('active');
    });

    const page = document.getElementById(activeTab);

    if (page) {
        page.classList.add('active');
    }

    const btn = document.querySelector(
        `[onclick*="${activeTab}"]`
    );

    if (btn) {
        btn.classList.add('active');
    }
});


// ---------- TAB SWITCHING ----------
let activeChannel = 1;

function openConfigTab(event, tabName) {

  document.querySelectorAll(".config-tab")
    .forEach(tab => tab.style.display = "none");

  document.querySelectorAll(".tab-btn")
    .forEach(btn => btn.classList.remove("active"));

  document.getElementById(tabName).style.display = "block";
  event.currentTarget.classList.add("active");

  const match = tabName.match(/\d+/);
  if (match) {
    activeChannel = parseInt(match[0]);
  }
}

// ---------- MODAL ----------
function openModal(id) {
  document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

// ---------- LOCAL STORAGE ----------
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}



// =====================================================
//                 INSTRUMENT CRUD
// =====================================================

function renderInstruments(channel) {

  const table = document.getElementById("instrumentTable" + channel);
  if (!table) return;

  table.innerHTML = "";

  const key = "instruments_channel_" + channel;
  const instruments = loadFromLocalStorage(key);

  instruments.forEach((inst, i) => {
    const row = table.insertRow();
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${inst.name}</td>
      <td>${inst.address}</td>
      <td>${inst.serial}</td>
      <td>${inst.date}</td>
      <td>${inst.status}</td>
      <td>
        <button class="crud-btn edit" onclick="editInstrument(${channel}, ${i})">Edit</button>
        <button class="crud-btn delete"
        onclick="deleteInstrument(${channel}, ${i})">
  Delete
</button>
      </td>
    `;
  });
}

function saveInstrument() { 

  const inputs = document.querySelectorAll('#addInstrumentModal input');
  const name = inputs[0].value.trim();
  const address = inputs[1].value.trim();
  const serial = inputs[2].value.trim();
  const date = inputs[3].value.trim();
  const status = document.querySelector('#addInstrumentModal select').value;

  if (!name || !address || !serial || !date) {
    alert("Fill all fields");
    return;
  }

  const key = "instruments_channel_" + activeChannel;
  const instruments = loadFromLocalStorage(key);

  instruments.push({ name, address, serial, date, status });

  saveToLocalStorage(key, instruments);
  renderInstruments(activeChannel);

  closeModal("addInstrumentModal");
  inputs.forEach(i => i.value = "");
}

function editInstrument(channel, index) {

  const key = "instruments_channel_" + channel;
  const instruments = loadFromLocalStorage(key);
  const inst = instruments[index];

  const modal = document.getElementById("editInstrumentModal");
  const inputs = modal.querySelectorAll("input");
  const select = modal.querySelector("select");

  inputs[0].value = inst.name;
  inputs[1].value = inst.address;
  inputs[2].value = inst.serial;
  inputs[3].value = inst.date;
  select.value = inst.status;

  modal.dataset.index = index;
  modal.dataset.channel = channel;

  openModal("editInstrumentModal");
}

function updateInstrument() {

  const modal = document.getElementById("editInstrumentModal");
  const index = modal.dataset.index;
  const channel = modal.dataset.channel;

  const inputs = modal.querySelectorAll("input");
  const select = modal.querySelector("select");

  const key = "instruments_channel_" + channel;
  const instruments = loadFromLocalStorage(key);

  instruments[index] = {
    name: inputs[0].value,
    address: inputs[1].value,
    serial: inputs[2].value,
    date: inputs[3].value,
    status: select.value
  };

  saveToLocalStorage(key, instruments);
  renderInstruments(channel);

  closeModal("editInstrumentModal");
}

let deleteChannel = null;
let deleteIndex = null;

function deleteInstrument(channel, index) {

  deleteChannel = channel;
  deleteIndex = index;

  openModal('deleteInstrumentModal');
}

function confirmDeleteInstrument() {

  if (deleteChannel === null || deleteIndex === null) return;

  const key = "instruments_channel_" + deleteChannel;
  const instruments = loadFromLocalStorage(key);

  instruments.splice(deleteIndex, 1);

  saveToLocalStorage(key, instruments);

  renderInstruments(deleteChannel);

  deleteChannel = null;
  deleteIndex = null;

  closeModal('deleteInstrumentModal');
}



// =====================================================
//                     USER CRUD
// =====================================================

function renderUsers() {

  const table = document.getElementById("userTable");
  if (!table) return;

  table.innerHTML = "";
  const users = loadFromLocalStorage("users");

  users.forEach((user, i) => {
    const row = table.insertRow();
    console.log(row)
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${user.username}</td>
      <td>${user.role}</td>
      <td>${user.status}</td>
      <td>
        <button class="crud-btn edit" onclick="editUser(${i})">Edit</button>
        <button class="crud-btn delete" onclick="openDeleteUserModal(${i})">
          Delete
        </button>
      </td>
    `;
  });
}

function saveUser() {

  const username = document.querySelector('#addUserModal input').value.trim();
  const selects = document.querySelectorAll('#addUserModal select');

  if (!username) {
    alert("Enter username");
    return;
  }

  const users = loadFromLocalStorage("users");
  users.push({
    username,
    role: selects[0].value,
    status: selects[1].value
  });

  saveToLocalStorage("users", users);
  renderUsers();

  closeModal("addUserModal");
  document.querySelector('#addUserModal input').value = "";
}

function editUser(index) {

  const users = loadFromLocalStorage("users");
  const user = users[index];

  const modal = document.getElementById("editUserModal");
  const input = modal.querySelector("input");
  const selects = modal.querySelectorAll("select");

  input.value = user.username;
  selects[0].value = user.role;
  selects[1].value = user.status;

  modal.dataset.index = index;
  openModal("editUserModal");
}

function updateUser() {

  const modal = document.getElementById("editUserModal");
  const index = modal.dataset.index;

  const input = modal.querySelector("input");
  const selects = modal.querySelectorAll("select");

  const users = loadFromLocalStorage("users");
  console.log(users)

  users[index] = {
    username: input.value,
    role: selects[0].value,
    status: selects[1].value
  };

  saveToLocalStorage("users", users);
  renderUsers();

  closeModal("editUserModal");
}
let userIndexToDelete = null;

function openDeleteUserModal(index) {
  console.log("Index set:", index);
  userIndexToDelete = index;
  openModal('deleteUserModal');
}
function confirmDeleteUser() {

  console.log("Deleting index:", userIndexToDelete);

  if (userIndexToDelete === null) {
    console.error("Delete index is null!");
    return;
  }

  let users = loadFromLocalStorage("users") || [];

  users.splice(parseInt(userIndexToDelete), 1);

  saveToLocalStorage("users", users);

  userIndexToDelete = null;

  renderUsers();
  closeModal('deleteUserModal');
}

// ======================================================
// INIT ON PAGE LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", function () {
  renderInstruments(1);
  renderInstruments(2);

  renderUsers();
});
// ---------- Config Tabs ----------
// function openConfigTab(event, tabId) {
//   // Hide all tabs
//   document.querySelectorAll(".config-tab").forEach(tab => tab.style.display = "none");
//   document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

//   // Show active tab
//   document.getElementById(tabId).style.display = "block";
//   event.currentTarget.classList.add("active");
// }

// Update status dynamically
function setConnectionStatus(isConnected) {
  const status = document.getElementById("connectionStatus");
  status.textContent = isConnected ? "RUNNING" : "STOPPED";
  status.style.color = isConnected ? "yellow" : "red";
  status.style.fontSize = "60px"; // 👈 Increase font size here
  status.style.fontWeight = "bold"; // (optional) make it bold
}

// live Date and Time

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


// Example status call:
// setConnectionStatus(false); // default disconnected
// setConnectionStatus(true); // call this when connected

//---------------------------------//
function toggleBypass(type) {
  const status = document.getElementById(type + "Status");
  const toggle = document.getElementById(type + "Toggle");

  if (toggle.checked) {
    status.innerText = "Enabled";
    status.style.color = "green";
  } else {
    status.innerText = "Disabled";
    status.style.color = "red";
  }
}
////////////////////////////////////////////////////////////////
let allReports = [];

// When folder is chosen
document.getElementById("folderPicker").addEventListener("change", function (e) {
    allReports = [];

    Array.from(e.target.files).forEach(file => {
        const nameLower = file.name.toLowerCase();

        // Allow only PDF + HTML
        const allowed = [".pdf", ".html", ".htm"];
        if (!allowed.some(ext => nameLower.endsWith(ext))) return;

        // Extract date from file name
        let name = file.name;
        let match =
            name.match(/\b\d{4}[-_.]?\d{2}[-_.]?\d{2}\b/) ||
            name.match(/\b\d{2}[-_.]?\d{2}[-_.]?\d{4}\b/) ||
            name.match(/\b\d{8}\b/);

        let fileDate = "";

        if (match) {
            fileDate = match[0].replace(/[_.]/g, "-");

            if (/^\d{2}-\d{2}-\d{4}$/.test(fileDate)) {
                const [d, m, y] = fileDate.split("-");
                fileDate = `${y}-${m}-${d}`;
            }

            if (/^\d{8}$/.test(fileDate)) {
                const y = fileDate.slice(0, 4);
                const m = fileDate.slice(4, 6);
                const d = fileDate.slice(6, 8);
                fileDate = `${y}-${m}-${d}`;
            }
        } else {
            const d = new Date(file.lastModified);
            fileDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        }

let reportType = document.getElementById("reportType").value;

allReports.push({ 
    file, 
    fileDate,
    reportType  // store type inside object
});
    });

    displayReports(allReports);
});

// Display file list
function displayReports(files) {
    const list = document.getElementById("reportList");
    list.innerHTML = "";

    if (files.length === 0) {
        list.innerHTML = "<li>No reports found</li>";
        return;
    }

    files.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.file.name} (${item.fileDate})`;
        li.style.cursor = "pointer";
        li.style.color = "blue";
        li.style.textDecoration = "underline";
        li.onclick = () => openFile(item.file);
        list.appendChild(li);
    });
}

// Open PDF/HTML
function openFile(file) {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
}

// Trigger folder selection when selecting report type
function openFolder() {
    const type = document.getElementById("reportType").value;

    if (type === "") {
        document.getElementById("reportList").innerHTML = "<li>No reports found</li>";
        return;
    }

    document.getElementById("folderPicker").click();
}

function filterReports() {
    let nameFilter = document.getElementById("reportName").value.trim().toLowerCase();
    let dateFilter = document.getElementById("reportDate").value.trim();
    let typeFilter = document.getElementById("reportType").value.trim();

    let filtered = allReports.filter(item => {

        // Filter by name
        if (nameFilter !== "" && !item.file.name.toLowerCase().includes(nameFilter)) {
            return false;
        }

        // Filter by date
        if (dateFilter !== "" && item.fileDate !== dateFilter) {
            return false;
        }

        // Filter by report type (match stored type)
        if (typeFilter !== "" && item.reportType !== typeFilter) {
            return false;
        }

        return true;
    });

    displayReports(filtered);
}


//-----------------------------------------------------//
// ---------- Shift Dropdown Logic ----------


function applyDateFilter() {
  const from = document.getElementById('fromDate').value;
  const to = document.getElementById('toDate').value;

  if (!from || !to) {
    alert('Please select both From and To dates.');
    return;
  }

  document.getElementById('filterStatus').textContent = `Filtered reports from ${from} to ${to}`;
}


  // ================= GLOBAL VARIABLES ==============
// let liveChart;
// let liveData = {};
let plotMode = "standard"; // "standard" or "xy"
let liveRunning = false;
let timeCounter = 0;
let liveInterval = null;
let intervalId = null; // for measurement timer
// Live data arrays
let liveData = {
  labels: [],       // time labels
  voltage: [],
  current: [],
  resistance: []
};

const axisOptions = {
  voltage: "Voltage (V)",
  current: "Current (A)",
  resistance: "Resistance (Ω)"
};











document.getElementById('homeBtn').addEventListener('click', () => {
  window.location.href = "home.html";
});



function openLiveTab(event, tabId) {

    document.querySelectorAll(".live-tab-content")
        .forEach(tab => tab.classList.remove("active"));

    document.querySelectorAll(".live-tab-btn")
        .forEach(btn => btn.classList.remove("active"));

    document.getElementById(tabId)
        .classList.add("active");

    event.currentTarget
        .classList.add("active");
}
document.querySelectorAll(".temp-value").forEach(item => {

    const temp = parseFloat(item.dataset.temp);

    if (temp < 40) {
        item.classList.add("temp-normal");
    }
    else if (temp < 60) {
        item.classList.add("temp-warning");
    }
    else {
        item.classList.add("temp-high");
    }

});
// Time data
let time = [];
for (let t = 0; t <= 10; t++) {
    time.push(t);
}

// Charging curve
function generateCharging(offset) {
    return time.map(t => 5 * (1 - Math.exp(-(t + offset) / 2)));
}

// Discharging curve
function generateDischarging(offset) {
    return time.map(t => 5 * Math.exp(-(t + offset) / 2));
}

// Create chart
function createChart(id, label, mode) {

    let dataValues;

    if (mode === "charging") {
        dataValues = generateCharging(Math.random());
    } else {
        dataValues = generateDischarging(Math.random());
    }

    new Chart(document.getElementById(id), {
        type: 'line',
        data: {
            labels: time,
            datasets: [{
                label: label + " (" + mode + ")",
                data: dataValues,
                borderWidth: 2,
                tension: 0.4
            }]
        },
       options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top'
        }
    },
    interaction: {
        mode: 'index',
        intersect: false
    },
    scales: {
        x: {
            grid: {
                display: false
            }
        },
        y: {
            beginAtZero: true
        }
    }
       }
    });
}

// Create 6 graphs with correct modes
createChart("dut1", "DUT 1", "charging");
createChart("dut2", "DUT 2", "discharging");
createChart("dut3", "DUT 3", "charging");
createChart("dut4", "DUT 4", "discharging");




function updateDUT() {
    const channel = document.getElementById("channel").value;
    const dutSelect = document.getElementById("dut");

    dutSelect.innerHTML = '<option value="">-- Select DUT --</option>';

    const dutData = {
    ch1: ["Supplier A", "Supplier B", "Supplier C"],
    ch2: ["Supplier A", "Supplier B", "Supplier C"],
    ch3: ["Supplier A", "Supplier B", "Supplier C"]
  };
console.log(dutData)
    if (channel && dutData[channel]) {
        dutData[channel].forEach(dut => {
            const option = document.createElement("option");
            option.value = dut;
            option.text = dut;
            dutSelect.appendChild(option);
        });
    }
}

function showSelection() {
    const channel = document.getElementById("channel").value;
    const dut = document.getElementById("dut").value;
    const result = document.getElementById("result");

    if (!channel || !dut) {
        result.innerHTML = "Please select Channel and DUT!";
    } else {
        result.innerHTML = `Selected: ${channel.toUpperCase()} - ${dut}`;
    }
}



const role = localStorage.getItem("role");
const isLoggedIn = localStorage.getItem("isLoggedIn");

// If not logged in → go back
if (!isLoggedIn) {
    window.location.href = "home.html";
}

// If operator → restrict buttons
if (role === "operator") {

    document.getElementById("configBtn").style.display = "none";
    document.getElementById("paramBtn").style.display = "none";
}


window.addEventListener("load", function () {

    const adminName = document.getElementById("adminName");
    const savedUser = localStorage.getItem("username");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true" && savedUser) {
        adminName.textContent = savedUser;
    } else {
        adminName.textContent = "Not Logged In";
        // Optional: Redirect if not logged in
        window.location.href = "home.html";
    }

});



// ================= CLEAR DATA ONLY ON PAGE REFRESH =================
if (performance.navigation.type === 1) {
    sessionStorage.removeItem("testData");
}


// ================= START BUTTON LOGIC =================
document.addEventListener("DOMContentLoaded", () => {

    const startButtons = document.querySelectorAll(".startBtn");

    startButtons.forEach((button) => {

        button.addEventListener("click", function () {

            // Current channel box
            const channelBox = this.closest(".channel-box");

            // Channel name
           const channelName = channelBox.querySelector("h3").textContent.trim();

            //  DUT SELECTION 
            const selectedDUTs = Array.from(
                channelBox.querySelectorAll(".dutCheck:checked")
            ).map(dut => dut.value);

            //  TEST SELECTION 
            const selectedTests = Array.from(
                channelBox.querySelectorAll(".testCheck:checked")
            ).map(test => test.value);

            //  CYCLES 
            const cyclesInput = channelBox.querySelector(".cycles");
            const cycles = cyclesInput.value.trim();

            //  VALIDATIONS 

            // DUT validation
            if (selectedDUTs.length < 1) {
                alert("Please select at least 1 DUT for " + channelName);
                return;
            }

            // Test validation
            if (selectedTests.length < 1) {
                alert("Please select at least 1 Test for " + channelName);
                return;
            }

            // Cycles validation
            if (cycles === "" || isNaN(cycles) || Number(cycles) < 1) {
                alert("Please enter valid cycles (>= 1) for " + channelName);
                return;
            }

            //  GET OLD DATA 
            let allData = JSON.parse(sessionStorage.getItem("testData")) || {};

            //  SAVE CURRENT CHANNEL 
            allData[channelName] = {

                channel: channelName,
                duts: selectedDUTs,
                tests: selectedTests,
                cycles: Number(cycles),
                status: "Running"

            };

            //  SAVE TO STORAGE 
            sessionStorage.setItem("testData", JSON.stringify(allData));

            //  DISABLE BUTTON 
            this.disabled = true;
            this.innerText = "Started";
            this.style.background = "#94a3b8";
            this.style.cursor = "not-allowed";

            // SUCCESS 
            alert(channelName + " Started Successfully!");

            //  ROUTE TO HOME
            window.location.href = "home.html";

        });

    });

});


// ================= RESTORE SAVED DATA =================
document.addEventListener("DOMContentLoaded", () => {

    // Get all saved channels
    const allData = JSON.parse(sessionStorage.getItem("testData")) || {};

    // Loop all channel boxes
    document.querySelectorAll(".channel-box").forEach((box) => {

        // Current channel name
        const channelName = box.querySelector("h3").textContent;

        // Get that channel saved data
        const saved = allData[channelName];

        // If no saved data skip
        if (!saved) return;

        // RESTORE DUTS 
        box.querySelectorAll(".dutCheck").forEach((cb) => {

            cb.checked = saved.duts.includes(cb.value);

        });

        // RESTORE TESTS 
        box.querySelectorAll(".testCheck").forEach((cb) => {

            cb.checked = saved.tests.includes(cb.value);

        });

        // RESTORE CYCLES
        const cycleInput = box.querySelector(".cycles");

        if (cycleInput) {

            cycleInput.value = saved.cycles;

        }

        // DISABLE START BUTTON 
        const btn = box.querySelector(".startBtn");

        if (btn) {

            btn.disabled = true;
            btn.innerText = "Started";
            btn.style.background = "#94a3b8";
            btn.style.cursor = "not-allowed";

        }

    });

});




document.addEventListener("DOMContentLoaded", function () {

    const allData = JSON.parse(sessionStorage.getItem("testData")) || {};

    console.log("Stored Data:", allData);

    if (Object.keys(allData).length === 0) {
        console.log("No active channels found.");
        document.querySelector(".dashboard").innerHTML =
            "<h3 style='text-align:center;'>No Active Channels</h3>";
        return;
    }

    document.querySelectorAll(".channel-card").forEach(card => {
        card.style.display = "none";
    });

    Object.values(allData).forEach(channel => {

        const channelName = channel.channel.trim();
        console.log("Looking for:", channelName);

        const card = document.querySelector(
            `.channel-card[data-channel="${channelName}"]`
        );

        if (!card) {
            console.log("Channel not found in HTML:", channelName);
            return;
        }

        card.style.display = "block";

        card.querySelectorAll(".graph").forEach(graph => {
            graph.style.display = "none";
        });

        channel.duts.forEach(dut => {

            const graph = card.querySelector(
                `.graph[data-dut="${dut}"]`
            );

            if (graph) {
                graph.style.display = "block";
            } else {
                console.log("DUT graph not found:", dut);
            }

        });

    });

});

document.getElementById("csvFile").addEventListener("change", function (e) {

    const file = e.target.files[0];

    if (!file) {
        document.getElementById("fileInfo").textContent =
            "No file selected";
        return;
    }

    document.getElementById("fileInfo").textContent =
        file.name;

    const reader = new FileReader();

    reader.onload = function(event) {
        const csvContent = event.target.result;

        console.log("File Name:", file.name);
        console.log(csvContent);

        // Process CSV data here
    };

    reader.readAsText(file);
});