(function () {
  const config = window.siteConfig || {};
  const helpers = window.siteHelpers || {};
  let data = { products: [] };

  function byId(id) {
    return document.getElementById(id);
  }

  function getProduct() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");
    return data.products.find((product) => product.slug === slug) || null;
  }

  function renderThumbs(product) {
    const root = byId("detailThumbs");
    const main = byId("detailMainMedia");

    if (!root || !main) {
      return;
    }

    const setMainImage = (imageUrl) => {
      main.innerHTML = `
        <div
          class="detail-main-media__image ${imageUrl ? "has-image" : ""}"
          style="${imageUrl ? `background-image: url('${helpers.escapeAttribute(imageUrl)}');` : ""}"
        ></div>
      `;
    };

    setMainImage(product.images[0] || "");

    root.innerHTML = product.images
      .map(
        (image, index) => `
          <button
            class="detail-thumb ${index === 0 ? "is-active" : ""}"
            type="button"
            data-image="${helpers.escapeAttribute(image)}"
            style="background-image: url('${helpers.escapeAttribute(image)}');"
          ></button>
        `
      )
      .join("");

    root.addEventListener("click", (event) => {
      const thumb = event.target.closest("[data-image]");

      if (!thumb) {
        return;
      }

      root.querySelectorAll(".detail-thumb").forEach((button) => {
        button.classList.toggle("is-active", button === thumb);
      });

      setMainImage(thumb.getAttribute("data-image") || "");
    });
  }

  function renderRelated(product) {
    const root = byId("relatedGrid");

    if (!root) {
      return;
    }

    const related = data.products
      .filter((item) => item.categoryKey === product.categoryKey && item.slug !== product.slug)
      .slice(0, 4);

    root.innerHTML = related
      .map((item, index) => {
        const markup = helpers.renderProductCard(item);
        return markup.replace('class="product-card reveal"', `class="product-card reveal" style="--delay:${index * 40}ms;"`);
      })
      .join("");

    helpers.observeRevealElements(root);
  }

  function fillProduct(product) {
    document.title = `${product.name} | ALTYNTOP`;

    byId("breadcrumbCurrent").textContent = product.name;
    byId("detailCategory").textContent = product.category;
    byId("detailName").textContent = product.name;
    byId("detailPrice").textContent = product.price;
    byId("detailDescription").textContent = product.description;

    const points = byId("detailPoints");
    points.innerHTML = `
      <li>${helpers.escapeHtml(product.short)}</li>
      <li>Категория: ${helpers.escapeHtml(product.category)}</li>
      <li>Для заказа и наличия используйте WhatsApp</li>
    `;

    const productWhatsAppLink = helpers.buildWhatsAppUrl(product);
    ["detailWhatsAppLink", "detailHeaderWhatsApp", "detailMobileWhatsApp", "detailFooterWhatsApp"].forEach(
      (id) => {
        const element = byId(id);
        if (element) {
          element.href = productWhatsAppLink;
        }
      }
    );

    const instagramLink = byId("detailFooterInstagram");
    if (instagramLink) {
      instagramLink.href = config.instagramUrl || "#";
      instagramLink.textContent = config.instagramLabel || "Instagram";
    }

    renderThumbs(product);
    renderRelated(product);
  }

  function updateStaticLinks(url) {
    ["detailHeaderWhatsApp", "detailMobileWhatsApp", "detailFooterWhatsApp"].forEach((id) => {
      const element = byId(id);
      if (element) {
        element.href = url;
      }
    });

    const instagramLink = byId("detailFooterInstagram");
    if (instagramLink) {
      instagramLink.href = config.instagramUrl || "#";
      instagramLink.textContent = config.instagramLabel || "Instagram";
    }

    const mapsLink = byId("detailFooterMaps");
    if (mapsLink) {
      mapsLink.href = helpers.buildGoogleMapsUrl("open");
    }
  }

  function renderNotFound() {
    byId("detailName").textContent = "Товар не найден";
    byId("detailDescription").textContent =
      "Похоже, ссылка на товар устарела. Вернитесь в каталог и откройте нужную позицию заново.";
    byId("detailPrice").textContent = "";
    byId("detailPoints").innerHTML = "<li>Откройте каталог и выберите товар заново.</li>";
    const genericLink = helpers.buildWhatsAppUrl(null);
    byId("detailWhatsAppLink").href = genericLink;
    updateStaticLinks(genericLink);
  }

  function renderLoadError() {
    document.title = "ALTYNTOP | Каталог недоступен";
    byId("breadcrumbCurrent").textContent = "Ошибка загрузки";
    byId("detailCategory").textContent = "Каталог";
    byId("detailName").textContent = "Не удалось загрузить каталог";
    byId("detailDescription").textContent =
      "Проверьте файл assets/catalog/catalog.json и запустите сайт через локальный сервер.";
    byId("detailPrice").textContent = "";
    byId("detailPoints").innerHTML = "<li>После исправления обновите страницу.</li>";
    byId("relatedGrid").innerHTML = "";
    const genericLink = helpers.buildWhatsAppUrl(null);
    byId("detailWhatsAppLink").href = genericLink;
    updateStaticLinks(genericLink);
  }

  async function init() {
    try {
      data = await helpers.loadCatalogData();
    } catch (error) {
      console.error(error);
      renderLoadError();
      helpers.initMobileMenu();
      helpers.initHeaderState();
      helpers.observeRevealElements();
      return;
    }

    const product = getProduct();

    if (product) {
      fillProduct(product);
      updateStaticLinks(helpers.buildWhatsAppUrl(product));
    } else {
      renderNotFound();
    }

    helpers.initMobileMenu();
    helpers.initHeaderState();
    helpers.observeRevealElements();
  }

  init();
})();
