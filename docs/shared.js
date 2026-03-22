(function () {
  const catalogStore = {
    promise: null
  };

  function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
      };

      return entities[character];
    });
  }

  function escapeAttribute(value = "") {
    return escapeHtml(value).replace(/`/g, "&#96;");
  }

  function normalizePhone(value = "") {
    return String(value).replace(/[^\d]/g, "");
  }

  function formatPriceValue(value, prefix = "") {
    if (!Number.isFinite(value)) {
      return "";
    }

    const formatted = new Intl.NumberFormat("ru-RU").format(value);
    return `${prefix ? `${prefix} ` : ""}${formatted} сом`;
  }

  function withAssetVersion(url = "") {
    const config = window.siteConfig || {};
    const version = String(config.assetVersion || "").trim();

    if (!url || !version || /^https?:\/\//i.test(url)) {
      return url;
    }

    return url.includes("?") ? `${url}&v=${encodeURIComponent(version)}` : `${url}?v=${encodeURIComponent(version)}`;
  }

  function buildProductImages(product) {
    if (Array.isArray(product.images) && product.images.length) {
      return product.images.map((image) => withAssetVersion(image));
    }

    const imageCount = Math.max(0, Number(product.imageCount) || 0);
    const imageExt = product.imageExt || "jpg";

    return Array.from({ length: imageCount }, (_, index) => {
      const fileName = String(index + 1).padStart(2, "0");
      const assetPath = product.assetPath || product.slug;
      return withAssetVersion(`./assets/catalog/${assetPath}/${fileName}.${imageExt}`);
    });
  }

  function flattenCategories(nodes, parentKey = "", depth = 0, bucket = []) {
    nodes.forEach((node) => {
      const path = Array.isArray(node.path) && node.path.length ? node.path : [node.label].filter(Boolean);
      const item = {
        key: node.key,
        label: node.label,
        description: node.description || "",
        path,
        pathText: path.join(" / "),
        parentKey,
        depth,
        children: Array.isArray(node.children) ? node.children : []
      };

      bucket.push(item);
      flattenCategories(item.children, item.key, depth + 1, bucket);
    });

    return bucket;
  }

  function summarizeCategoryNode(node, products, parentKey = "", depth = 0) {
    const path = Array.isArray(node.path) && node.path.length ? node.path : [node.label].filter(Boolean);
    const children = (node.children || []).map((child) => summarizeCategoryNode(child, products, node.key, depth + 1));
    const ownProducts = products.filter((product) => product.groupKey === node.key);
    const descendantProducts = products.filter((product) => product.categoryPathKeys.includes(node.key));
    const image = ownProducts[0]?.images?.[0] || children.find((child) => child.image)?.image || descendantProducts[0]?.images?.[0] || "";

    return {
      key: node.key,
      label: node.label,
      description: node.description,
      path,
      pathText: path.join(" / "),
      parentKey,
      depth,
      count: descendantProducts.length,
      directCount: ownProducts.length,
      image,
      children
    };
  }

  function normalizeCatalogData(rawData = {}) {
    const rawCategories = Array.isArray(rawData.categories) ? rawData.categories : [];
    const flatCategories = flattenCategories(rawCategories);
    const categoryMap = new Map(flatCategories.map((category) => [category.key, category]));
    const rawProducts = Array.isArray(rawData.products) ? rawData.products : [];

    const products = rawProducts.map((product) => {
      const categoryPath = Array.isArray(product.categoryPath) ? product.categoryPath : [];
      const categoryPathKeys = Array.isArray(product.categoryPathKeys) ? product.categoryPathKeys : [];
      const topCategory = categoryMap.get(product.categoryKey) || categoryMap.get(categoryPathKeys[0]) || {};
      const group = categoryMap.get(product.groupKey) || categoryMap.get(categoryPathKeys.at(-1)) || topCategory;
      const images = buildProductImages(product);
      const rawPrice =
        typeof product.price === "number"
          ? product.price
          : Number.isFinite(product.priceValue)
            ? product.priceValue
            : Number(product.price);
      const priceText =
        typeof product.price === "string" && !Number.isFinite(Number(product.price))
          ? product.price
          : formatPriceValue(rawPrice, product.pricePrefix);

      return {
        ...product,
        price: priceText,
        priceValue: Number.isFinite(rawPrice) ? rawPrice : null,
        imageCount: images.length,
        images,
        categoryKey: product.categoryKey || topCategory.key || "",
        category: product.category || topCategory.label || "",
        categoryDescription: product.categoryDescription || topCategory.description || "",
        groupKey: product.groupKey || group.key || product.categoryKey || "",
        group: product.group || group.label || product.category || topCategory.label || "",
        groupDescription: product.groupDescription || group.description || "",
        categoryPath,
        categoryPathKeys,
        categoryPathText: categoryPath.join(" / ")
      };
    });

    const categories = rawCategories.map((category) => summarizeCategoryNode(category, products));

    return {
      generatedAt: rawData.generatedAt || "",
      categories,
      flatCategories,
      featuredSlugs: Array.isArray(rawData.featuredSlugs) ? rawData.featuredSlugs : [],
      products
    };
  }

  function productUrl(slug) {
    return `./product.html?slug=${encodeURIComponent(slug)}`;
  }

  function buildWhatsAppUrl(product, customText) {
    const config = window.siteConfig || {};
    const phone = normalizePhone(config.whatsappNumber);

    if (!phone) {
      return "#";
    }

    const intro = customText || config.whatsappGreeting || "Здравствуйте! Хочу заказать";
    const productLine = product?.name
      ? `${product.name}${product.price ? ` — ${product.price}` : ""}`
      : "";
    const message = productLine ? `${intro}: ${productLine}` : intro;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  function buildGoogleMapsUrl(mode = "open") {
    const config = window.siteConfig || {};
    const latitude = Number(config.storeLatitude);
    const longitude = Number(config.storeLongitude);
    const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);
    const querySource = config.googleMapsQuery || config.storeAddress || "";

    if (!querySource && !hasCoordinates) {
      return mode === "embed" ? "" : "#";
    }

    if (hasCoordinates) {
      const coordinates = `${latitude},${longitude}`;

      if (mode === "embed") {
        return `https://maps.google.com/maps?hl=ru&q=${encodeURIComponent(coordinates)}&t=&z=18&ie=UTF8&iwloc=B&output=embed`;
      }

      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinates)}`;
    }

    const query = encodeURIComponent(querySource);

    if (mode === "embed") {
      return `https://maps.google.com/maps?hl=ru&q=${query}&t=&z=18&ie=UTF8&iwloc=B&output=embed`;
    }

    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  async function loadCatalogData() {
    if (!catalogStore.promise) {
      catalogStore.promise = (async () => {
        const config = window.siteConfig || {};
        const sourceUrl = withAssetVersion(config.catalogDataUrl || "./assets/catalog/catalog.json");

        try {
          const response = await fetch(sourceUrl, { cache: "no-store" });

          if (!response.ok) {
            throw new Error(`Failed to load catalog: ${response.status}`);
          }

          const rawData = await response.json();
          window.catalogData = rawData;
          return normalizeCatalogData(rawData);
        } catch (error) {
          if (window.catalogData) {
            return normalizeCatalogData(window.catalogData);
          }

          throw error;
        }
      })();
    }

    return catalogStore.promise;
  }

  function createMediaShell(product, categoryLabel) {
    const image = product.images?.[0] || "";
    const safeImage = escapeAttribute(image);
    const safeTitle = escapeHtml(product.name);
    const safeCategory = escapeHtml(categoryLabel || product.categoryPathText || product.group || product.category || "");

    return `
      <a
        class="media-shell product-link ${safeImage ? "has-image" : ""}"
        href="${productUrl(product.slug)}"
        ${safeImage ? `style="background-image: url('${safeImage}');"` : ""}
      >
        <span class="product-tag">${safeCategory}</span>
        <div class="media-placeholder">
          <div>
            <strong>${safeTitle}</strong>
          </div>
        </div>
      </a>
    `;
  }

  function renderProductCard(product) {
    const safeName = escapeHtml(product.name);
    const safeShort = escapeHtml(product.short);
    const safePrice = escapeHtml(product.price);
    const whatsappUrl = buildWhatsAppUrl(product);

    return `
      <article class="product-card reveal">
        ${createMediaShell(product)}
        <div class="product-body">
          <div class="product-meta">
            <div>
              <h3>${safeName}</h3>
              <p>${safeShort}</p>
            </div>
            <span class="price">${safePrice}</span>
          </div>
          <div class="product-actions">
            <a class="button button-secondary" href="${productUrl(product.slug)}">Подробнее</a>
            <a class="button button-primary" href="${whatsappUrl}" target="_blank" rel="noreferrer">
              Купить
            </a>
          </div>
        </div>
      </article>
    `;
  }

  function setBackgroundImage(element, imageUrl) {
    if (!element) {
      return;
    }

    if (imageUrl) {
      element.classList.add("has-image");
      element.style.backgroundImage = `url("${withAssetVersion(imageUrl)}")`;
      return;
    }

    element.classList.remove("has-image");
    element.style.backgroundImage = "";
  }

  function initMobileMenu() {
    const button = document.querySelector("[data-menu-toggle]");
    const menu = document.querySelector("[data-mobile-menu]");
    const links = menu ? menu.querySelectorAll("a") : [];

    if (!button || !menu) {
      return;
    }

    const closeMenu = () => {
      button.classList.remove("is-open");
      menu.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    };

    button.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      button.classList.toggle("is-open", isOpen);
      button.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    });

    links.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 960) {
        closeMenu();
      }
    });
  }

  function initHeaderState() {
    const header = document.querySelector(".site-header");

    if (!header) {
      return;
    }

    const sync = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
  }

  function initTopLinks(root = document) {
    const links = root.querySelectorAll('a[href="#top"], a[href="./index.html#top"], a[href="./index.html"]');

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href") || "";
        const isCurrentIndexPage =
          href === "#top" ||
          href === "./index.html" ||
          href === "./index.html#top" ||
          window.location.pathname.endsWith("/index.html") ||
          window.location.pathname === "/" ||
          window.location.pathname.endsWith("/docs/");

        if (href === "#top" || (isCurrentIndexPage && (href === "./index.html" || href === "./index.html#top"))) {
          event.preventDefault();
          window.scrollTo(0, 0);
          if (window.location.hash) {
            history.replaceState(null, "", window.location.pathname + window.location.search);
          }
        }
      });
    });
  }

  function observeRevealElements(root = document) {
    const elements = root.querySelectorAll(".reveal, [data-reveal]");

    if (!elements.length) {
      return;
    }
    elements.forEach((element) => element.classList.add("is-visible"));
  }

  window.siteHelpers = {
    buildGoogleMapsUrl,
    escapeHtml,
    escapeAttribute,
    buildWhatsAppUrl,
    initHeaderState,
    initMobileMenu,
    initTopLinks,
    loadCatalogData,
    observeRevealElements,
    productUrl,
    renderProductCard,
    setBackgroundImage
  };
})();
