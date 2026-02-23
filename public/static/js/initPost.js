
// console.log("postInit.js loaded");
var scriptMd5 = document.createElement("script");
scriptMd5.src = "/static/js/md5.js";
document.head.appendChild(scriptMd5);

scriptMd5.onload = function () {
  // console.log("md5.js loaded")
  // step1. mermaid 流程图渲染（需在代码高亮前处理，避免 mermaid 块被当作代码高亮）
  initMermaid();
  // step2. syntax highlighting
  syntaxHighlight();
  // step3. lazyload
  initLazyLoad();
}

function initLazyLoad() {
  var script = document.createElement("script");
  script.src = "/static/js/animation.js";
  document.head.appendChild(script);

  script.onload = function () {
    // console.log("lazyload.js loaded");

    animationElementName = ".image-load";

    // Hook the loadImage function
    loadImage = (index) => {
      if (index >= imageElements.length) return;

      let image = imageElements[index];
      image.src = image.dataset.src;
      let img = new Image();
      img.src = image.src;

      // if the image is loaded or not loaded, load the next image
      img.onload = function () {
        loadImage(index + 1);
      };
      img.onerror = function () {
        loadImage(index + 1);
      }
    }

    loadAnimation = (item) => {
      if (item.classList.contains("image-loaded")) return;
      let grandSon = item.firstChild.firstChild;
      let img = new Image();
      img.src = grandSon.src;

      let sign = md5(grandSon.src);

      let target = document.getElementById(`lht${sign}`)
      if (!target) {
        // If an absolute path is used as the image link, such as "/static/img.png",
        // the URL of grandSon.src will become "https://example.com/static/img.png", resulting in a different md5.
        // Therefore, we attempt to handle this situation by trying again with the absolute path.
        const a = document.createElement('a');
        a.href = grandSon.src;
        sign = md5(a.pathname);
      }

      img.onload = function () {
        let percent = ((img.height / img.width) * 100).toFixed(5);
        var style = document.createElement("style");
        style.innerHTML = renderStyle(sign, percent);
        let target = document.getElementById(`lht${sign}`)

        if (!target) return;

        target.parentNode.insertBefore(style, target);
        item.classList.remove("image-load");
        item.classList.add("image-loaded");
      }

    }

    initImage();
  };
}


function renderStyle(sign, percent) {
  return `
      .image-${sign} {
      width: 100%;
      padding-top: ${percent}%;
      height: auto;
  }

  @media only screen and (max-width: 1068px) {
      .image-${sign} {
      width: 100%;
      padding-top: ${percent}%;
      height: auto;
    }
  }

  @media only screen and (max-width: 734px) {
    .image-${sign} {
    width: 100%;
    padding-top: ${percent}%;
    height: auto;
  }
  };`
}

function syntaxHighlight() {
  var script = document.createElement("script");
  script.src = "//cdn.staticfile.org/highlight.js/11.7.0/highlight.min.js";
  document.head.appendChild(script);

  var styleLight = document.createElement("link");
  styleLight.rel = "stylesheet";
  styleLight.href = "//cdn.staticfile.org/highlight.js/11.7.0/styles/stackoverflow-light.min.css";

  var styleDark = document.createElement("link");
  styleDark.rel = "stylesheet";
  styleDark.href = "//cdn.staticfile.org/highlight.js/11.7.0/styles/stackoverflow-dark.min.css";

  if (document.querySelector("body").classList.contains("theme-dark")) {
    document.head.appendChild(styleDark);
  } else {
    document.head.appendChild(styleLight);
  }

  script.onload = function () {
    // console.log("hljs.js loaded");
    // 忽略未转义的HTML警告，自己的md文档默认可信
    hljs.configure({
      ignoreUnescapedHTML: true
    });
    document.querySelectorAll('pre code').forEach((el) => {
      // 跳过 mermaid 代码块，由 initMermaid 渲染为流程图
      if (el.getAttribute('data-mermaid-block') === 'true' || el.classList.contains('language-mermaid') || (el.className && String(el.className).indexOf('mermaid') !== -1)) return;
      hljs.highlightElement(el);
    });
  };
}

function initMermaid() {
  // 多种选择器兼容 Astro/Prism 等不同构建输出
  var mermaidBlocks = document.querySelectorAll('code[data-mermaid-block="true"], pre code.language-mermaid, pre code[class*="mermaid"]');
  if (mermaidBlocks.length === 0) return;

  var script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/mermaid@9/dist/mermaid.min.js";
  document.head.appendChild(script);

  script.onload = function () {
    if (typeof mermaid === 'undefined') return;
    mermaid.initialize({
      startOnLoad: false,
      theme: document.querySelector("body").classList.contains("theme-dark") ? "dark" : "default"
    });
    mermaidBlocks.forEach(function (codeEl) {
      var pre = codeEl.closest('pre');
      if (!pre) return;
      var content = codeEl.textContent.trim();
      if (!content) return;
      var div = document.createElement('div');
      div.className = 'mermaid-container';
      div.innerHTML = '<div class="mermaid">' + content + '</div>';
      pre.replaceWith(div);
    });
    var mermaidNodes = document.querySelectorAll('.mermaid');
    if (mermaidNodes.length > 0) {
      try {
        if (typeof mermaid.run === 'function') {
          mermaid.run({ nodes: mermaidNodes });
        } else if (typeof mermaid.init === 'function') {
          mermaid.init(undefined, mermaidNodes);
        }
      } catch (e) {
        console.warn('Mermaid render error:', e);
      }
      initMermaidFullscreen();
    }
  };
  script.onerror = function () {
    console.warn('Mermaid script failed to load');
  };
}

function initMermaidFullscreen() {
  var containers = document.querySelectorAll('.mermaid-container');
  if (containers.length === 0) return;
  var modal = document.createElement('div');
  modal.className = 'mermaid-fullscreen-overlay';
  modal.innerHTML = '<div class="mermaid-fullscreen-backdrop"></div>' +
    '<div class="mermaid-fullscreen-toolbar">' +
    '<button type="button" class="mermaid-fs-btn mermaid-fs-zoom-in" title="放大">+</button>' +
    '<button type="button" class="mermaid-fs-btn mermaid-fs-zoom-out" title="缩小">−</button>' +
    '<button type="button" class="mermaid-fs-btn mermaid-fs-reset" title="重置">⟲</button>' +
    '<button type="button" class="mermaid-fs-btn mermaid-fs-close" title="关闭">×</button>' +
    '</div>' +
    '<div class="mermaid-fullscreen-content"><div class="mermaid-fullscreen-inner"></div></div>';
  document.body.appendChild(modal);
  var backdrop = modal.querySelector('.mermaid-fullscreen-backdrop');
  var inner = modal.querySelector('.mermaid-fullscreen-inner');
  var zoomInBtn = modal.querySelector('.mermaid-fs-zoom-in');
  var zoomOutBtn = modal.querySelector('.mermaid-fs-zoom-out');
  var resetBtn = modal.querySelector('.mermaid-fs-reset');
  var closeBtn = modal.querySelector('.mermaid-fs-close');
  var scale = 1;
  var translateX = 0;
  var translateY = 0;
  var isDragging = false;
  var startX, startY, startTx, startTy;
  var currentSvg = null;
  var currentMermaidEl = null;
  var savedSvgWidth = null;
  var savedSvgHeight = null;
  var savedSvgStyle = null;

  function applyTransform() {
    inner.style.transform = 'translate(' + translateX + 'px,' + translateY + 'px) scale(' + scale + ')';
  }
  function openFullscreen(sourceMermaidEl) {
    inner.innerHTML = '';
    currentMermaidEl = sourceMermaidEl || null;
    currentSvg = sourceMermaidEl ? sourceMermaidEl.querySelector('svg') : null;
    if (currentSvg && currentMermaidEl) {
      savedSvgWidth = currentSvg.getAttribute('width');
      savedSvgHeight = currentSvg.getAttribute('height');
      savedSvgStyle = currentSvg.getAttribute('style');
      var vb = currentSvg.getAttribute('viewBox');
      if (vb) {
        var parts = vb.trim().split(/\s+/);
        if (parts.length === 4) {
          var vw = parseFloat(parts[2]);
          var vh = parseFloat(parts[3]);
          if (vw > 0 && vh > 0) {
            currentSvg.removeAttribute('width');
            currentSvg.removeAttribute('height');
            currentSvg.removeAttribute('style');
            currentSvg.setAttribute('width', String(Math.round(vw)));
            currentSvg.setAttribute('height', String(Math.round(vh)));
          }
        }
      }
      inner.appendChild(currentSvg);
      currentMermaidEl.appendChild(document.createComment(' mermaid-svg-placeholder '));
    }
    scale = 1;
    translateX = 0;
    translateY = 0;
    applyTransform();
    modal.classList.add('mermaid-fullscreen-open');
    document.body.style.overflow = 'hidden';
  }
  function closeFullscreen() {
    if (currentSvg && currentMermaidEl) {
      if (savedSvgWidth !== null) currentSvg.setAttribute('width', savedSvgWidth);
      if (savedSvgHeight !== null) currentSvg.setAttribute('height', savedSvgHeight);
      if (savedSvgStyle !== null) currentSvg.setAttribute('style', savedSvgStyle);
      else currentSvg.removeAttribute('style');
      currentMermaidEl.insertBefore(currentSvg, currentMermaidEl.firstChild);
      var nodes = currentMermaidEl.childNodes;
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType === 8) {
          currentMermaidEl.removeChild(nodes[i]);
          break;
        }
      }
    }
    currentSvg = null;
    currentMermaidEl = null;
    savedSvgWidth = savedSvgHeight = savedSvgStyle = null;
    modal.classList.remove('mermaid-fullscreen-open');
    document.body.style.overflow = '';
  }
  backdrop.addEventListener('click', closeFullscreen);
  closeBtn.addEventListener('click', closeFullscreen);
  zoomInBtn.addEventListener('click', function () {
    scale = Math.min(scale + 0.25, 4);
    applyTransform();
  });
  zoomOutBtn.addEventListener('click', function () {
    scale = Math.max(scale - 0.25, 0.25);
    applyTransform();
  });
  resetBtn.addEventListener('click', function () {
    scale = 1;
    translateX = 0;
    translateY = 0;
    applyTransform();
  });
  inner.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startTx = translateX;
    startTy = translateY;
  });
  document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    translateX = startTx + (e.clientX - startX);
    translateY = startTy + (e.clientY - startY);
    applyTransform();
  });
  document.addEventListener('mouseup', function () {
    isDragging = false;
  });
  modal.querySelector('.mermaid-fullscreen-content').addEventListener('wheel', function (e) {
    if (!modal.classList.contains('mermaid-fullscreen-open')) return;
    e.preventDefault();
    if (e.deltaY < 0) {
      scale = Math.min(scale + 0.1, 4);
    } else {
      scale = Math.max(scale - 0.1, 0.25);
    }
    applyTransform();
  }, { passive: false });

  containers.forEach(function (container) {
    var mermaidEl = container.querySelector('.mermaid');
    if (!mermaidEl || !mermaidEl.querySelector('svg')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mermaid-fullscreen-trigger';
    btn.title = '全屏查看（可缩放、拖动）';
    btn.innerHTML = '⛶';
    btn.setAttribute('aria-label', '全屏');
    container.classList.add('mermaid-container-has-fs');
    container.appendChild(btn);
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      openFullscreen(mermaidEl);
    });
  });
}

