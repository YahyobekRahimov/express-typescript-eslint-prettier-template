const modal = document.getElementById("addUserModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const closeSpan = document.querySelector(".close");
const addUserForm = document.getElementById("addUserForm");

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

// Handle form submission
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
