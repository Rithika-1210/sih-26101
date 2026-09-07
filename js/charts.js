/**
 * StatLearn AI — Chart.js Visualizations
 */

window.Charts = (function() {

  Chart.defaults.color = '#94a3b8';
  Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
  Chart.defaults.borderColor = 'rgba(255,255,255,0.07)';

  // ---- Competency Radar Chart ----
  function createRadarChart(canvasId, scores = {}, role = 'Statistical Officer') {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (ctx._chart) ctx._chart.destroy();

    const labels = ['Statistical', 'Technical', 'Digital Gov', 'Behavioural'];
    const keys = ['statistical', 'technical', 'digital_gov', 'behavioural'];
    const currentData = keys.map(k => (scores[k] || 0) * 20);
    const required = CompetencyEngine.REQUIRED_LEVELS[role] || CompetencyEngine.REQUIRED_LEVELS.default;
    const requiredData = keys.map(k => (required[k] || 3) * 20);

    const chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: [
          {
            label: 'Your Level',
            data: currentData,
            backgroundColor: 'rgba(59,130,246,0.15)',
            borderColor: '#3b82f6',
            borderWidth: 2.5,
            pointBackgroundColor: '#3b82f6',
            pointRadius: 5,
            pointHoverRadius: 7,
          },
          {
            label: 'Required Level',
            data: requiredData,
            backgroundColor: 'rgba(255,153,51,0.08)',
            borderColor: 'rgba(255,153,51,0.7)',
            borderWidth: 2,
            borderDash: [5,4],
            pointBackgroundColor: '#FF9933',
            pointRadius: 4,
            pointHoverRadius: 6,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            min: 0, max: 100,
            ticks: { stepSize: 20, color: '#64748b', font: { size: 11 } },
            grid: { color: 'rgba(255,255,255,0.06)' },
            angleLines: { color: 'rgba(255,255,255,0.06)' },
            pointLabels: { color: '#94a3b8', font: { size: 12, weight: '600' } }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { usePointStyle: true, padding: 16, font: { size: 12 } }
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.r}%`
            }
          }
        }
      }
    });
    ctx._chart = chart;
    return chart;
  }

  // ---- Skill Gap Bar Chart ----
  function createGapBarChart(canvasId, gaps) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (ctx._chart) ctx._chart.destroy();

    const labels = Object.values(gaps).map(g => g.label.replace(' Competencies','').replace(' & Managerial',''));
    const current = Object.values(gaps).map(g => Math.round(g.pct_current));
    const gapVals = Object.values(gaps).map(g => Math.round(g.pct_required - g.pct_current));

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Current Level',
            data: current,
            backgroundColor: 'rgba(59,130,246,0.7)',
            borderRadius: 4, borderSkipped: false,
          },
          {
            label: 'Gap to Fill',
            data: gapVals.map(g => Math.max(0, g)),
            backgroundColor: 'rgba(255,153,51,0.5)',
            borderRadius: 4, borderSkipped: false,
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true, min: 0, max: 100,
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#64748b', callback: v => v + '%' }
          },
          y: {
            stacked: true,
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { size: 12 } }
          }
        },
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16 } },
          tooltip: {
            callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.x}%` }
          }
        }
      }
    });
    ctx._chart = chart;
    return chart;
  }

  // ---- Progress Line Chart ----
  function createProgressLine(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (ctx._chart) ctx._chart.destroy();

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const values = data || [32, 38, 42, 45, 52, 58, 63, 70, 75];

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Competency Score',
          data: values,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.1)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointRadius: 4,
          pointHoverRadius: 6,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
          y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', callback: v => v+'%' } }
        },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y}% competency` } }
        }
      }
    });
    ctx._chart = chart;
    return chart;
  }

  // ---- Domain Doughnut ----
  function createDomainDoughnut(canvasId, scores) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (ctx._chart) ctx._chart.destroy();

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Statistical', 'Technical', 'Digital Gov', 'Behavioural'],
        datasets: [{
          data: [
            Math.round((scores.statistical || 0) * 20),
            Math.round((scores.technical || 0) * 20),
            Math.round((scores.digital_gov || 0) * 20),
            Math.round((scores.behavioural || 0) * 20),
          ],
          backgroundColor: [
            'rgba(59,130,246,0.8)',
            'rgba(139,92,246,0.8)',
            'rgba(20,184,166,0.8)',
            'rgba(255,153,51,0.8)',
          ],
          borderWidth: 0,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        cutout: '68%',
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, padding: 14, font: { size: 11 } } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` } }
        }
      }
    });
    ctx._chart = chart;
    return chart;
  }

  // ---- Admin: Org Competency Heatmap (bar chart simulation) ----
  function createOrgHeatmap(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (ctx._chart) ctx._chart.destroy();

    const depts = ['NSO', 'DIID', 'ESD', 'SD', 'ISD', 'NSSTA'];
    const domains = ['Statistical', 'Technical', 'Digital Gov', 'Behavioural'];
    const colors = ['rgba(59,130,246,0.75)', 'rgba(139,92,246,0.75)', 'rgba(20,184,166,0.75)', 'rgba(255,153,51,0.75)'];

    const datasets = domains.map((d, i) => ({
      label: d,
      data: depts.map(() => Math.round(40 + Math.random() * 45)),
      backgroundColor: colors[i],
      borderRadius: 3,
    }));

    const chart = new Chart(ctx, {
      type: 'bar',
      data: { labels: depts, datasets },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
          y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#64748b', callback: v => v+'%' } }
        },
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, padding: 14 } },
        }
      }
    });
    ctx._chart = chart;
    return chart;
  }

  // ---- Admin: Training Effectiveness ----
  function createEffectivenessChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (ctx._chart) ctx._chart.destroy();

    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Courses Enrolled',
            data: [120, 185, 210, 265, 340, 412],
            borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.08)',
            fill: true, tension: 0.4, borderWidth: 2.5,
            pointBackgroundColor: '#3b82f6', pointRadius: 4,
          },
          {
            label: 'Courses Completed',
            data: [80, 140, 175, 220, 280, 358],
            borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)',
            fill: true, tension: 0.4, borderWidth: 2.5,
            pointBackgroundColor: '#10b981', pointRadius: 4,
          },
          {
            label: 'Assessments Passed',
            data: [60, 110, 140, 190, 245, 310],
            borderColor: '#FF9933', backgroundColor: 'rgba(255,153,51,0.05)',
            fill: false, tension: 0.4, borderWidth: 2,
            borderDash: [5,4],
            pointBackgroundColor: '#FF9933', pointRadius: 3,
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } }
        },
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, padding: 14 } }
        }
      }
    });
    ctx._chart = chart;
    return chart;
  }

  // ---- Admin: Skill Distribution ----
  function createSkillDistribution(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (ctx._chart) ctx._chart.destroy();

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Expert (80-100%)', 'Advanced (60-79%)', 'Intermediate (40-59%)', 'Beginner (<40%)'],
        datasets: [{
          data: [12, 28, 38, 22],
          backgroundColor: ['rgba(16,185,129,0.8)','rgba(59,130,246,0.8)','rgba(255,153,51,0.8)','rgba(239,68,68,0.7)'],
          borderWidth: 0,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12, font: { size: 11 } } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}% of officials` } }
        }
      }
    });
    ctx._chart = chart;
    return chart;
  }

  // ---- Predictive Skill Demand ----
  function createPredictiveChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (ctx._chart) ctx._chart.destroy();

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['AI/ML', 'Big Data', 'Cloud', 'GIS', 'Python/R', 'Data Privacy', 'SDG Reporting', 'APIs'],
        datasets: [{
          label: 'Predicted Demand (next 12 months)',
          data: [92, 85, 78, 65, 88, 72, 80, 60],
          backgroundColor: [
            'rgba(59,130,246,0.8)','rgba(139,92,246,0.8)','rgba(20,184,166,0.8)',
            'rgba(255,153,51,0.8)','rgba(59,130,246,0.7)','rgba(16,185,129,0.8)',
            'rgba(245,158,11,0.8)','rgba(236,72,153,0.7)'
          ],
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } },
          y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#64748b', callback: v => v+'%' } }
        },
        plugins: { legend: { display: false } }
      }
    });
    ctx._chart = chart;
    return chart;
  }

  return {
    createRadarChart, createGapBarChart, createProgressLine,
    createDomainDoughnut, createOrgHeatmap, createEffectivenessChart,
    createSkillDistribution, createPredictiveChart
  };
})();
