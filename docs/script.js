(function () {
  const config = window.siteConfig || {};
  const helpers = window.siteHelpers || {};
  let data = { categories: [], flatCategories: [], products: [], featuredSlugs: [] };
  let activeCategory = "all";
  let activeGroup = "all";

  function byId(id) {
    return document.getElementById(id);
  }

  function featuredProducts() {
    const featured = new Set(data.featuredSlugs || []);
    return data.products.filter((product) => featured.has(product.slug));
  }

  function currentCategory() {
    return data.categories.find((category) => category.key === activeCategory) || null;
  }

  function currentGroup() {
    if (activeGroup === "all") {
      return null;
    }

    return data.flatCategories.find((category) => category.key === activeGroup) || null;
  }

  function subgroupsForActiveCategory() {
    return currentCategory()?.children || [];
  }

  function renderCategories() {
    const root = byId("categoryGrid");

    if (!root) {
      return;
    }

    root.innerHTML = data.categories
      .map(
        (category, index) => `
          <article class="category-card reveal" style="--delay:${index * 40}ms;">
            <button
              class="media-shell product-link ${category.image ? "has-image" : ""}"
              type="button"
              data-category-trigger="${helpers.escapeAttribute(category.key)}"
              style="${category.image ? `background-image: url('${helpers.escapeAttribute(category.image)}');` : ""}"
            >
              <div class="media-placeholder">
                <div>
                  <strong>${helpers.escapeHtml(category.label)}</strong>
                  <span>${category.count} товаров${category.children?.length ? ` · ${category.children.length} подгрупп` : ""}</span>
                </div>
              </div>
            </button>
            <div class="category-body">
              <h3>${helpers.escapeHtml(category.label)}</h3>
              <p>${helpers.escapeHtml(category.description)}</p>
              <a class="category-link" href="#catalog" data-category-link="${helpers.escapeAttribute(category.key)}">
                Смотреть товары
              </a>
            </div>
          </article>
        `
      )
      .join("");

    helpers.observeRevealElements(root);
  }

  function renderFeatured() {
    const root = byId("featuredGrid");

    if (!root) {
      return;
    }

    root.innerHTML = featuredProducts()
      .map((product, index) => {
        const markup = helpers.renderProductCard(product);
        return markup.replace('class="product-card reveal"', `class="product-card reveal" style="--delay:${index * 40}ms;"`);
      })
      .join("");

    helpers.observeRevealElements(root);
  }

  function renderFilters() {
    const root = byId("filterBar");

    if (!root) {
      return;
    }

    const chips = [
      {
        key: "all",
        label: "Все товары"
      },
      ...data.categories.map((category) => ({
        key: category.key,
        label: category.label
      }))
    ];

    root.innerHTML = chips
      .map(
        (chip) => `
          <button
            class="filter-chip ${chip.key === activeCategory ? "is-active" : ""}"
            type="button"
            data-filter="${helpers.escapeAttribute(chip.key)}"
          >
            ${helpers.escapeHtml(chip.label)}
          </button>
        `
      )
      .join("");
  }

  function renderSubgroups() {
    const root = byId("subgroupBar");

    if (!root) {
      return;
    }

    const subgroups = subgroupsForActiveCategory();
    if (activeCategory === "all" || !subgroups.length) {
      root.hidden = true;
      root.innerHTML = "";
      return;
    }

    const chips = [
      {
        key: "all",
        label: "Все внутри"
      },
      ...subgroups.map((group) => ({
        key: group.key,
        label: group.label
      }))
    ];

    root.hidden = false;
    root.innerHTML = chips
      .map(
        (chip) => `
          <button
            class="filter-chip ${chip.key === activeGroup ? "is-active" : ""}"
            type="button"
            data-group-filter="${helpers.escapeAttribute(chip.key)}"
          >
            ${helpers.escapeHtml(chip.label)}
          </button>
        `
      )
      .join("");
  }

  function filteredProducts() {
    if (activeCategory === "all") {
      return data.products;
    }

    return data.products.filter((product) => {
      const insideCategory = product.categoryKey === activeCategory || product.categoryPathKeys.includes(activeCategory);

      if (!insideCategory) {
        return false;
      }

      if (activeGroup === "all") {
        return true;
      }

      return product.groupKey === activeGroup || product.categoryPathKeys.includes(activeGroup);
    });
  }

  function updateCatalogCounters() {
    const productCount = byId("catalogProductCount");
    const categoryCount = byId("catalogCategoryCount");
    const totalGroups = data.flatCategories.filter((category) => category.depth > 0).length;

    if (productCount) {
      productCount.textContent = `${data.products.length} товаров`;
    }

    if (categoryCount) {
      categoryCount.textContent = `${data.categories.length} категорий · ${totalGroups} подгрупп`;
    }
  }

  function renderFooterCategories() {
    const root = byId("footerCategoryLinks");

    if (!root) {
      return;
    }

    root.innerHTML = data.categories
      .map(
        (category) => `
          <a href="#catalog" data-footer-filter="${helpers.escapeAttribute(category.key)}">${helpers.escapeHtml(category.label)}</a>
        `
      )
      .join("");
  }

  function renderCatalog() {
    const root = byId("catalogGrid");
    const empty = byId("catalogEmpty");
    const summary = byId("catalogSummary");

    if (!root || !empty || !summary) {
      return;
    }

    const products = filteredProducts();
    empty.hidden = products.length > 0;
    const category = currentCategory();
    const group = currentGroup();

    summary.textContent = group
      ? `${category?.label || "Каталог"} / ${group.label} · ${products.length} товаров · Откройте карточку, чтобы посмотреть все фото`
      : category
        ? `${category.label} · ${products.length} товаров · Выберите подгруппу или откройте карточку товара`
        : `Все товары · ${products.length} позиций · Листайте вниз или выберите категорию`;

    root.innerHTML = products
      .map((product, index) => {
        const markup = helpers.renderProductCard(product);
        return markup.replace('class="product-card reveal"', `class="product-card reveal" style="--delay:${index * 24}ms;"`);
      })
      .join("");

    helpers.observeRevealElements(root);
  }

  function updateWhatsAppLinks() {
    const genericLink = helpers.buildWhatsAppUrl(null);
    const ids = [
      "headerWhatsAppLink",
      "mobileWhatsAppLink",
      "heroWhatsAppLink",
      "promoWhatsAppLink",
      "contactWhatsAppLink",
      "footerWhatsAppLink"
    ];

    ids.forEach((id) => {
      const element = byId(id);
      if (element) {
        element.href = genericLink;
      }
    });

    const instagramLink = byId("footerInstagramLink");
    if (instagramLink) {
      instagramLink.href = config.instagramUrl || "#";
      instagramLink.textContent = config.instagramLabel || "Instagram";
    }

    const mapsUrl = helpers.buildGoogleMapsUrl("open");
    const embedUrl = helpers.buildGoogleMapsUrl("embed");
    const mapLink = byId("storeMapLink");
    const footerMapLink = byId("footerMapsLink");
    const mapFrame = byId("storeMapEmbed");
    const mapBlock = byId("locationMapBlock");

    [mapLink, footerMapLink].forEach((element) => {
      if (element) {
        element.href = mapsUrl;
      }
    });

    if (mapFrame) {
      mapFrame.src = embedUrl;
    }

    if (mapBlock) {
      mapBlock.hidden = !embedUrl;
    }
  }

  function bindInteractions() {
    document.addEventListener("click", (event) => {
        const filterButton = event.target.closest("[data-filter]");
        if (filterButton) {
          activeCategory = filterButton.getAttribute("data-filter") || "all";
          activeGroup = "all";
          renderFilters();
          renderSubgroups();
          renderCatalog();
          return;
        }

        const groupButton = event.target.closest("[data-group-filter]");
        if (groupButton) {
          activeGroup = groupButton.getAttribute("data-group-filter") || "all";
          renderSubgroups();
          renderCatalog();
          return;
        }

        const categoryTrigger = event.target.closest("[data-category-trigger], [data-category-link], [data-footer-filter]");
        if (categoryTrigger) {
        const nextCategory =
          categoryTrigger.getAttribute("data-category-trigger") ||
          categoryTrigger.getAttribute("data-category-link") ||
          categoryTrigger.getAttribute("data-footer-filter") ||
          "all";

          activeCategory = nextCategory;
          activeGroup = "all";
          renderFilters();
          renderSubgroups();
          renderCatalog();

        const catalogSection = byId("catalog");
        if (catalogSection) {
          catalogSection.scrollIntoView({ block: "start" });
        }
      }
    });
  }

  function initVisuals() {
    const heroVisual = byId("heroVisual");
    const fallbackImage = featuredProducts()[0]?.images?.[0] || data.products[0]?.images?.[0] || "";
    helpers.setBackgroundImage(heroVisual, config.heroImage || fallbackImage);
  }

  function renderLoadError() {
    const summary = byId("catalogSummary");
    const empty = byId("catalogEmpty");
    const grids = ["categoryGrid", "featuredGrid", "catalogGrid"];

    grids.forEach((id) => {
      const element = byId(id);
      if (element) {
        element.innerHTML = "";
      }
    });

    if (summary) {
      summary.textContent = "Не удалось загрузить каталог.";
    }

    if (empty) {
      empty.hidden = false;
      empty.textContent = "Не удалось загрузить catalog.json. Проверьте путь и структуру файла.";
    }
  }

  async function init() {
    updateWhatsAppLinks();
    helpers.initMobileMenu();
    helpers.initHeaderState();
    helpers.initTopLinks();
    helpers.observeRevealElements();

    try {
      data = await helpers.loadCatalogData();
    } catch (error) {
      console.error(error);
      renderLoadError();
      return;
    }

    renderCategories();
    renderFeatured();
    renderFilters();
    renderSubgroups();
    renderCatalog();
    renderFooterCategories();
    updateCatalogCounters();
    initVisuals();
    bindInteractions();
  }

  init();
})();
