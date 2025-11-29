// Recommendations Page JavaScript

document.addEventListener("DOMContentLoaded", loadRecommendations);

// Load recommendations from API
async function loadRecommendations() {
  try {
    const response = await fetch("/api/recommendations");
    const data = await response.json();

    if (data.success) {
      displayRecommendations(data.data);
    } else {
      showError("Failed to load recommendations");
    }
  } catch (error) {
    console.error("Error loading recommendations:", error);
    showError("Error loading recommendations");
  }
}

// Display recommendations
function displayRecommendations(recommendations) {
  const grid = document.getElementById("recommendationsGrid");
  const noRecs = document.getElementById("noRecommendations");

  grid.innerHTML = "";

  if (recommendations.length === 0) {
    grid.style.display = "none";
    noRecs.style.display = "block";
    return;
  }

  grid.style.display = "grid";
  noRecs.style.display = "none";

  recommendations.forEach((rec) => {
    const card = createRecommendationCard(rec);
    grid.appendChild(card);
  });
}

// Create recommendation card
function createRecommendationCard(recommendation) {
  const card = document.createElement("div");
  card.className = "recommendation-card";

  // Parse delegate info (adjust based on actual API response structure)
  const delegateName = recommendation.delegate_id || "Unknown Delegate";
  const startupName = recommendation.startup_id || "Unknown Startup";
  const matchPercentage = recommendation.match_percentage || 85;

  card.innerHTML = `
    <div class="recommendation-header">
      <div class="recommendation-delegate">Recommended for</div>
      <div class="recommendation-delegate-name">${delegateName}</div>
    </div>
    <div class="recommendation-body">
      <div class="recommendation-startup">
        <div class="startup-name">${startupName}</div>
        <div class="startup-industry">Technology Startup</div>
        <div class="startup-match">
          <span>Match Score:</span>
          <span class="match-percentage">${matchPercentage}%</span>
        </div>
      </div>
      <div class="recommendation-reasons">
        <div class="reasons-label">Why This Match?</div>
        <div class="reason-item">✓ Similar industry interests</div>
        <div class="reason-item">✓ Complementary expertise</div>
        <div class="reason-item">✓ Potential collaboration opportunity</div>
      </div>
      <div class="recommendation-actions">
        <button class="btn-visit" onclick="markAsVisited(${recommendation.id})">Visit Startup</button>
        <button class="btn-skip" onclick="skipRecommendation(${recommendation.id})">Skip</button>
      </div>
    </div>
  `;

  return card;
}

// Mark recommendation as visited
async function markAsVisited(recommendationId) {
  try {
    const response = await fetch(`/api/recommendations/${recommendationId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visited: true }),
    });

    const result = await response.json();

    if (result.success) {
      loadRecommendations();
      showSuccess("Recommendation marked as visited");
    } else {
      showError("Failed to update recommendation");
    }
  } catch (error) {
    console.error("Error updating recommendation:", error);
    showError("Error updating recommendation");
  }
}

// Skip recommendation
async function skipRecommendation(recommendationId) {
  try {
    const response = await fetch(`/api/recommendations/${recommendationId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (result.success) {
      loadRecommendations();
      showSuccess("Recommendation skipped");
    } else {
      showError("Failed to skip recommendation");
    }
  } catch (error) {
    console.error("Error skipping recommendation:", error);
    showError("Error skipping recommendation");
  }
}

// Filter recommendations
document.getElementById("delegateFilter")?.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const cards = document.querySelectorAll(".recommendation-card");

  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(searchTerm) ? "block" : "none";
  });
});

// Utility functions
function showError(message) {
  alert(`Error: ${message}`);
}

function showSuccess(message) {
  alert(message);
}
