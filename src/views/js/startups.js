// Startups Management JavaScript

let currentEditStartupId = null;
const isAdmin = document.body.dataset.isAdmin === "true";

// Elements
const openModalBtn = document.getElementById("openModalBtn");
const addStartupModal = document.getElementById("addStartupModal");
const addStartupForm = document.getElementById("addStartupForm");
const closeModalBtn = document.getElementById("closeModalBtn");
const closeBtn = document.querySelector(".close");

const editStartupDrawer = document.getElementById("editStartupDrawer");
const editStartupForm = document.getElementById("editStartupForm");
const closeDrawerBtn = document.getElementById("closeDrawerBtn");
const drawerCloseBtn = document.querySelector(".drawer-close");
const drawerOverlay = document.getElementById("drawerOverlay");

const startupsGrid = document.getElementById("startupsGrid");
const noStartups = document.getElementById("noStartups");
const searchInput = document.getElementById("searchInput");

// Load startups on page load
document.addEventListener("DOMContentLoaded", loadStartups);

// Modal handlers
openModalBtn?.addEventListener("click", () => openModal());
closeModalBtn?.addEventListener("click", () => closeModal());
closeBtn?.addEventListener("click", () => closeModal());

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (event.target === addStartupModal) {
    closeModal();
  }
});

// Drawer handlers
closeDrawerBtn?.addEventListener("click", () => closeDrawer());
drawerCloseBtn?.addEventListener("click", () => closeDrawer());
drawerOverlay?.addEventListener("click", () => closeDrawer());

// Form submissions
addStartupForm?.addEventListener("submit", handleAddStartup);
editStartupForm?.addEventListener("submit", handleUpdateStartup);

// Search
searchInput?.addEventListener("input", filterStartups);

// Modal functions
function openModal() {
  addStartupForm.reset();
  addStartupModal.classList.add("active");
}

function closeModal() {
  addStartupModal.classList.remove("active");
}

// Drawer functions
function openDrawer(startupId) {
  currentEditStartupId = startupId;
  loadStartupData(startupId);
  editStartupDrawer.classList.add("active");
  drawerOverlay.classList.add("active");
}

function closeDrawer() {
  editStartupDrawer.classList.remove("active");
  drawerOverlay.classList.remove("active");
  currentEditStartupId = null;
}

// Load startups from API
async function loadStartups() {
  try {
    const response = await fetch("/api/startups");
    const data = await response.json();

    if (data.success) {
      displayStartups(data.data);
    } else {
      showError("Failed to load startups");
    }
  } catch (error) {
    console.error("Error loading startups:", error);
    showError("Error loading startups");
  }
}

// Display startups
function displayStartups(startups) {
  startupsGrid.innerHTML = "";

  if (startups.length === 0) {
    startupsGrid.style.display = "none";
    noStartups.style.display = "block";
    return;
  }

  startupsGrid.style.display = "grid";
  noStartups.style.display = "none";

  startups.forEach((startup) => {
    const startupCard = createStartupCard(startup);
    startupsGrid.appendChild(startupCard);
  });
}

// Create startup card
function createStartupCard(startup) {
  const card = document.createElement("div");
  card.className = "startup-card";
  card.innerHTML = `
    <div class="startup-header">
      <div class="startup-info">
        <div class="startup-booth">Booth ${startup.booth_number}</div>
        <div class="startup-name">${startup.name}</div>
        <div class="startup-industry">${startup.industry || "Technology"}</div>
      </div>
    </div>
    <div class="startup-description">${
      startup.description || "No description available"
    }</div>
    <div class="startup-email">${startup.email || "N/A"}</div>
    ${
      isAdmin
        ? `
    <div class="startup-actions">
      <button class="btn-edit" onclick="openDrawer(${startup.id})">Edit</button>
      <button class="btn-delete" onclick="deleteStartup(${startup.id})">Delete</button>
    </div>
    `
        : ""
    }
  `;
  return card;
}

// Load startup data for edit
async function loadStartupData(startupId) {
  try {
    const response = await fetch(`/api/startups/${startupId}`);
    const data = await response.json();

    if (data.success) {
      const startup = data.data;
      document.getElementById("editName").value = startup.name;
      document.getElementById("editEmail").value = startup.email || "";
      document.getElementById("editIndustry").value = startup.industry || "";
      document.getElementById("editBoothNumber").value =
        startup.booth_number || "";
      document.getElementById("editDescription").value =
        startup.description || "";
    }
  } catch (error) {
    console.error("Error loading startup:", error);
    showError("Error loading startup data");
  }
}

// Handle add startup
async function handleAddStartup(e) {
  e.preventDefault();

  const formData = new FormData(addStartupForm);
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    industry: formData.get("industry"),
    booth_number: formData.get("booth_number"),
    description: formData.get("description"),
  };

  try {
    const response = await fetch("/api/startups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      closeModal();
      loadStartups();
      showSuccess("Startup added successfully");
    } else {
      showError(result.error?.message || "Failed to add startup");
    }
  } catch (error) {
    console.error("Error adding startup:", error);
    showError("Error adding startup");
  }
}

// Handle update startup
async function handleUpdateStartup(e) {
  e.preventDefault();

  const formData = new FormData(editStartupForm);
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    industry: formData.get("industry"),
    booth_number: formData.get("booth_number"),
    description: formData.get("description"),
  };

  try {
    const response = await fetch(`/api/startups/${currentEditStartupId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      closeDrawer();
      loadStartups();
      showSuccess("Startup updated successfully");
    } else {
      showError(result.error?.message || "Failed to update startup");
    }
  } catch (error) {
    console.error("Error updating startup:", error);
    showError("Error updating startup");
  }
}

// Delete startup
async function deleteStartup(startupId) {
  if (!confirm("Are you sure you want to delete this startup?")) {
    return;
  }

  try {
    const response = await fetch(`/api/startups/${startupId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (result.success) {
      loadStartups();
      showSuccess("Startup deleted successfully");
    } else {
      showError(result.error?.message || "Failed to delete startup");
    }
  } catch (error) {
    console.error("Error deleting startup:", error);
    showError("Error deleting startup");
  }
}

// Filter startups
function filterStartups() {
  const searchTerm = searchInput.value.toLowerCase();
  const cards = document.querySelectorAll(".startup-card");

  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(searchTerm) ? "block" : "none";
  });
}

// Utility functions
function showError(message) {
  alert(`Error: ${message}`);
}

function showSuccess(message) {
  alert(message);
}
