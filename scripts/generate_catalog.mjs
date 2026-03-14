import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const sourceRoot = "/home/dastan/Desktop/tg-media-folder-bot/exports";
const mainRoot = path.join(projectRoot, "main");
const targetRoot = path.join(mainRoot, "assets", "catalog");
const outputFile = path.join(targetRoot, "catalog.json");

const categoryMeta = {
  footwear: {
    label: "Обувь",
    description: "Бутсы, сороконожки, футзалки и специализированная обувь для тренировок."
  },
  apparel: {
    label: "Форма",
    description: "Игровые комплекты, тренировочная одежда и командная экипировка."
  },
  combat: {
    label: "Единоборства",
    description: "Экипировка и форма для бокса, борьбы, дзюдо и тхэквондо."
  },
  accessories: {
    label: "Аксессуары",
    description: "Мячи, щитки, гетры, шейкеры и полезные спортивные мелочи."
  },
  awards: {
    label: "Награды",
    description: "Медали и кубки для турниров, соревнований и командных награждений."
  }
};

const productSource = [
  {
    source: "1800 сом",
    slug: "venum-fight-kit",
    name: "Комплект Venum Fight Kit",
    price: "1 800 сом",
    priceValue: 1800,
    categoryKey: "combat",
    short: "Футболка и шорты для единоборств",
    description:
      "Легкий комплект для интенсивных тренировок, спаррингов и работы в зале. Подойдет для тех, кто ищет готовый набор без лишних деталей."
  },
  {
    source: "3000 сом",
    slug: "venum-compression-pro",
    name: "Компрессионный комплект Venum Pro",
    price: "3 000 сом",
    priceValue: 3000,
    categoryKey: "combat",
    short: "Рашгард, шорты и тайтсы",
    description:
      "Полный тренировочный комплект для единоборств с плотной посадкой и выразительным спортивным дизайном."
  },
  {
    source: "Борцовки Грин Хилл 1000 цена",
    slug: "green-hill-wrestling-shoes",
    name: "Борцовки Green Hill",
    price: "1 000 сом",
    priceValue: 1000,
    categoryKey: "combat",
    short: "Легкая обувь для ковра",
    description:
      "Устойчивая борцовская обувь для тренировок и соревнований. Подойдет для борьбы и зальных покрытий."
  },
  {
    source: "Бутсы Адидас Предатор 2800 цена",
    slug: "adidas-predator-boots",
    name: "Бутсы Adidas Predator",
    price: "2 800 сом",
    priceValue: 2800,
    categoryKey: "footwear",
    short: "Контроль мяча и плотная посадка",
    description:
      "Классическая модель бутс для футбола с акцентом на комфорт, фиксацию стопы и уверенное касание."
  },
  {
    source: "Бутсы Адидас ф50 цена 2800",
    slug: "adidas-f50-boots",
    name: "Бутсы Adidas F50",
    price: "2 800 сом",
    priceValue: 2800,
    categoryKey: "footwear",
    short: "Скоростная футбольная модель",
    description:
      "Легкие бутсы для динамичной игры и быстрых рывков. Хороший вариант для тренировок и матчей."
  },
  {
    source: "Бутсы фантом 2800 цена",
    slug: "phantom-boots",
    name: "Бутсы Phantom",
    price: "2 800 сом",
    priceValue: 2800,
    categoryKey: "footwear",
    short: "Бутсы для атакующего стиля",
    description:
      "Футбольная модель с выразительным силуэтом и удобной посадкой для быстрых смен направления."
  },
  {
    source: "Волейбольная обувь Асикс 3500 сом",
    slug: "asics-volleyball-shoes",
    name: "Волейбольные кроссовки Asics",
    price: "3 500 сом",
    priceValue: 3500,
    categoryKey: "footwear",
    short: "Амортизация и устойчивость в зале",
    description:
      "Зальная обувь для волейбола с надежным сцеплением и комфортом во время прыжков и резких остановок."
  },
  {
    source: "Детские формы цена 600",
    slug: "kids-sports-uniforms",
    name: "Детские спортивные формы",
    price: "600 сом",
    priceValue: 600,
    categoryKey: "apparel",
    short: "Формы для секций и команды",
    description:
      "Подборка детских комплектов для тренировок, школьных секций и командных занятий."
  },
  {
    source: "Джома Топ флекс цена 3000 сом",
    slug: "joma-top-flex-indoor",
    name: "Joma Top Flex Indoor",
    price: "3 000 сом",
    priceValue: 3000,
    categoryKey: "footwear",
    short: "Футзалки для зала",
    description:
      "Популярная модель футзалок с комфортной колодкой и цепкой подошвой для игр в зале."
  },
  {
    source: "Кимоно ИТФ тхэквондо 2000 сом",
    slug: "itf-taekwondo-gi",
    name: "Кимоно ITF тхэквондо",
    price: "2 000 сом",
    priceValue: 2000,
    categoryKey: "combat",
    short: "Форма для тренировок и выступлений",
    description:
      "Кимоно для занятий тхэквондо ITF с классическим кроем и аккуратной посадкой."
  },
  {
    source: "Кимоно дзюдо 1600 сом",
    slug: "judo-gi",
    name: "Кимоно для дзюдо",
    price: "1 600 сом",
    priceValue: 1600,
    categoryKey: "combat",
    short: "Плотная форма для дзюдо",
    description:
      "Базовое кимоно для тренировочного процесса и повседневных занятий в секции."
  },
  {
    source: "Манежки цена 400 сом",
    slug: "kelme-training-bibs",
    name: "Манишки Kelme",
    price: "400 сом",
    priceValue: 400,
    categoryKey: "apparel",
    short: "Тренировочные манишки для команды",
    description:
      "Легкие манишки для деления на команды на тренировках, матчевых занятиях и сборах."
  },
  {
    source: "Медали цена 140 сом",
    slug: "sports-medals",
    name: "Спортивные медали",
    price: "140 сом",
    priceValue: 140,
    categoryKey: "awards",
    short: "Награды для турниров и соревнований",
    description:
      "Медали для школьных стартов, секционных турниров и спортивных мероприятий."
  },
  {
    source: "Мячи цена от 500 до 5000 сом",
    slug: "sports-balls",
    name: "Мячи для тренировок и игр",
    price: "от 500 до 5 000 сом",
    priceValue: 500,
    categoryKey: "accessories",
    short: "Разные модели под формат занятий",
    description:
      "Подборка мячей для футбола и тренировочных занятий в разном ценовом диапазоне."
  },
  {
    source: "Награды и кубки 1800 цена",
    slug: "classic-award-cups",
    name: "Наградные кубки Classic",
    price: "1 800 сом",
    priceValue: 1800,
    categoryKey: "awards",
    short: "Кубки для турниров и награждений",
    description:
      "Набор наградных кубков для соревнований, школьных турниров и секционных мероприятий."
  },
  {
    source: "Обрезки 200 сом",
    slug: "football-socks",
    name: "Футбольные гетры",
    price: "200 сом",
    priceValue: 200,
    categoryKey: "accessories",
    short: "Яркие гетры для тренировок и матчей",
    description:
      "Футбольные гетры разных цветов для тренировок, игры и командной экипировки."
  },
  {
    source: "Перчатки бокс ТопТен 1200 цена",
    slug: "top-ten-boxing-gloves",
    name: "Боксерские перчатки Top Ten",
    price: "1 200 сом",
    priceValue: 1200,
    categoryKey: "combat",
    short: "Перчатки для мешка и спаррингов",
    description:
      "Базовые боксерские перчатки для тренировок, постановки удара и начальной работы в зале."
  },
  {
    source: "Перчатки вратарские Предатор цена 2000 сом",
    slug: "predator-goalkeeper-gloves",
    name: "Вратарские перчатки Predator",
    price: "2 000 сом",
    priceValue: 2000,
    categoryKey: "accessories",
    short: "Хват и защита для игры в воротах",
    description:
      "Вратарские перчатки для тренировок и матчей с комфортной посадкой и уверенным сцеплением."
  },
  {
    source: "Сороконожки Аирзум 2000 цена",
    slug: "air-zoom-turf",
    name: "Сороконожки Air Zoom",
    price: "2 000 сом",
    priceValue: 2000,
    categoryKey: "footwear",
    short: "Универсальная turf-модель",
    description:
      "Сороконожки для мини-футбола и искусственного покрытия с удобной посадкой и стабильной подошвой."
  },
  {
    source: "Сороконожки Джома 3000 сом",
    slug: "joma-turf-shoes",
    name: "Сороконожки Joma Turf",
    price: "3 000 сом",
    priceValue: 3000,
    categoryKey: "footwear",
    short: "Устойчивость на искусственном покрытии",
    description:
      "Тренировочная turf-модель Joma для уверенного движения и стабильного сцепления на поле."
  },
  {
    source: "Сороконожки Темпо 2000 цена",
    slug: "tiempo-turf-shoes",
    name: "Сороконожки Tiempo Turf",
    price: "2 000 сом",
    priceValue: 2000,
    categoryKey: "footwear",
    short: "Классический силуэт для тренировок",
    description:
      "Модель с комфортной колодкой и простым надежным профилем для искусственного покрытия."
  },
  {
    source: "Сороконожки Унар гато 2200 цена",
    slug: "lunar-gato-turf",
    name: "Сороконожки Lunar Gato",
    price: "2 200 сом",
    priceValue: 2200,
    categoryKey: "footwear",
    short: "Контроль и мягкая посадка",
    description:
      "Удобная turf-модель для тех, кто ищет мягкую посадку и уверенное касание на тренировке."
  },
  {
    source: "Формы взрослые цена 800",
    slug: "adult-sports-uniforms",
    name: "Взрослые спортивные формы",
    price: "800 сом",
    priceValue: 800,
    categoryKey: "apparel",
    short: "Формы для тренировок и команд",
    description:
      "Игровые и тренировочные комплекты для взрослых команд, секций и любительских лиг."
  },
  {
    source: "Шейкеры цена 500 сом",
    slug: "sports-shakers",
    name: "Шейкеры для спорта",
    price: "500 сом",
    priceValue: 500,
    categoryKey: "accessories",
    short: "Удобные бутылки и шейкеры",
    description:
      "Практичные шейкеры для воды, изотоников и спортивного питания в дороге и на тренировке."
  },
  {
    source: "Щитки 200 сом",
    slug: "football-shin-guards",
    name: "Футбольные щитки",
    price: "200 сом",
    priceValue: 200,
    categoryKey: "accessories",
    short: "Базовая защита для игры",
    description:
      "Компактные щитки для тренировок и матчей, которые помогают снизить ударную нагрузку."
  },
  {
    source: "кубки 2500 сом",
    slug: "premium-award-cups",
    name: "Кубки премиум",
    price: "2 500 сом",
    priceValue: 2500,
    categoryKey: "awards",
    short: "Крупные кубки для торжественных награждений",
    description:
      "Премиальные наградные кубки для крупных турниров, финалов и официальных церемоний."
  }
];

const featuredSlugs = [
  "adidas-predator-boots",
  "asics-volleyball-shoes",
  "venum-compression-pro",
  "joma-top-flex-indoor",
  "adult-sports-uniforms",
  "sports-balls",
  "predator-goalkeeper-gloves",
  "premium-award-cups"
];

function compareByName(left, right) {
  return left.localeCompare(right, "ru", { numeric: true, sensitivity: "base" });
}

function imageFiles(files) {
  return files
    .filter((fileName) => /\.(jpe?g|png|webp)$/i.test(fileName))
    .sort(compareByName);
}

async function copyProductImages(product) {
  const sourceDir = path.join(sourceRoot, product.source);
  const sourceFiles = imageFiles(await fs.readdir(sourceDir));

  if (!sourceFiles.length) {
    throw new Error(`No images found in ${sourceDir}`);
  }

  const targetDir = path.join(targetRoot, product.slug);
  await fs.rm(targetDir, { recursive: true, force: true });
  await fs.mkdir(targetDir, { recursive: true });

  const imageExt = path.extname(sourceFiles[0]).replace(".", "").toLowerCase() || "jpg";

  for (const [index, fileName] of sourceFiles.entries()) {
    const sourcePath = path.join(sourceDir, fileName);
    const currentExt = path.extname(fileName).replace(".", "").toLowerCase() || imageExt;

    if (currentExt !== imageExt) {
      throw new Error(`Mixed image extensions are not supported in ${sourceDir}`);
    }

    const normalizedName = `${String(index + 1).padStart(2, "0")}.${imageExt}`;
    const targetPath = path.join(targetDir, normalizedName);
    await fs.copyFile(sourcePath, targetPath);
  }

  return {
    imageCount: sourceFiles.length,
    imageExt
  };
}

async function buildCatalog() {
  await fs.mkdir(targetRoot, { recursive: true });

  const products = [];

  for (const product of productSource) {
    const { imageCount, imageExt } = await copyProductImages(product);
    const pricePrefix = product.price.trim().startsWith("от ") ? "от" : undefined;

    products.push({
      slug: product.slug,
      name: product.name,
      price: product.priceValue,
      ...(pricePrefix ? { pricePrefix } : {}),
      categoryKey: product.categoryKey,
      short: product.short,
      description: product.description,
      imageCount,
      ...(imageExt !== "jpg" ? { imageExt } : {})
    });
  }

  products.sort((left, right) => {
    const categoryComparison = categoryMeta[left.categoryKey].label.localeCompare(
      categoryMeta[right.categoryKey].label,
      "ru",
      { sensitivity: "base" }
    );

    if (categoryComparison !== 0) {
      return categoryComparison;
    }

    return compareByName(left.name, right.name);
  });

  const categories = Object.entries(categoryMeta).map(([key, meta]) => ({
    key,
    label: meta.label,
    description: meta.description
  }));

  const data = {
    generatedAt: new Date().toISOString(),
    categories,
    featuredSlugs,
    products
  };

  const output = `${JSON.stringify(data, null, 2)}\n`;
  await fs.writeFile(outputFile, output, "utf8");
}

buildCatalog().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
