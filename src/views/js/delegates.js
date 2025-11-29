// Delegates Management JavaScript

let currentEditDelegateId = null;
const isAdmin = document.body.dataset.isAdmin === "true";

// Elements
const openModalBtn = document.getElementById("openModalBtn");
const addDelegateModal = document.getElementById("addDelegateModal");
const addDelegateForm = document.getElementById("addDelegateForm");
const closeModalBtn = document.getElementById("closeModalBtn");
const closeBtn = document.querySelector(".close");

const editDelegateDrawer = document.getElementById("editDelegateDrawer");
const editDelegateForm = document.getElementById("editDelegateForm");
const closeDrawerBtn = document.getElementById("closeDrawerBtn");
const drawerCloseBtn = document.querySelector(".drawer-close");
const drawerOverlay = document.getElementById("drawerOverlay");

const delegatesGrid = document.getElementById("delegatesGrid");
const noDelegates = document.getElementById("noDelegates");
const searchInput = document.getElementById("searchInput");

// Load delegates on page load
document.addEventListener("DOMContentLoaded", loadDelegates);

// Modal handlers
openModalBtn?.addEventListener("click", () => openModal());
closeModalBtn?.addEventListener("click", () => closeModal());
closeBtn?.addEventListener("click", () => closeModal());

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (event.target === addDelegateModal) {
    closeModal();
  }
});

// Drawer handlers
closeDrawerBtn?.addEventListener("click", () => closeDrawer());
drawerCloseBtn?.addEventListener("click", () => closeDrawer());
drawerOverlay?.addEventListener("click", () => closeDrawer());

// Form submissions
addDelegateForm?.addEventListener("submit", handleAddDelegate);
editDelegateForm?.addEventListener("submit", handleUpdateDelegate);

// Search
searchInput?.addEventListener("input", filterDelegates);

// Modal functions
function openModal() {
  addDelegateForm.reset();
  addDelegateModal.classList.add("active");
}

function closeModal() {
  addDelegateModal.classList.remove("active");
}

// Drawer functions
function openDrawer(delegateId) {
  currentEditDelegateId = delegateId;
  loadDelegateData(delegateId);
  editDelegateDrawer.classList.add("active");
  drawerOverlay.classList.add("active");
}

function closeDrawer() {
  editDelegateDrawer.classList.remove("active");
  drawerOverlay.classList.remove("active");
  currentEditDelegateId = null;
}

// Load delegates from API
async function loadDelegates() {
  try {
    const response = await fetch("/api/delegates");
    const data = await response.json();

    if (data.success) {
      displayDelegates(data.data);
    } else {
      showError("Failed to load delegates");
    }
  } catch (error) {
    console.error("Error loading delegates:", error);
    showError("Error loading delegates");
  }
}

// Display delegates
function displayDelegates(delegates) {
  delegatesGrid.innerHTML = "";

  if (delegates.length === 0) {
    delegatesGrid.style.display = "none";
    noDelegates.style.display = "block";
    return;
  }

  delegatesGrid.style.display = "grid";
  noDelegates.style.display = "none";

  delegates.forEach((delegate) => {
    const delegateCard = createDelegateCard(delegate);
    delegatesGrid.appendChild(delegateCard);
  });
}

// Create delegate card
function createDelegateCard(delegate) {
  const card = document.createElement("div");
  card.className = "delegate-card";
  card.innerHTML = `
    <div class="delegate-header">
      <div class="delegate-info">
        <div class="delegate-badge">${delegate.badge_id}</div>
        <div class="delegate-name">${delegate.name}</div>
        <div class="delegate-company">${
          delegate.company_name || "Not specified"
        }</div>
      </div>
    </div>
    <div class="delegate-details">
      <div class="detail-item">
        <span class="detail-label">Email:</span>
        <span class="detail-value">${delegate.email || "N/A"}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Job Title:</span>
        <span class="detail-value">${delegate.job_title || "N/A"}</span>
      </div>
    </div>
    ${
      isAdmin
        ? `
    <div class="delegate-actions">
      <button class="btn-edit" onclick="openDrawer(${delegate.id})">Edit</button>
      <button class="btn-delete" onclick="deleteDelegate(${delegate.id})">Delete</button>
    </div>
    `
        : ""
    }
  `;
  return card;
}

// Load delegate data for edit
async function loadDelegateData(delegateId) {
  try {
    const response = await fetch(`/api/delegates/${delegateId}`);
    const data = await response.json();

    if (data.success) {
      const delegate = data.data;
      document.getElementById("editName").value = delegate.name;
      document.getElementById("editEmail").value = delegate.email || "";
      document.getElementById("editJobTitle").value = delegate.job_title || "";
      document.getElementById("editCompanyName").value =
        delegate.company_name || "";
    }
  } catch (error) {
    console.error("Error loading delegate:", error);
    showError("Error loading delegate data");
  }
}

// Handle add delegate
async function handleAddDelegate(e) {
  e.preventDefault();

  const formData = new FormData(addDelegateForm);
  const data = {
    badge_id: formData.get("badge_id"),
    name: formData.get("name"),
    email: formData.get("email"),
    job_title: formData.get("job_title"),
    company_name: formData.get("company_name"),
  };

  try {
    const response = await fetch("/api/delegates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      closeModal();
      loadDelegates();
      showSuccess("Delegate added successfully");
    } else {
      showError(result.error?.message || "Failed to add delegate");
    }
  } catch (error) {
    console.error("Error adding delegate:", error);
    showError("Error adding delegate");
  }
}

// Handle update delegate
async function handleUpdateDelegate(e) {
  e.preventDefault();

  const formData = new FormData(editDelegateForm);
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    job_title: formData.get("job_title"),
    company_name: formData.get("company_name"),
  };

  try {
    const response = await fetch(`/api/delegates/${currentEditDelegateId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      closeDrawer();
      loadDelegates();
      showSuccess("Delegate updated successfully");
    } else {
      showError(result.error?.message || "Failed to update delegate");
    }
  } catch (error) {
    console.error("Error updating delegate:", error);
    showError("Error updating delegate");
  }
}

// Delete delegate
async function deleteDelegate(delegateId) {
  if (!confirm("Are you sure you want to delete this delegate?")) {
    return;
  }

  try {
    const response = await fetch(`/api/delegates/${delegateId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (result.success) {
      loadDelegates();
      showSuccess("Delegate deleted successfully");
    } else {
      showError(result.error?.message || "Failed to delete delegate");
    }
  } catch (error) {
    console.error("Error deleting delegate:", error);
    showError("Error deleting delegate");
  }
}

// Filter delegates
function filterDelegates() {
  const searchTerm = searchInput.value.toLowerCase();
  const cards = document.querySelectorAll(".delegate-card");

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
