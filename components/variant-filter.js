(function () {
  function normalize(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  // ── Embed mode ──────────────────────────────────────────────────────────
  // Activado solo con ?embed=1 explícito. Despoja al componente de su chrome
  // de showcase (stage padding, variant-label, body background, gaps) para que
  // pueda iframeearse limpio en pages/previews/* sin offsets negativos.
  function isEmbedMode() {
    var params = new URLSearchParams(window.location.search);
    return params.get("embed") === "1";
  }

  function injectEmbedModeStyles() {
    if (document.getElementById("subastop-embed-mode-styles")) return;
    var style = document.createElement("style");
    style.id = "subastop-embed-mode-styles";
    style.textContent = [
      "html.is-embed-mode, html.is-embed-mode body {",
      "  margin: 0 !important;",
      "  padding: 0 !important;",
      "  background: transparent !important;",
      "  min-height: 0 !important;",
      "  height: auto !important;",
      "  overflow: visible !important;",
      "}",
      "html.is-embed-mode .preview-stage {",
      "  display: block !important;",
      "  padding: 0 !important;",
      "  margin: 0 !important;",
      "  gap: 0 !important;",
      "  min-height: 0 !important;",
      "  background: transparent !important;",
      "}",
      "html.is-embed-mode .variant-block,",
      "html.is-embed-mode .preview-cell {",
      "  gap: 0 !important;",
      "  margin: 0 !important;",
      "  padding: 0 !important;",
      "}",
      "html.is-embed-mode .variant-label,",
      "html.is-embed-mode .preview-label {",
      "  display: none !important;",
      "}"
    ].join("\n");
    (document.head || document.documentElement).appendChild(style);
  }

  function applyEmbedMode() {
    if (!isEmbedMode()) return;
    document.documentElement.classList.add("is-embed-mode");
    injectEmbedModeStyles();
  }

  // Aplicar embed-mode lo antes posible para minimizar flash.
  applyEmbedMode();

  function getVariantBlocks() {
    return Array.from(document.querySelectorAll(".variant-label, .preview-label"))
      .map(function (label, index) {
        return {
          index: index,
          label: normalize(label.textContent),
          block: label.closest(".variant-block") || label.closest(".preview-cell") || label.parentElement
        };
      })
      .filter(function (item) {
        return item.block;
      });
  }

  function getRequestedVariants(params) {
    var values = [];

    params.getAll("variantIndex").forEach(function (value) {
      values.push(value);
    });

    var indicesParam = params.get("variantIndices");
    if (indicesParam) {
      indicesParam.split(",").forEach(function (value) {
        values.push(value);
      });
    }

    var indices = values
      .map(function (value) {
        return Number(value);
      })
      .filter(function (value, index, list) {
        return Number.isInteger(value) && list.indexOf(value) === index;
      });

    var labels = [];
    var variantParam = params.get("variant");
    var variantsParam = params.get("variants");

    if (variantParam) labels.push(variantParam);

    if (variantsParam) {
      try {
        labels = labels.concat(JSON.parse(variantsParam));
      } catch (error) {
        labels = labels.concat(variantsParam.split("|"));
      }
    }

    return {
      indices: indices,
      labels: labels.map(normalize).filter(Boolean)
    };
  }

  function injectFilteredLayoutStyles() {
    if (document.getElementById("subastop-variant-filter-styles")) return;

    var style = document.createElement("style");
    style.id = "subastop-variant-filter-styles";
    style.textContent = [
      "html.is-variant-filtered,",
      "html.is-variant-filtered body {",
      "  min-height: auto !important;",
      "  overflow: hidden !important;",
      "}",
      "html.is-variant-filtered .preview-stage {",
      "  min-height: auto !important;",
      "}",
      "html.is-variant-filtered .variants-col,",
      "html.is-variant-filtered .variants-row,",
      "html.is-variant-filtered .preview-grid {",
      "  align-items: center !important;",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function postHeight() {
    if (!window.parent || window.parent === window) return;

    var visibleBlocks = getVariantBlocks()
      .map(function (item) {
        return item.block;
      })
      .filter(function (block, index, blocks) {
        return block && !block.hidden && blocks.indexOf(block) === index;
      });

    var height = 0;

    if (visibleBlocks.length > 0) {
      height = visibleBlocks.reduce(function (max, block) {
        var rect = block.getBoundingClientRect();
        return Math.max(max, rect.bottom + window.scrollY + 56);
      }, 0);
    } else {
      var body = document.body;
      var html = document.documentElement;
      height = Math.max(
        body ? body.scrollHeight : 0,
        body ? body.offsetHeight : 0,
        html ? html.scrollHeight : 0,
        html ? html.offsetHeight : 0
      );
    }

    window.parent.postMessage({
      type: "subastop:variant-height",
      height: Math.ceil(height),
      path: window.location.pathname
    }, "*");
  }

  function applyVariantFilter() {
    var params = new URLSearchParams(window.location.search);
    var requested = getRequestedVariants(params);
    var blocks = getVariantBlocks();

    if (blocks.length === 0) {
      postHeight();
      return;
    }

    var selectedBlocks = blocks.filter(function (item) {
      return requested.indices.indexOf(item.index) !== -1 || requested.labels.indexOf(item.label) !== -1;
    });
    var shouldFilter = (requested.indices.length > 0 || requested.labels.length > 0) && selectedBlocks.length > 0;
    var selectedBlockSet = new Set(selectedBlocks.map(function (item) {
      return item.block;
    }));

    if (shouldFilter) {
      injectFilteredLayoutStyles();
      blocks.forEach(function (item) {
        if (!selectedBlockSet.has(item.block)) {
          item.block.remove();
        }
      });
    }

    document.documentElement.classList.toggle("is-variant-filtered", shouldFilter);
    window.requestAnimationFrame(postHeight);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyVariantFilter);
  } else {
    applyVariantFilter();
  }

  window.addEventListener("load", postHeight);

  if ("ResizeObserver" in window) {
    var observer = new ResizeObserver(postHeight);
    if (document.body) observer.observe(document.body);
  }
})();
