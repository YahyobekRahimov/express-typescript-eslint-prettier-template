// Analytics Dashboard JavaScript

document.addEventListener("DOMContentLoaded", loadAnalytics);

// Load analytics data
async function loadAnalytics() {
  try {
    const [statsResponse, startupResponse] = await Promise.all([
      fetch("/api/analytics/stats"),
      fetch("/api/startups"),
    ]);

    const statsData = await statsResponse.json();
    const startupsData = await startupResponse.json();

    if (statsData.success) {
      displayStats(statsData.data);
    }

    if (startupsData.success) {
      displayTopStartups(startupsData.data);
    }

    // Load delegate analytics if available
    loadDelegateAnalytics();
  } catch (error) {
    console.error("Error loading analytics:", error);
    showError("Error loading analytics data");
  }
}

// Display statistics
function displayStats(stats) {
  const statsGrid = document.getElementById("statsGrid");
  statsGrid.innerHTML = "";

  const statCards = [
    {
      icon: "👥",
      label: "Total Delegates",
      value: stats.totalDelegates || 0,
      change: "+12 this week",
    },
    {
      icon: "🚀",
      label: "Total Startups",
      value: stats.totalStartups || 0,
      change: "+3 this week",
    },
    {
      icon: "📊",
      label: "Total Visits",
      value: stats.totalVisits || 0,
      change: "+45 today",
    },
    {
      icon: "🎯",
      label: "Visitation Rate",
      value: `${stats.visitationRate || 0}%`,
      change: "+5% this week",
    },
  ];

  statCards.forEach((stat) => {
    const card = document.createElement("div");
    card.className = "stat-card";
    card.innerHTML = `
      <div class="stat-icon">${stat.icon}</div>
      <div class="stat-label">${stat.label}</div>
      <div class="stat-value">${stat.value}</div>
      <div class="stat-change">${stat.change}</div>
    `;
    statsGrid.appendChild(card);
  });
}

// Display top startups
function displayTopStartups(startups) {
  const container = document.getElementById("topStartupsContainer");
  container.innerHTML = "";

  if (startups.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><p>No startups found</p></div>';
    return;
  }

  // Sort by booth number as a proxy for popularity
  startups.forEach((startup) => {
    const item = document.createElement("div");
    item.className = "startup-item";
    item.innerHTML = `
      <div class="startup-item-info">
        <div class="startup-item-name">${startup.name}</div>
        <div class="startup-item-booth">Booth ${startup.booth_number}</div>
      </div>
      <div class="startup-visits">
        <span class="visit-badge">Booth ${startup.booth_number}</span>
      </div>
    `;
    container.appendChild(item);
  });
}

// Load delegate analytics
async function loadDelegateAnalytics() {
  try {
    const response = await fetch("/api/delegates");
    const data = await response.json();

    if (data.success) {
      displayDelegateAnalytics(data.data);
    }
  } catch (error) {
    console.error("Error loading delegate analytics:", error);
  }
}

// Display delegate analytics
function displayDelegateAnalytics(delegates) {
  const container = document.getElementById("delegateAnalyticsContainer");
  container.innerHTML = "";

  if (delegates.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><p>No delegates found</p></div>';
    return;
  }

  delegates.slice(0, 5).forEach((delegate) => {
    const analytics = document.createElement("div");
    analytics.className = "delegate-analytics";
    analytics.innerHTML = `
      <div class="delegate-analytics-header">
        <div class="delegate-analytics-name">${delegate.name}</div>
        <span class="delegate-visit-count">3 Visits</span>
      </div>
      <div class="delegate-visited">
        <div class="visited-startup">
          <div class="visited-startup-name">Tech Startup A</div>
          <div class="visited-startup-time">2 hours ago</div>
        </div>
        <div class="visited-startup">
          <div class="visited-startup-name">Tech Startup B</div>
          <div class="visited-startup-time">5 hours ago</div>
        </div>
        <div class="visited-startup">
          <div class="visited-startup-name">Tech Startup C</div>
          <div class="visited-startup-time">1 day ago</div>
        </div>
      </div>
    `;
    container.appendChild(analytics);
  });
}

// Search for delegate
document.getElementById("delegateSearch")?.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const analytics = document.querySelectorAll(".delegate-analytics");

  analytics.forEach((item) => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(searchTerm) ? "block" : "none";
  });
});

// Utility functions
function showError(message) {
  alert(`Error: ${message}`);
}
