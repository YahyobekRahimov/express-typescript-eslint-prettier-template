const modal = document.getElementById("addUserModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const closeSpan = document.querySelector(".close");
const addUserForm = document.getElementById("addUserForm");

const drawer = document.getElementById("updateUserDrawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const closeDrawerBtn = document.getElementById("closeDrawerBtn");
const drawerCloseSpan = document.querySelector(".drawer-close");
const updateUserForm = document.getElementById("updateUserForm");

let currentEditUserId = null;

// ============ Modal Functions ============
// Open modal
openModalBtn.addEventListener("click", function () {
  modal.style.display = "block";
});

// Close modal
closeModalBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

closeSpan.addEventListener("click", function () {
  modal.style.display = "none";
});

// Close modal when clicking outside of it
window.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// ============ Drawer Functions ============
function openDrawer() {
  drawer.style.display = "block";
  drawerOverlay.style.display = "block";
}

function closeDrawer() {
  drawer.style.display = "none";
  drawerOverlay.style.display = "none";
  updateUserForm.reset();
  currentEditUserId = null;
}

closeDrawerBtn.addEventListener("click", closeDrawer);
drawerCloseSpan.addEventListener("click", closeDrawer);
drawerOverlay.addEventListener("click", closeDrawer);

// ============ Edit User Functionality ============
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-edit")) {
    const userId = e.target.getAttribute("data-id");
    const username = e.target.getAttribute("data-username");

    currentEditUserId = userId;
    document.getElementById("updateUsername").value = username;
    document.getElementById("updatePassword").value = "";

    openDrawer();
  }
});

// ============ Delete User Functionality ============
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-delete")) {
    const userId = e.target.getAttribute("data-id");
    const username = e.target.getAttribute("data-username");

    if (confirm(`Are you sure you want to delete user "${username}"?`)) {
      deleteUser(userId);
    }
  }
});

async function deleteUser(userId) {
  try {
    const response = await fetch(`/dashboard/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.success) {
      alert("User deleted successfully!");
      location.reload();
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while deleting the user");
  }
}

// ============ Update User Form Submission ============
updateUserForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const password = document.getElementById("updatePassword").value;

  // If no new password is provided, don't update it
  if (!password) {
    alert("Please enter a new password to update the user");
    return;
  }

  try {
    const response = await fetch(`/dashboard/users/${currentEditUserId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert("User updated successfully!");
      closeDrawer();
      location.reload();
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while updating the user");
  }
});

// ============ Add User Form Submission ============
addUserForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/dashboard/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        role: "staff",
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert("User created successfully!");
      addUserForm.reset();
      modal.style.display = "none";
      // Reload the page to show the new user
      location.reload();
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while creating the user");
  }
});
