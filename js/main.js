/* ========================================= */
/* CONSOLIDATED GLOBAL FUNCTIONALITY         */
/* ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ========================================= */
  /* 1. Sidebar Interactions                   */
  /* ========================================= */
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const overlay = document.querySelector(".sidebar-overlay");
  const sidebarContainer = document.getElementById("sidebar");
  const collapseBtn = document.getElementById("collapseBtn");

  function toggleMobileMenu() {
    if (!sidebarContainer || !overlay) return;

    sidebarContainer.classList.toggle("show");

    if (overlay.style.display === "block") {
      overlay.style.opacity = "0";
      setTimeout(() => {
        overlay.style.display = "none";
      }, 300);
    } else {
      overlay.style.display = "block";
      setTimeout(() => {
        overlay.style.opacity = "1";
      }, 10);
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMobileMenu);
  }
  if (overlay) {
    overlay.addEventListener("click", toggleMobileMenu);
  }

  if (collapseBtn) {
    collapseBtn.addEventListener("click", () => {
      sidebarContainer.classList.toggle("collapsed");
    });
  }

  /* ========================================= */
  /* 2. Persistent Dark Mode Toggle Logic      */
  /* ========================================= */
  const themeToggle = document.getElementById("themeToggle");
  const bodyTag = document.body;

  // 1. Check browser memory for the saved theme (Default to light)
  const savedTheme = localStorage.getItem("hop_theme") || "light";
  applyTheme(savedTheme);

  // 2. Listen for clicks on the Theme Toggle button
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = bodyTag.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";
      applyTheme(newTheme);
    });
  }

  // 3. The function that updates the whole app
  function applyTheme(theme) {
    // Set both attributes so Bootstrap AND Custom CSS work together perfectly
    bodyTag.setAttribute("data-bs-theme", theme);
    bodyTag.setAttribute("data-theme", theme);

    // Save to memory so it stays when navigating to a new page
    localStorage.setItem("hop_theme", theme);

    // Swap the Moon/Sun icon dynamically
    if (themeToggle) {
      const themeIcon = themeToggle.querySelector("i");
      if (theme === "dark") {
        if (themeIcon.classList.contains("bi-moon-stars"))
          themeIcon.classList.replace("bi-moon-stars", "bi-sun");
        if (themeIcon.classList.contains("bi-moon-fill"))
          themeIcon.classList.replace("bi-moon-fill", "bi-sun-fill");
        if (themeToggle.classList.contains("btn-light"))
          themeToggle.classList.replace("btn-light", "btn-dark");
      } else {
        if (themeIcon.classList.contains("bi-sun"))
          themeIcon.classList.replace("bi-sun", "bi-moon-stars");
        if (themeIcon.classList.contains("bi-sun-fill"))
          themeIcon.classList.replace("bi-sun-fill", "bi-moon-fill");
        if (themeToggle.classList.contains("btn-dark"))
          themeToggle.classList.replace("btn-dark", "btn-light");
      }
    }

    // If charts exist on this page, update their colors instantly without reloading
    if (
      typeof window.myLineChart !== "undefined" &&
      typeof window.myDoughnutChart !== "undefined"
    ) {
      updateChartsTheme(theme);
    }
  }

  /* ========================================= */
  /* 3. Chart.js Initialization & Live Updates */
  /* ========================================= */
  const lineChartCanvas = document.getElementById("lineChart");
  const doughnutChartCanvas = document.getElementById("doughnutChart");

  // Helper function to grab the correct colors based on the theme
  const getChartColors = (theme) => {
    return theme === "dark"
      ? {
          text: "#cbd5e1",
          grid: "rgba(148, 163, 184, 0.2)",
          line: "#60a5fa",
          doughnut: ["#60a5fa", "#fbbf24", "#10b981"],
        }
      : {
          text: "#9ca3af",
          grid: "#f3f4f6",
          line: "#1f2937",
          // The center color here uses your system's specific Brown/Gold #b59d83
          doughnut: ["#3b82f6", "#b59d83", "#10b981"],
        };
  };

  // Only initialize if the charts actually exist on the current page (e.g., Dashboard)
  if (lineChartCanvas && doughnutChartCanvas) {
    let colors = getChartColors(bodyTag.getAttribute("data-theme"));

    // Attach to 'window' so applyTheme can access them
    window.myLineChart = new Chart(lineChartCanvas.getContext("2d"), {
      type: "line",
      data: {
        labels: [
          "Week 1",
          "Week 2",
          "Week 3",
          "Week 4",
          "Week 5",
          "Week 6",
          "Week 7",
          "Week 8",
        ],
        datasets: [
          {
            data: [120, 132, 145, 138, 155, 163, 158, 178],
            borderColor: colors.line,
            borderWidth: 2.5,
            pointBackgroundColor: colors.line,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.4,
            fill: false,
            clip: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { top: 10, right: 10 },
        },
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: colors.text, font: { size: 10 } },
          },
          y: {
            grid: {
              borderDash: [4, 4],
              color: colors.grid,
            },
            min: 0,
            max: 180,
            ticks: {
              stepSize: 45,
              color: colors.text,
              font: { size: 11 },
            },
          },
        },
      },
    });

    window.myDoughnutChart = new Chart(doughnutChartCanvas.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: ["Worship", "Youth", "Children"],
        datasets: [
          {
            data: [35, 45, 30],
            backgroundColor: colors.doughnut,
            borderWidth: 0,
            borderRadius: 2,
            spacing: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "80%",
        plugins: { legend: { display: false } },
      },
    });
  }

  // Update function that seamlessly injects new colors without reloading the webpage
  window.updateChartsTheme = function (theme) {
    let newColors = getChartColors(theme);

    // Update Line Chart properties
    window.myLineChart.data.datasets[0].borderColor = newColors.line;
    window.myLineChart.data.datasets[0].pointBackgroundColor = newColors.line;
    window.myLineChart.options.scales.x.ticks.color = newColors.text;
    window.myLineChart.options.scales.y.ticks.color = newColors.text;
    window.myLineChart.options.scales.y.grid.color = newColors.grid;
    window.myLineChart.update();

    // Update Doughnut Chart properties
    window.myDoughnutChart.data.datasets[0].backgroundColor =
      newColors.doughnut;
    window.myDoughnutChart.update();
  };
});
