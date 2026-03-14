(function () {
  const catalogStore = {
    promise: null
  };

  const revealObserver = {
    instance: null
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

  function buildProductImages(product) {
    if (Array.isArray(product.images) && product.images.length) {
      return product.images;
    }

    const imageCount = Math.max(0, Number(product.imageCount) || 0);
    const imageExt = product.imageExt || "jpg";

    return Array.from({ length: imageCount }, (_, index) => {
      const fileName = String(index + 1).padStart(2, "0");
      return `./assets/catalog/${product.slug}/${fileName}.${imageExt}`;
    });
  }

  function normalizeCatalogData(rawData = {}) {
    const rawCategories = Array.isArray(rawData.categories) ? rawData.categories : [];
    const categoryMap = new Map(rawCategories.map((category) => [category.key, category]));
    const rawProducts = Array.isArray(rawData.products) ? rawData.products : [];

    const products = rawProducts.map((product) => {
      const category = categoryMap.get(product.categoryKey) || {};
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
        category: product.category || category.label || "",
        categoryDescription: product.categoryDescription || category.description || ""
      };
    });

    const categories = rawCategories.map((category) => {
      const group = products.filter((product) => product.categoryKey === category.key);

      return {
        key: category.key,
        label: category.label,
        description: category.description,
        count: group.length,
        image: group[0]?.images?.[0] || ""
      };
    });

    return {
      generatedAt: rawData.generatedAt || "",
      categories,
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
        const sourceUrl = config.catalogDataUrl || "./assets/catalog/catalog.json";

        try {
          const response = await fetch(sourceUrl, { cache: "no-store" });

          if (!response.ok) {
            throw new Error(`Failed to load catalog: ${response.status}`);
          }

          const rawData = await response.json();
          const data = normalizeCatalogData(rawData);
          window.catalogData = data;
          return data;
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
    const safeCategory = escapeHtml(categoryLabel || product.category || "");

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
      element.style.backgroundImage = `url("${imageUrl}")`;
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

  function observeRevealElements(root = document) {
    const elements = root.querySelectorAll(".reveal, [data-reveal]");

    if (!elements.length) {
      return;
    }

    if (!revealObserver.instance) {
      revealObserver.instance = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.instance.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.16,
          rootMargin: "0px 0px -6% 0px"
        }
      );
    }

    elements.forEach((element) => revealObserver.instance.observe(element));
  }

  window.siteHelpers = {
    buildGoogleMapsUrl,
    escapeHtml,
    escapeAttribute,
    buildWhatsAppUrl,
    initHeaderState,
    initMobileMenu,
    loadCatalogData,
    observeRevealElements,
    productUrl,
    renderProductCard,
    setBackgroundImage
  };
})();
