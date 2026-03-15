/* ====================================================
   College Event Management System – Final Stable Version
   Features: Event display, Add Event, Delete, Registration
   ==================================================== */

console.log("✅ Script loaded successfully");

// === Load events from localStorage OR use default ===
let events = [];

const saved = localStorage.getItem("itg_events");
if (saved && saved !== "[]") {
  try {
    events = JSON.parse(saved);
    console.log("📦 Loaded events from localStorage:", events);
  } catch (e) {
    console.error("❌ localStorage error:", e);
    events = [];
  }
}

// Default fallback events (used only if storage empty)
if (events.length === 0) {
  events = [
    {
      name: "Tech Fest 2025",
      date: "20 Dec 2025",
      venue: "Seminar Hall",
      type: "Technical",
      description: "A festival showcasing technical innovation, workshops and coding contests."
    },
    {
      name: "Sports Meet 2026",
      date: "15 Jan 2026",
      venue: "Sports Ground",
      type: "Sports",
      description: "Inter-department athletics, football, and indoor games."
    },
    {
      name: "Cultural Night",
      date: "10 Feb 2026",
      venue: "Auditorium",
      type: "Cultural",
      description: "Music, dance and theatre performances by students."
    },
    {
      name: "AI Workshop",
      date: "05 Mar 2026",
      venue: "Computer Lab A",
      type: "Workshop",
      description: "Hands-on workshop on machine learning basics and projects."
    },
    {
      name: "Entrepreneurship Talk",
      date: "22 Mar 2026",
      venue: "Conference Room",
      type: "Seminar",
      description: "Talk by startup founders on getting started with business ideas."
    },
    {
      name: "Hackathon 2026",
      date: "18 Apr 2026",
      venue: "CC Lab",
      type: "Technical",
      description: "24-hour coding marathon with prizes and mentorship."
    }
  ];
  console.log("🆕 Using default events:", events);
}

// === Select elements ===
const eventGrid = document.getElementById("event-grid");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalClose = document.getElementById("modal-close");
const modalCancel = document.getElementById("modal-cancel");
const regForm = document.getElementById("reg-form");
const eventNameInput = document.getElementById("event-name");
const regList = document.getElementById("reg-list");

// === Function: Display Events Dynamically ===
function displayEvents() {
  eventGrid.innerHTML = "";

  events.forEach((event, index) => {
    const card = document.createElement("div");
    card.classList.add("event-card");

    card.innerHTML = `
      <h3>${event.name}</h3>
      <p><strong>Date:</strong> ${event.date}</p>
      <p><strong>Venue:</strong> ${event.venue}</p>
      <p><strong>Type:</strong> ${event.type}</p>
      <p>${event.description}</p>
      <div class="card-buttons">
        <button class="btn primary" data-event="${event.name}">Register</button>
        <button class="btn delete" data-index="${index}">🗑️ Delete</button>
      </div>
    `;

    // --- Register button opens modal ---
    const registerBtn = card.querySelector(".btn.primary");
    registerBtn.addEventListener("click", () => openModal(event.name));

    // --- Delete button functionality ---
    const deleteBtn = card.querySelector(".btn.delete");
    deleteBtn.addEventListener("click", () => {
      if (confirm(`🗑️ Delete "${event.name}" permanently?`)) {
        events.splice(index, 1); // remove from array
        localStorage.setItem("itg_events", JSON.stringify(events)); // update storage
        displayEvents(); // refresh display
      }
    });

    eventGrid.appendChild(card);
  });

  console.log("🎨 Events rendered:", events.length);
}

// === Modal Functions (for Register) ===
function openModal(eventName) {
  modal.classList.remove("hidden");
  modalTitle.textContent = `Register for "${eventName}"`;
  eventNameInput.value = eventName;
  document.getElementById("fullname").focus();
}

function closeModal() {
  modal.classList.add("hidden");
  regForm.reset();
}

// === Registration Logic ===
function getRegistrations() {
  try {
    return JSON.parse(localStorage.getItem("itg_registrations") || "[]");
  } catch {
    return [];
  }
}

function saveRegistration(obj) {
  const arr = getRegistrations();
  arr.unshift(obj); // newest first
  localStorage.setItem("itg_registrations", JSON.stringify(arr));
  renderRegistrations();
}

function renderRegistrations() {
  const arr = getRegistrations();
  if (!arr.length) {
    regList.textContent = "No registrations yet.";
    return;
  }regList.innerHTML = arr
  .slice(0, 10)
  .map(r => {
    const time = new Date(r.time).toLocaleString();
    return `
      <div class="reg-item">
        <strong>${escapeHtml(r.name)}</strong> (${escapeHtml(r.roll)})<br>
        <span>${escapeHtml(r.branch)} - ${escapeHtml(r.year)} Year, Sec ${escapeHtml(r.section)}</span><br>
        <span>${escapeHtml(r.gender)} | ${escapeHtml(r.phone)} | ${escapeHtml(r.email)}</span><br>
        <span>Event: <b>${escapeHtml(r.event)}</b></span><br>
        <span style="color:#888">Registered on: ${time}</span>
      </div>
      <hr>
    `;
  })
  .join("");



  regList.innerHTML = arr
    .slice(0, 6)
    .map(r => {
      const time = new Date(r.time).toLocaleString();
      return `<div><strong>${escapeHtml(r.event)}</strong> — ${escapeHtml(r.name)} · ${escapeHtml(r.roll)} · ${escapeHtml(r.email)} <span style="color:#999">(${time})</span></div>`;
    })
    .join("");
}

regForm.addEventListener("submit", e => {
 regForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("fullname").value.trim();
  const roll = document.getElementById("roll").value.trim();
  const email = document.getElementById("email").value.trim();
  const branch = document.getElementById("branch").value.trim();
  const year = document.getElementById("year").value.trim();
  const section = document.getElementById("section").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const gender = document.getElementById("gender").value.trim();
  const event = document.getElementById("event-name").value;

  if (!name || !roll || !email || !branch || !year || !section || !phone || !gender) {
    return alert("⚠️ Please fill all fields.");
  }

  const reg = { 
    name, 
    roll, 
    email,
    branch,
    year,
    section,
    phone,
    gender,
    event, 
    time: Date.now() 
  };

  saveRegistration(reg);
  alert(`✅ ${name} registered for ${event}`);
  closeModal();
});

});

// === Modal close listeners ===
modalClose.addEventListener("click", closeModal);
modalCancel?.addEventListener("click", closeModal);
window.addEventListener("click", ev => {
  if (ev.target === modal) closeModal();
});

// === Escape HTML helper ===
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, ch => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[ch]));
}

// === Add Event Form ===
const addForm = document.getElementById("add-event-form");

if (addForm) {
  addForm.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("event-name").value.trim();
    const date = document.getElementById("event-date").value.trim();
    const venue = document.getElementById("event-venue").value.trim();
    const type = document.getElementById("event-type").value.trim();
    const description = document.getElementById("event-desc").value.trim();

    if (!name || !date || !venue || !type || !description) {
      alert("⚠️ Please fill in all fields before adding an event!");
      return;
    }

    const newEvent = { name, date, venue, type, description };
    events.push(newEvent);

    localStorage.setItem("itg_events", JSON.stringify(events));
    // === Reset All Events Button ===
const resetBtn = document.getElementById("reset-events");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset all events to default?")) {
      localStorage.removeItem("itg_events");
      location.reload(); // reloads page to show default events
    }
  });
}

    function displayEvents() {
  eventGrid.innerHTML = "";

  events.forEach((event, index) => {
    const card = document.createElement("div");
    card.classList.add("event-card");

    card.innerHTML = `
      <h3>${event.name}</h3>
      <p><strong>Date:</strong> ${event.date}</p>
      <p><strong>Venue:</strong> ${event.venue}</p>
      <p><strong>Type:</strong> ${event.type}</p>
      <p>${event.description}</p>
      <div class="card-buttons">
        <button class="btn primary" data-event="${event.name}">Register</button>
        <button class="btn edit" data-index="${index}">✏️ Edit</button>
        <button class="btn delete" data-index="${index}">🗑️ Delete</button>
      </div>
    `;

    // --- Register button ---
    card.querySelector(".btn.primary").addEventListener("click", () => openModal(event.name));

    // --- Delete button ---
    card.querySelector(".btn.delete").addEventListener("click", () => {
      if (confirm(`🗑️ Delete "${event.name}" permanently?`)) {
        events.splice(index, 1);
        localStorage.setItem("itg_events", JSON.stringify(events));
        displayEvents();
      }
    });

    // --- Edit button ---
    card.querySelector(".btn.edit").addEventListener("click", () => startEditEvent(index));

    eventGrid.appendChild(card);
  });

  console.log("🎨 Events rendered:", events.length);
}

    addForm.reset();
    alert("✅ New event added successfully!");
  });
}

// === Initialize Page ===
displayEvents();
renderRegistrations();
console.log("🚀 Page initialized successfully");
