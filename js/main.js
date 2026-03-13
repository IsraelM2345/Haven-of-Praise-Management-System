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
  /* 2. Dark Mode Toggle Logic                 */
  /* ========================================= */
  const themeToggle = document.getElementById("themeToggle");
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    htmlElement.setAttribute("data-theme", "dark");
    if (themeToggle) {
      const themeIcon = themeToggle.querySelector("i");
      if (themeIcon) themeIcon.classList.replace("bi-moon-stars", "bi-sun");
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const themeIcon = themeToggle.querySelector("i");

      if (htmlElement.getAttribute("data-theme") === "dark") {
        htmlElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        if (themeIcon) themeIcon.classList.replace("bi-sun", "bi-moon-stars");
      } else {
        htmlElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        if (themeIcon) themeIcon.classList.replace("bi-moon-stars", "bi-sun");
      }

      // Redraw charts when theme changes
      setTimeout(() => {
        location.reload();
      }, 300);
    });
  }

  /* ========================================= */
  /* 3. Chart.js Initialization                */
  /* ========================================= */

  // Detect dark mode for chart colors
  const isDarkMode = htmlElement.getAttribute("data-theme") === "dark";

  // Line Chart
  const lineChartCanvas = document.getElementById("lineChart");
  if (lineChartCanvas) {
    new Chart(lineChartCanvas.getContext("2d"), {
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
            borderColor: isDarkMode ? "#60a5fa" : "#1f2937",
            borderWidth: 2.5,
            pointBackgroundColor: isDarkMode ? "#60a5fa" : "#1f2937",
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
          padding: {
            top: 10,
            right: 10,
          },
        },
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: isDarkMode ? "#cbd5e1" : "#9ca3af",
              font: { size: 10 },
            },
          },
          y: {
            grid: {
              borderDash: [4, 4],
              color: isDarkMode ? "rgba(148, 163, 184, 0.2)" : "#f3f4f6",
            },
            min: 0,
            max: 180,
            ticks: {
              stepSize: 45,
              color: isDarkMode ? "#cbd5e1" : "#9ca3af",
              font: { size: 11 },
            },
          },
        },
      },
    });
  }

  // Doughnut Chart
  const doughnutChartCanvas = document.getElementById("doughnutChart");
  if (doughnutChartCanvas) {
    new Chart(doughnutChartCanvas.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: ["Worship", "Youth", "Children"],
        datasets: [
          {
            data: [35, 45, 30],
            backgroundColor: isDarkMode
              ? ["#60a5fa", "#fbbf24", "#10b981"]
              : ["#27364f", "#dca541", "#10b981"],
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
});
