/**
 * Verix Protocol — Next-Gen Blockchain & E-Commerce Dashboard Charts Engine
 * Renders Chart.js graphs for Page 4 (Blockchain & Portfolio Analytics Dashboard)
 */

window.DashboardCharts = (function() {
  'use strict';

  var categoryChart, monthlyChart, liveTpsChart;
  var isInitialized = false;

  function initCategoryPieChart() {
    var ctx = document.getElementById('categoryPieChart');
    if (!ctx) return;

    if (categoryChart) categoryChart.destroy();

    categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Watches & Jewelry', 'Haute Couture & Leather', 'Perfumes & Spirits', 'Cosmetics & Bio-Lab', 'Kids & Heritage'],
        datasets: [{
          data: [35, 28, 18, 12, 7],
          backgroundColor: [
            '#0F766E', // Deep Teal
            '#10B981', // Emerald
            '#D4AF37', // Gold
            '#6366F1', // Indigo
            '#F59E0B'  // Amber
          ],
          borderColor: '#FFFFFF',
          borderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#334155',
              font: { family: 'Outfit', size: 12, weight: '600' },
              padding: 12,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ' ' + context.label + ': ' + context.raw + '% Share';
              }
            }
          }
        },
        cutout: '68%'
      }
    });
  }

  function initMonthlyBarChart() {
    var ctx = document.getElementById('monthlyBarChart');
    if (!ctx) return;

    if (monthlyChart) monthlyChart.destroy();

    monthlyChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Authentications Verified',
          data: [12400, 14200, 16800, 19500, 22100, 25800, 29400],
          backgroundColor: 'rgba(15, 118, 110, 0.85)',
          borderColor: '#0F766E',
          borderWidth: 1,
          borderRadius: 8,
          hoverBackgroundColor: '#10B981'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: { color: '#64748B', font: { family: 'Inter', size: 11 } },
            grid: { color: 'rgba(15, 23, 42, 0.04)' }
          },
          y: {
            ticks: { color: '#64748B', font: { family: 'Inter', size: 11 } },
            grid: { color: 'rgba(15, 23, 42, 0.04)' }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  function initLiveTpsLineChart() {
    var ctx = document.getElementById('liveTpsLineChart');
    if (!ctx) return;

    if (liveTpsChart) liveTpsChart.destroy();

    var initialData = [3800, 3950, 4100, 4050, 4200, 4150, 4250];
    var initialLabels = ['12s ago', '10s ago', '8s ago', '6s ago', '4s ago', '2s ago', 'Now'];

    liveTpsChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: initialLabels,
        datasets: [{
          label: 'Network TPS',
          data: initialData,
          borderColor: '#0F766E',
          backgroundColor: 'rgba(15, 118, 110, 0.08)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#10B981',
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: { color: '#64748B', font: { family: 'Inter', size: 11 } },
            grid: { color: 'rgba(15, 23, 42, 0.04)' }
          },
          y: {
            ticks: { color: '#64748B', font: { family: 'Inter', size: 11 } },
            grid: { color: 'rgba(15, 23, 42, 0.04)' }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });

    // Real-time graph updater
    if (window._tpsTimer) clearInterval(window._tpsTimer);
    window._tpsTimer = setInterval(function() {
      if (!liveTpsChart || !document.getElementById('liveTpsLineChart')) return;
      var nextVal = Math.floor(4100 + Math.random() * 350);
      liveTpsChart.data.datasets[0].data.shift();
      liveTpsChart.data.datasets[0].data.push(nextVal);
      liveTpsChart.update('none');

      var tpsBadge = document.getElementById('liveTpsValDisplay');
      if (tpsBadge) tpsBadge.textContent = nextVal.toLocaleString() + ' TPS';
    }, 2500);
  }

  function initAllCharts() {
    if (typeof Chart === 'undefined') return;
    setTimeout(function() {
      initCategoryPieChart();
      initMonthlyBarChart();
      initLiveTpsLineChart();
      isInitialized = true;
    }, 150);
  }

  return {
    initAllCharts: initAllCharts
  };
})();

document.addEventListener('DOMContentLoaded', function() {
  if (typeof Chart !== 'undefined') {
    DashboardCharts.initAllCharts();
  }
});
