/* Technology overview page — renderer.
 *
 * Reads `window.TECH_SLUG` and the JSON at /DDM26-03/assets/data/tech-data.json
 * and wires up the page: hero, analysis card, accordions (collapsed by default),
 * and the "Explore more" heatmatrix. Uses Chart.js (loaded via CDN) for the
 * radar, scatter, line and bubble charts. No external libs beyond Chart.js.
 */
(function () {
  "use strict";

  const BASE = "/DDM26-03";
  const DATA_URL = BASE + "/assets/data/tech-data.json";

  const COLOR = {
    text: "#e8ecf5",
    textDim: "#b8c0d4",
    textFaint: "#8a93ac",
    orange: "#ff8a1f",
    orange2: "#ff6a00",
    panel: "#182442",
    grid: "rgba(255,255,255,0.08)",
    native: "#ff8a1f",
    unicorn: "#6fa0ff",
    emerging: "#41d28a",
    climber: "#41d28a",
    challenger: "#ffd85c",
    drop: "#ff6a6a",
    neutral: "#8a93ac",
  };

  let DATA = null;
  let CFG = null;
  let CURRENT_INDUSTRY = null;

  const radarChartRef = { chart: null };
  const scatterChartRef = { chart: null };
  const evolutionChartRef = { chart: null };
  const bubbleChartRef = { chart: null };
  let evolutionMode = "patents";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function fmtUsd(n) {
    if (n == null) return "";
    if (n >= 1e9) return "$" + (n / 1e9).toFixed(1) + "B";
    if (n >= 1e6) return "$" + (n / 1e6).toFixed(0) + "M";
    if (n >= 1e3) return "$" + (n / 1e3).toFixed(0) + "K";
    return "$" + n.toFixed(0);
  }

  function getSlug() {
    if (window.TECH_SLUG) return window.TECH_SLUG;
    const m = location.pathname.match(/\/technology\/([^\/]+)/);
    return m ? m[1] : null;
  }

  async function init() {
    const slug = getSlug();
    if (!slug) return;
    try {
      const res = await fetch(DATA_URL, { cache: "no-cache" });
      DATA = await res.json();
    } catch (e) {
      console.error("Failed to load tech-data.json", e);
      return;
    }
    CFG = DATA.techs[slug];
    if (!CFG) { console.error("Unknown tech slug", slug); return; }
    CURRENT_INDUSTRY = DATA.industryOrder[0];

    renderHero();
    renderIndustryTabs();
    renderAnalysisCard();
    renderAccordions();
    renderHeatmatrix();
    wireBottomActions();
  }

  /* ---------- hero ---------- */
  function renderHero() {
    const title = $("#tech-title");
    if (title) title.textContent = CFG.pageTitle;
    const def = $("#tech-definition");
    if (def) def.textContent = CFG.definitionText;
    document.title = CFG.pageTitle + " | DDM 2026";
  }

  /* ---------- industry tabs ---------- */
  function renderIndustryTabs() {
    const tabs = $("#industry-tabs");
    tabs.innerHTML = "";
    DATA.industryOrder.forEach((ind) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = ind;
      b.setAttribute("role", "tab");
      if (ind === CURRENT_INDUSTRY) {
        b.classList.add("active");
        b.setAttribute("aria-selected", "true");
      }
      b.addEventListener("click", () => {
        CURRENT_INDUSTRY = ind;
        tabs.querySelectorAll("button").forEach((x) => {
          x.classList.remove("active");
          x.setAttribute("aria-selected", "false");
        });
        b.classList.add("active");
        b.setAttribute("aria-selected", "true");
        renderAnalysisCard();
      });
      tabs.appendChild(b);
    });
  }

  /* ---------- analysis card ---------- */
  function currentHeatScore() {
    const row = DATA.heatmatrix.rows.find((r) => r.sector === CURRENT_INDUSTRY);
    if (!row) return null;
    return row[CFG.heatmatrixColumn];
  }
  function currentRadarValues() {
    const alias = DATA.radarIndustryAlias[CURRENT_INDUSTRY];
    const byTech = DATA.radar[alias];
    if (!byTech) return [0, 0, 0, 0, 0];
    const vals = byTech[CFG.radarTech] || [0, 0, 0, 0, 0];
    return vals.map((v) => Math.max(0, v));
  }

  function renderAnalysisCard() {
    const score = currentHeatScore();
    $("#industry-name").textContent = CURRENT_INDUSTRY;
    $("#overall-score").textContent = score == null ? "—" : score.toFixed(1);

    const vals = currentRadarValues();
    renderRadar(vals);
    renderMiniMetrics(vals);
  }

  function renderRadar(vals) {
    const ctx = $("#radar-chart").getContext("2d");
    const data = {
      labels: DATA.radarAxes,
      datasets: [{
        label: CFG.pageTitle,
        data: vals,
        backgroundColor: "rgba(255, 138, 31, 0.22)",
        borderColor: COLOR.orange,
        borderWidth: 2,
        pointBackgroundColor: COLOR.orange,
        pointBorderColor: COLOR.orange,
        pointRadius: 3.5,
      }],
    };
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#0b1020",
          borderColor: COLOR.grid,
          borderWidth: 1,
        },
      },
      scales: {
        r: {
          min: 0,
          max: 10,
          angleLines: { color: COLOR.grid },
          grid: { color: COLOR.grid },
          pointLabels: {
            color: COLOR.textDim,
            font: { size: 11, weight: "600" },
          },
          ticks: {
            color: COLOR.textFaint,
            backdropColor: "transparent",
            stepSize: 2,
            showLabelBackdrop: false,
            font: { size: 9 },
          },
        },
      },
    };
    if (radarChartRef.chart) {
      radarChartRef.chart.data = data;
      radarChartRef.chart.update();
    } else {
      radarChartRef.chart = new Chart(ctx, { type: "radar", data, options });
    }
  }

  function renderMiniMetrics(vals) {
    const root = $("#mini-metrics");
    root.innerHTML = "";
    DATA.radarAxes.forEach((label, i) => {
      const v = vals[i];
      const row = document.createElement("div");
      row.className = "mini-row";
      row.innerHTML =
        '<div class="label">' + label + '</div>' +
        '<div class="bar"><span style="width:' + Math.min(100, v * 10) + '%"></span></div>' +
        '<div class="val">' + (v || 0).toFixed(1) + '</div>';
      root.appendChild(row);
    });
  }

  /* ---------- accordions ---------- */
  function renderAccordions() {
    // Wire toggle behavior
    document.querySelectorAll("[data-accordion]").forEach((acc) => {
      const header = acc.querySelector(".accordion-header");
      header.addEventListener("click", () => toggleAccordion(acc));
      header.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleAccordion(acc); }
      });
    });

    renderPerception();
    // Market validation and research render lazily on first open for perf,
    // but since data is loaded we render them now; charts use ResizeObserver.
    renderMarketValidation();
    renderResearchInnovation();
  }
  function toggleAccordion(acc) {
    const open = acc.getAttribute("data-open") === "true";
    acc.setAttribute("data-open", open ? "false" : "true");
    acc.querySelector(".accordion-header").setAttribute("aria-expanded", (!open).toString());
    // When opening, resize chart if present
    if (!open) {
      setTimeout(() => {
        [scatterChartRef, evolutionChartRef, bubbleChartRef].forEach((ref) => {
          if (ref.chart) ref.chart.resize();
        });
      }, 60);
    }
  }

  /* --- professionals' perception --- */
  function renderPerception() {
    // Ranking
    const list = $("#ranking-list");
    list.innerHTML = "";
    DATA.survey.ranking.forEach((r, i) => {
      const li = document.createElement("li");
      const isCurrent = r.tech === CFG.surveyRankHeader;
      if (isCurrent) li.className = "current";
      li.innerHTML =
        '<span class="rank">#' + (i + 1) + '</span>' +
        '<span class="name">' + r.tech + '</span>' +
        '<span class="mean">' + r.mean.toFixed(2) + '</span>';
      list.appendChild(li);
    });

    // Impact distribution for current tech (use Q7 impact header label)
    const dist = DATA.survey.impactDistribution[CFG.surveyImpactHeader];
    const buckets = DATA.survey.impactBuckets;
    const total = buckets.reduce((s, b) => s + (dist[b] || 0), 0);
    const distRoot = $("#distribution-bars");
    distRoot.innerHTML = "";
    buckets.forEach((b) => {
      const count = dist[b] || 0;
      const pct = total ? (count / total) * 100 : 0;
      const row = document.createElement("div");
      row.className = "dist-row";
      row.innerHTML =
        '<div class="label">' + b + '</div>' +
        '<div class="bar"><span style="width:' + pct.toFixed(1) + '%"></span></div>' +
        '<div class="val">' + pct.toFixed(0) + '% (' + count + ')</div>';
      distRoot.appendChild(row);
    });

    // Top 6 use cases across all industries for current tech chunk.
    const chunk = CFG.useCaseChunkIndex; // 0..4
    const results = [];
    DATA.survey.useCases.forEach((block) => {
      for (let i = chunk * 3; i < chunk * 3 + 3; i++) {
        results.push({
          industry: block.industry,
          label: block.labels[i],
          count: block.counts[i] || 0,
        });
      }
    });
    results.sort((a, b) => b.count - a.count);
    const top = results.slice(0, 6);
    const ucRoot = $("#use-case-list");
    ucRoot.innerHTML = "";
    top.forEach((u, i) => {
      const li = document.createElement("li");
      li.innerHTML =
        '<span class="num">#' + (i + 1) + '</span>' +
        '<div><div class="name">' + (u.label || "—") + '</div><div class="industry">' + u.industry + '</div></div>' +
        '<span class="votes">' + u.count + '</span>';
      ucRoot.appendChild(li);
    });
  }

  /* --- market validation / scatter --- */
  function renderMarketValidation() {
    const techKey = CFG.unicornTech;
    const companies = DATA.companies[techKey] || [];
    const points = {
      Native: [],
      Unicorn: [],
      Emerging: [],
    };
    companies.forEach((c) => {
      if (!c.founded || !c.funding) return;
      const d = new Date(c.founded);
      if (isNaN(d.getTime())) return;
      points[c.category].push({
        x: d.getTime(),
        y: c.funding,
        label: c.name,
        desc: c.description || c.fullDescription || "",
        category: c.category,
        founded: c.founded,
      });
    });
    const ctx = $("#scatter-chart").getContext("2d");
    const datasets = [
      { label: "Native", data: points.Native, backgroundColor: COLOR.native },
      { label: "Unicorn", data: points.Unicorn, backgroundColor: COLOR.unicorn },
      { label: "Emerging", data: points.Emerging, backgroundColor: COLOR.emerging },
    ].map((d) => ({
      label: d.label,
      data: d.data,
      backgroundColor: d.backgroundColor + "cc",
      borderColor: d.backgroundColor,
      pointRadius: 5,
      pointHoverRadius: 7,
    }));

    if (scatterChartRef.chart) scatterChartRef.chart.destroy();
    scatterChartRef.chart = new Chart(ctx, {
      type: "scatter",
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: COLOR.textDim } },
          tooltip: {
            backgroundColor: "#0b1020",
            titleColor: COLOR.text,
            bodyColor: COLOR.textDim,
            borderColor: COLOR.grid,
            borderWidth: 1,
            callbacks: {
              title: (items) => items[0].raw.label,
              label: (it) => {
                const p = it.raw;
                return [
                  p.category,
                  "Founded: " + p.founded,
                  "Funding: " + fmtUsd(p.y),
                  p.desc ? p.desc.slice(0, 140) + (p.desc.length > 140 ? "…" : "") : "",
                ].filter(Boolean);
              },
            },
          },
        },
        scales: {
          x: {
            type: "linear",
            title: { display: true, text: "Founded date", color: COLOR.textDim },
            ticks: {
              color: COLOR.textFaint,
              callback: (v) => new Date(v).getFullYear(),
              maxTicksLimit: 12,
            },
            grid: { color: COLOR.grid },
          },
          y: {
            type: "logarithmic",
            title: { display: true, text: "Total funding (USD, log scale)", color: COLOR.textDim },
            ticks: {
              color: COLOR.textFaint,
              callback: (v) => {
                if (v === 1e6) return "$1M";
                if (v === 1e7) return "$10M";
                if (v === 1e8) return "$100M";
                if (v === 1e9) return "$1B";
                if (v === 1e10) return "$10B";
                return "";
              },
            },
            grid: { color: COLOR.grid },
          },
        },
      },
    });
  }

  /* --- research & innovation --- */
  function renderResearchInnovation() {
    renderEvolutionChart();
    // Research tab wiring
    document.querySelectorAll(".research-tabs button").forEach((b) => {
      b.addEventListener("click", () => {
        document.querySelectorAll(".research-tabs button").forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        evolutionMode = b.dataset.mode;
        renderEvolutionChart();
      });
    });

    renderTrendIndicators();
    renderBubbleChart();
    renderApplicantNote();
  }

  function renderEvolutionChart() {
    const src = evolutionMode === "scholar" ? DATA.scholar : DATA.patents;
    const years = src.years;
    const palette = ["#ff8a1f", "#6fa0ff", "#41d28a", "#ffd85c", "#c879ff"];
    const datasets = Object.keys(src.series).map((tech, i) => ({
      label: tech,
      data: src.series[tech],
      borderColor: palette[i % palette.length],
      backgroundColor: palette[i % palette.length],
      tension: 0.25,
      borderWidth: 2.25,
      pointRadius: 2.5,
    }));
    const ctx = $("#evolution-chart").getContext("2d");
    if (evolutionChartRef.chart) evolutionChartRef.chart.destroy();
    evolutionChartRef.chart = new Chart(ctx, {
      type: "line",
      data: { labels: years, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: COLOR.textDim, font: { size: 11 } } },
          tooltip: { mode: "index", intersect: false },
        },
        scales: {
          x: { ticks: { color: COLOR.textFaint }, grid: { color: COLOR.grid } },
          y: {
            ticks: { color: COLOR.textFaint, callback: (v) => v.toLocaleString() },
            grid: { color: COLOR.grid },
          },
        },
      },
    });
  }

  function pct(a, b) { return ((b - a) / a) * 100; }

  function renderTrendIndicators() {
    const techKey = CFG.patentScholarTech;
    const pS = DATA.patents.series[techKey];
    const sS = DATA.scholar.series[techKey];
    const pP = pS ? pct(pS[pS.length - 2], pS[pS.length - 1]) : null;
    const sP = sS ? pct(sS[sS.length - 2], sS[sS.length - 1]) : null;
    setTrend($("#trend-patents"), "Patents 2024 → 2025", pP);
    setTrend($("#trend-scholar"), "Scholar 2024 → 2025", sP);
  }
  function setTrend(el, label, pct) {
    if (pct == null) { el.innerHTML = ""; return; }
    const up = pct >= 0;
    el.classList.toggle("up", up);
    el.classList.toggle("down", !up);
    el.innerHTML =
      '<div><div class="k">' + label + '</div></div>' +
      '<div class="v">' + (up ? "↑" : "↓") + " " + Math.abs(pct).toFixed(1) + "%</div>";
  }

  function statusColor(tag) {
    if (tag === "New Challenger") return COLOR.challenger;
    if (tag === "Significant Climber") return COLOR.climber;
    if (tag === "Significant Drop") return COLOR.drop;
    return COLOR.neutral;
  }

  function renderBubbleChart() {
    const techKey = CFG.topApplicantsTech;
    const rows = DATA.topApplicants.byTech[techKey] || [];
    if (!rows.length) return;

    // Lay out bubbles along a grid (x / y are arbitrary but evenly spread).
    const cols = 5;
    const rowsCount = Math.ceil(rows.length / cols);
    const sorted = rows.slice().sort((a, b) => b.count - a.count);

    const maxCount = sorted[0].count;
    const points = sorted.map((r, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      return {
        x: col + 0.5,
        y: rowsCount - row,
        r: Math.max(10, Math.sqrt(r.count / maxCount) * 46),
        name: r.name,
        count: r.count,
        tag: r.tag,
        color: statusColor(r.tag),
      };
    });

    const ctx = $("#bubble-chart").getContext("2d");
    if (bubbleChartRef.chart) bubbleChartRef.chart.destroy();

    // Custom plugin to draw full applicant names inside/outside each bubble.
    const labelPlugin = {
      id: "applicantLabels",
      afterDatasetsDraw(chart) {
        const { ctx, chartArea, scales } = chart;
        const ds = chart.data.datasets[0];
        ctx.save();
        ctx.font = "600 11px system-ui, -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ds.data.forEach((p) => {
          const xPix = scales.x.getPixelForValue(p.x);
          const yPix = scales.y.getPixelForValue(p.y);
          const full = p.name;
          const r = p.r;
          const short = full.length > 22 ? full.slice(0, 20) + "…" : full;
          // Measure: if width larger than bubble, draw below.
          const w = ctx.measureText(short).width;
          if (w < 2 * r - 10) {
            ctx.fillStyle = "#ffffff";
            ctx.fillText(short, xPix, yPix);
          } else {
            // Draw short name outside
            ctx.fillStyle = COLOR.textDim;
            ctx.fillText(short, xPix, yPix + r + 10);
          }
          // status dot
          if (p.tag) {
            ctx.beginPath();
            ctx.arc(xPix + r * 0.75, yPix - r * 0.75, 4, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            ctx.strokeStyle = "rgba(0,0,0,0.4)";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
        ctx.restore();
      },
    };

    bubbleChartRef.chart = new Chart(ctx, {
      type: "bubble",
      data: {
        datasets: [{
          label: "Top applicants 2025",
          data: points,
          backgroundColor: "rgba(111, 160, 255, 0.4)",
          borderColor: "rgba(111, 160, 255, 0.85)",
          borderWidth: 1.5,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0b1020",
            titleColor: COLOR.text,
            bodyColor: COLOR.textDim,
            callbacks: {
              title: (items) => items[0].raw.name,
              label: (it) => {
                const p = it.raw;
                return [
                  "Documents: " + p.count.toLocaleString(),
                  p.tag ? "Status: " + p.tag : "",
                ].filter(Boolean);
              },
            },
          },
        },
        scales: {
          x: { min: 0, max: cols, display: false, grid: { display: false } },
          y: { min: 0, max: rowsCount + 1, display: false, grid: { display: false } },
        },
      },
      plugins: [labelPlugin],
    });
  }

  function renderApplicantNote() {
    const techKey = CFG.topApplicantsTech;
    const note = DATA.topApplicants.notes[techKey];
    const el = $("#applicant-note");
    if (note) { el.textContent = note; el.style.display = "block"; }
    else { el.style.display = "none"; }
  }

  /* ---------- explore more / heatmatrix ---------- */
  function renderHeatmatrix() {
    const title = $("#explore-title");
    if (title) title.textContent = "Explore more on " + CFG.pageTitle;

    const table = $("#heatmatrix-table");
    const cols = DATA.heatmatrix.columns;
    const rows = DATA.heatmatrix.rows;
    const currentCol = CFG.heatmatrixColumn;

    // build header
    let html = "<thead><tr><th class='sector-head'>&nbsp;</th>";
    cols.forEach((c) => {
      html += '<th class="' + (c === currentCol ? "current" : "") + '">' + c + "</th>";
    });
    html += "</tr></thead><tbody>";

    // Heat color scale: 0-100 → dark → orange
    function heat(v) {
      if (v == null) return "#1a2238";
      const t = Math.max(0, Math.min(100, v)) / 100;
      // Interpolate from #1a2238 (low) to #ff8a1f (high)
      const lo = [26, 34, 56];
      const hi = [255, 138, 31];
      const c = lo.map((l, i) => Math.round(l + (hi[i] - l) * t));
      return "rgb(" + c.join(",") + ")";
    }

    // Use display order from industryOrder; sectors in heatmatrix have matching
    // display labels already.
    rows.forEach((row) => {
      html += '<tr><td class="sector">' + row.sector + "</td>";
      cols.forEach((c) => {
        const v = row[c];
        const bg = heat(v);
        // text color: readable on all tiles
        const t = v == null ? 0 : v / 100;
        const textColor = t > 0.55 ? "#1a0f00" : "#f1e6d8";
        const klass = "cell" + (c === currentCol ? " current" : "");
        html +=
          '<td class="' + klass + '" style="background:' + bg + ";color:" + textColor + '">' +
          (v == null ? "—" : v.toFixed(1)) +
          "</td>";
      });
      html += "</tr>";
    });
    html += "</tbody>";
    table.innerHTML = html;
  }

  function wireBottomActions() {
    const shareBtns = document.querySelectorAll("[data-action='share']");
    shareBtns.forEach((b) => b.addEventListener("click", () => {
      const url = location.href;
      if (navigator.share) {
        navigator.share({ title: document.title, url }).catch(() => {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        b.textContent = "Link copied";
        setTimeout(() => { b.textContent = "Share"; }, 2000);
      }
    }));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
