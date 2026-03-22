import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const sourceRoot = "/home/dastan/Desktop/tg-media-folder-bot/exports";
const targetRoot = path.join(projectRoot, "docs", "assets", "catalog");
const outputFile = path.join(targetRoot, "catalog.json");

const productMetaBySource = {
  "1800 сом": {
    slug: "venum-fight-kit",
    name: "Комплект Venum Fight Kit",
    price: "1 800 сом",
    priceValue: 1800,
    short: "Футболка и шорты для единоборств",
    description:
      "Легкий комплект для интенсивных тренировок, спаррингов и работы в зале. Подойдет для тех, кто ищет готовый набор без лишних деталей."
  },
  "3000 сом": {
    slug: "venum-compression-pro",
    name: "Компрессионный комплект Venum Pro",
    price: "3 000 сом",
    priceValue: 3000,
    short: "Рашгард, шорты и тайтсы",
    description:
      "Полный тренировочный комплект для единоборств с плотной посадкой и выразительным спортивным дизайном."
  },
  "Борцовки Грин Хилл 1000 цена": {
    slug: "green-hill-wrestling-shoes",
    name: "Борцовки Green Hill",
    price: "1 000 сом",
    priceValue: 1000,
    short: "Легкая обувь для ковра",
    description:
      "Устойчивая борцовская обувь для тренировок и соревнований. Подойдет для борьбы и зальных покрытий."
  },
  "Бутсы Адидас Предатор 2800 цена": {
    slug: "adidas-predator-boots",
    name: "Бутсы Adidas Predator",
    price: "2 800 сом",
    priceValue: 2800,
    short: "Контроль мяча и плотная посадка",
    description:
      "Классическая модель бутс для футбола с акцентом на комфорт, фиксацию стопы и уверенное касание."
  },
  "Бутсы Адидас ф50 цена 2800": {
    slug: "adidas-f50-boots",
    name: "Бутсы Adidas F50",
    price: "2 800 сом",
    priceValue: 2800,
    short: "Скоростная футбольная модель",
    description:
      "Легкие бутсы для динамичной игры и быстрых рывков. Хороший вариант для тренировок и матчей."
  },
  "Бутсы фантом 2800 цена": {
    slug: "phantom-boots",
    name: "Бутсы Phantom",
    price: "2 800 сом",
    priceValue: 2800,
    short: "Бутсы для атакующего стиля",
    description:
      "Футбольная модель с выразительным силуэтом и удобной посадкой для быстрых смен направления."
  },
  "Волейбольная обувь Асикс 3500 сом": {
    slug: "asics-volleyball-shoes",
    name: "Волейбольные кроссовки Asics",
    price: "3 500 сом",
    priceValue: 3500,
    short: "Амортизация и устойчивость в зале",
    description:
      "Зальная обувь для волейбола с надежным сцеплением и комфортом во время прыжков и резких остановок."
  },
  "Детские формы цена 600": {
    slug: "kids-sports-uniforms",
    name: "Детские спортивные формы",
    price: "600 сом",
    priceValue: 600,
    short: "Формы для секций и команды",
    description:
      "Подборка детских комплектов для тренировок, школьных секций и командных занятий."
  },
  "Джома Топ флекс цена 3000 сом": {
    slug: "joma-top-flex-indoor",
    name: "Joma Top Flex Indoor",
    price: "3 000 сом",
    priceValue: 3000,
    short: "Футзалки для зала",
    description:
      "Популярная модель футзалок с комфортной колодкой и цепкой подошвой для игр в зале."
  },
  "Кимоно ИТФ тхэквондо 2000 сом": {
    slug: "itf-taekwondo-gi",
    name: "Кимоно ITF тхэквондо",
    price: "2 000 сом",
    priceValue: 2000,
    short: "Форма для тренировок и выступлений",
    description:
      "Кимоно для занятий тхэквондо ITF с классическим кроем и аккуратной посадкой."
  },
  "Кимоно дзюдо 1600 сом": {
    slug: "judo-gi",
    name: "Кимоно для дзюдо",
    price: "1 600 сом",
    priceValue: 1600,
    short: "Плотная форма для дзюдо",
    description:
      "Базовое кимоно для тренировочного процесса и повседневных занятий в секции."
  },
  "Манежки цена 400 сом": {
    slug: "kelme-training-bibs",
    name: "Манишки Kelme",
    price: "400 сом",
    priceValue: 400,
    short: "Тренировочные манишки для команды",
    description:
      "Легкие манишки для деления на команды на тренировках, матчевых занятиях и сборах."
  },
  "Медали цена 140 сом": {
    slug: "sports-medals",
    name: "Спортивные медали",
    price: "140 сом",
    priceValue: 140,
    short: "Награды для турниров и соревнований",
    description:
      "Медали для школьных стартов, секционных турниров и спортивных мероприятий."
  },
  "Мячи цена от 500 до 5000 сом": {
    slug: "sports-balls",
    name: "Мячи для тренировок и игр",
    price: "от 500 до 5 000 сом",
    priceValue: 500,
    short: "Разные модели под формат занятий",
    description:
      "Подборка мячей для футбола и тренировочных занятий в разном ценовом диапазоне."
  },
  "Награды и кубки 1800 цена": {
    slug: "classic-award-cups",
    name: "Наградные кубки Classic",
    price: "1 800 сом",
    priceValue: 1800,
    short: "Кубки для турниров и награждений",
    description:
      "Набор наградных кубков для соревнований, школьных турниров и секционных мероприятий."
  },
  "Обрезки 200 сом": {
    slug: "football-socks",
    name: "Футбольные гетры",
    price: "200 сом",
    priceValue: 200,
    short: "Яркие гетры для тренировок и матчей",
    description:
      "Футбольные гетры разных цветов для тренировок, игры и командной экипировки."
  },
  "Перчатки бокс ТопТен 1200 цена": {
    slug: "top-ten-boxing-gloves",
    name: "Боксерские перчатки Top Ten",
    price: "1 200 сом",
    priceValue: 1200,
    short: "Перчатки для мешка и спаррингов",
    description:
      "Базовые боксерские перчатки для тренировок, постановки удара и начальной работы в зале."
  },
  "Перчатки вратарские Предатор цена 2000 сом": {
    slug: "predator-goalkeeper-gloves",
    name: "Вратарские перчатки Predator",
    price: "2 000 сом",
    priceValue: 2000,
    short: "Хват и защита для игры в воротах",
    description:
      "Вратарские перчатки для тренировок и матчей с комфортной посадкой и уверенным сцеплением."
  },
  "Сороконожки Аирзум 2000 цена": {
    slug: "air-zoom-turf",
    name: "Сороконожки Air Zoom",
    price: "2 000 сом",
    priceValue: 2000,
    short: "Универсальная turf-модель",
    description:
      "Сороконожки для мини-футбола и искусственного покрытия с удобной посадкой и стабильной подошвой."
  },
  "Сороконожки Аирзум 1500 сом": {
    slug: "air-zoom-turf-1500",
    name: "Сороконожки Air Zoom Lite",
    price: "1 500 сом",
    priceValue: 1500,
    short: "Бюджетная turf-модель для тренировок",
    description:
      "Легкие сороконожки для искусственного покрытия, школьных тренировок и любительских игр. Подойдут тем, кто ищет доступный вариант на каждый день."
  },
  "Сороконожки F50 1500 сом": {
    slug: "f50-turf-1500",
    name: "Сороконожки F50 Turf",
    price: "1 500 сом",
    priceValue: 1500,
    short: "Легкая модель для быстрых движений",
    description:
      "Сороконожки в скоростном стиле с тонким верхом и цепкой подошвой для тренировок на искусственном покрытии."
  },
  "Сороконожки Джома 3000 сом": {
    slug: "joma-turf-shoes",
    name: "Сороконожки Joma Turf",
    price: "3 000 сом",
    priceValue: 3000,
    short: "Устойчивость на искусственном покрытии",
    description:
      "Тренировочная turf-модель Joma для уверенного движения и стабильного сцепления на поле."
  },
  "Сороконожки Темпо 2000 цена": {
    slug: "tiempo-turf-shoes",
    name: "Сороконожки Tiempo Turf",
    price: "2 000 сом",
    priceValue: 2000,
    short: "Классический силуэт для тренировок",
    description:
      "Модель с комфортной колодкой и простым надежным профилем для искусственного покрытия."
  },
  "Сороконожки Унар гато 2200 цена": {
    slug: "lunar-gato-turf",
    name: "Сороконожки Lunar Gato",
    price: "2 200 сом",
    priceValue: 2200,
    short: "Контроль и мягкая посадка",
    description:
      "Удобная turf-модель для тех, кто ищет мягкую посадку и уверенное касание на тренировке."
  },
  "Борцовки 1500-2500 сом": {
    slug: "wrestling-shoes-mix",
    name: "Борцовки Wrestling Mix",
    price: "от 1 500 сом",
    priceValue: 1500,
    short: "Несколько моделей в одном диапазоне цен",
    description:
      "Подборка борцовок для тренировок и зальных покрытий. В наличии несколько вариантов в диапазоне от 1 500 до 2 500 сом."
  },
  "Формы взрослые цена 800": {
    slug: "adult-sports-uniforms",
    name: "Взрослые спортивные формы",
    price: "800 сом",
    priceValue: 800,
    short: "Формы для тренировок и команд",
    description:
      "Игровые и тренировочные комплекты для взрослых команд, секций и любительских лиг."
  },
  "Шейкеры цена 500 сом": {
    slug: "sports-shakers",
    name: "Шейкеры для спорта",
    price: "500 сом",
    priceValue: 500,
    short: "Удобные бутылки и шейкеры",
    description:
      "Практичные шейкеры для воды, изотоников и спортивного питания в дороге и на тренировке."
  },
  "Щитки 200 сом": {
    slug: "football-shin-guards",
    name: "Футбольные щитки",
    price: "200 сом",
    priceValue: 200,
    short: "Базовая защита для игры",
    description:
      "Компактные щитки для тренировок и матчей, которые помогают снизить ударную нагрузку."
  },
  "кубки 2500 сом": {
    slug: "premium-award-cups",
    name: "Кубки премиум",
    price: "2 500 сом",
    priceValue: 2500,
    short: "Крупные кубки для торжественных награждений",
    description:
      "Премиальные наградные кубки для крупных турниров, финалов и официальных церемоний."
  }
};

const featuredSlugs = [
  "adidas-predator-boots",
  "asics-volleyball-shoes",
  "venum-compression-pro",
  "joma-top-flex-indoor",
  "adult-sports-uniforms",
  "football-balls",
  "predator-goalkeeper-gloves",
  "premium-award-cups"
];

const productOverridesBySource = {
  "Мячи цена от 500 до 5000 сом": [
    {
      slug: "volleyball-ball",
      name: "Волейбольный мяч",
      price: "от 500 до 5 000 сом",
      priceValue: 500,
      short: "Один волейбольный мяч из наличия",
      description:
        "Волейбольный мяч для тренировок, любительской игры и занятий в зале.",
      categorySegments: ["Мячи", "Волейбольные"],
      assetPathSegments: ["Мячи", "Волейбольные", "Волейбольный мяч"],
      imageIndexes: [0]
    },
    {
      slug: "football-balls",
      name: "Футбольные мячи",
      price: "от 500 до 5 000 сом",
      priceValue: 500,
      short: "Модели для игр и тренировок",
      description:
        "Подборка футбольных мячей для тренировок, матчей и командных занятий.",
      categorySegments: ["Мячи", "Футбольные"],
      assetPathSegments: ["Мячи", "Футбольные", "Футбольные мячи"],
      imageIndexes: [1, 2, 3, 4]
    }
  ],
  "Джома Топ флекс цена 3000 сом": [
    {
      categorySegments: ["Обувь", "Борцовки"],
      assetPathSegments: ["Обувь", "Борцовки", "Джома Топ флекс цена 3000 сом"]
    }
  ]
};

const manualCategoryOrder = {
  "Мячи": ["Волейбольные", "Футбольные"],
  "Обувь": ["Сороконожки", "Бутсы", "Борцовки", "Волейбольная обувь"]
};

const transliterationMap = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya"
};

function compareByName(left, right) {
  return left.localeCompare(right, "ru", { numeric: true, sensitivity: "base" });
}

function compareLabelsWithManualOrder(parentPath, leftLabel, rightLabel) {
  const order = manualCategoryOrder[parentPath.join(" / ")] || manualCategoryOrder[parentPath.at(-1)] || [];
  const leftIndex = order.indexOf(leftLabel);
  const rightIndex = order.indexOf(rightLabel);

  if (leftIndex !== -1 || rightIndex !== -1) {
    if (leftIndex === -1) {
      return 1;
    }

    if (rightIndex === -1) {
      return -1;
    }

    if (leftIndex !== rightIndex) {
      return leftIndex - rightIndex;
    }
  }

  return compareByName(leftLabel, rightLabel);
}

function imageFiles(files) {
  return files.filter((fileName) => /\.(jpe?g|png|webp)$/i.test(fileName)).sort(compareByName);
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .split("")
    .map((character) => transliterationMap[character] ?? character)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "item";
}

async function readDirectoryEntries(directory) {
  return fs.readdir(directory, { withFileTypes: true });
}

async function collectProductFolders(directory = sourceRoot, relativeSegments = []) {
  const entries = await readDirectoryEntries(directory);
  const files = imageFiles(entries.filter((entry) => entry.isFile()).map((entry) => entry.name));
  const directories = entries.filter((entry) => entry.isDirectory()).sort((left, right) => compareByName(left.name, right.name));

  if (files.length > 0) {
    if (!relativeSegments.length) {
      throw new Error(`Товар не может лежать в корне exports: ${directory}`);
    }

    return [
      {
        absolutePath: directory,
        relativeSegments,
        sourceName: relativeSegments.at(-1),
        imageFiles: files
      }
    ];
  }

  const nested = await Promise.all(
    directories.map((entry) => collectProductFolders(path.join(directory, entry.name), [...relativeSegments, entry.name]))
  );

  return nested.flat();
}

function createCategoryNode(label, parentPath = []) {
  const pathLabels = [...parentPath, label];
  return {
    key: slugify(pathLabels.join("-")),
    label,
    description: parentPath.length ? `Подгруппа ${label}` : `Категория ${label}`,
    path: pathLabels,
    children: []
  };
}

function insertCategoryPath(tree, labels) {
  let level = tree;
  let parentPath = [];

  for (const label of labels) {
    let node = level.find((item) => item.label === label);

    if (!node) {
      node = createCategoryNode(label, parentPath);
      level.push(node);
    }

    parentPath = node.path;
    level = node.children;
  }
}

function pickImageFiles(imageFiles, imageIndexes, sourceName) {
  if (!Array.isArray(imageIndexes) || !imageIndexes.length) {
    return imageFiles;
  }

  const selectedFiles = imageIndexes.map((imageIndex) => imageFiles[imageIndex]).filter(Boolean);

  if (selectedFiles.length !== imageIndexes.length) {
    throw new Error(`Не найдены все нужные фото для папки товара: ${sourceName}`);
  }

  return selectedFiles;
}

function expandProducts(discovered) {
  const baseMeta = productMetaBySource[discovered.sourceName];

  if (!baseMeta) {
    throw new Error(`Нет метаданных для папки товара: ${discovered.sourceName}`);
  }

  const defaultCategorySegments = discovered.relativeSegments.slice(0, -1);
  const defaultAssetPathSegments = discovered.relativeSegments;
  const overrides = productOverridesBySource[discovered.sourceName];
  const productEntries = Array.isArray(overrides) && overrides.length ? overrides : [{}];

  return productEntries.map((override) => ({
    ...baseMeta,
    ...override,
    sourceName: discovered.sourceName,
    sourcePath: discovered.absolutePath,
    categorySegments: override.categorySegments || defaultCategorySegments,
    assetPathSegments: override.assetPathSegments || defaultAssetPathSegments,
    imageFiles: pickImageFiles(discovered.imageFiles, override.imageIndexes, discovered.sourceName)
  }));
}

async function copyProductImages(product, sourceFiles) {
  const targetDir = path.join(targetRoot, ...product.assetPathSegments);
  await fs.mkdir(targetDir, { recursive: true });

  const imageExt = path.extname(sourceFiles[0]).replace(".", "").toLowerCase() || "jpg";

  for (const [index, fileName] of sourceFiles.entries()) {
    const sourcePath = path.join(product.sourcePath, fileName);
    const currentExt = path.extname(fileName).replace(".", "").toLowerCase() || imageExt;

    if (currentExt !== imageExt) {
      throw new Error(`Mixed image extensions are not supported in ${product.sourcePath}`);
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

function sortCategoryTree(nodes, parentPath = []) {
  nodes.sort((left, right) => compareLabelsWithManualOrder(parentPath, left.label, right.label));
  nodes.forEach((node) => sortCategoryTree(node.children, node.path));
  return nodes;
}

async function buildCatalog() {
  await fs.mkdir(targetRoot, { recursive: true });

  const targetEntries = await fs.readdir(targetRoot, { withFileTypes: true });
  await Promise.all(
    targetEntries
      .filter((entry) => entry.isDirectory())
      .map((entry) => fs.rm(path.join(targetRoot, entry.name), { recursive: true, force: true }))
  );

  const discoveredProducts = await collectProductFolders();
  const categoryTree = [];
  const products = [];
  const seenSlugs = new Set();

  for (const discovered of discoveredProducts) {
    const productEntries = expandProducts(discovered);

    for (const entry of productEntries) {
      if (seenSlugs.has(entry.slug)) {
        throw new Error(`Дублирующийся slug: ${entry.slug}`);
      }

      seenSlugs.add(entry.slug);

      const { categorySegments, assetPathSegments } = entry;

      if (!categorySegments.length) {
        throw new Error(`Для товара ${entry.sourceName} не найдена категория.`);
      }

      insertCategoryPath(categoryTree, categorySegments);

      const topCategory = categorySegments[0];
      const leafCategory = categorySegments.at(-1);
      const { imageCount, imageExt } = await copyProductImages(entry, entry.imageFiles);
      const pricePrefix = entry.price.trim().startsWith("от ") ? "от" : undefined;

      products.push({
        slug: entry.slug,
        sourceName: entry.sourceName,
        name: entry.name,
        price: entry.priceValue,
        ...(pricePrefix ? { pricePrefix } : {}),
        categoryKey: slugify(topCategory),
        category: topCategory,
        groupKey: slugify(categorySegments.join("-")),
        group: leafCategory,
        categoryPath: categorySegments,
        categoryPathKeys: categorySegments.map((_, index) => slugify(categorySegments.slice(0, index + 1).join("-"))),
        short: entry.short,
        description: entry.description,
        imageCount,
        assetPath: assetPathSegments.join("/"),
        ...(imageExt !== "jpg" ? { imageExt } : {})
      });
    }
  }

  products.sort((left, right) => {
    const maxDepth = Math.max(left.categoryPath.length, right.categoryPath.length);

    for (let index = 0; index < maxDepth; index += 1) {
      const leftSegment = left.categoryPath[index];
      const rightSegment = right.categoryPath[index];

      if (leftSegment === rightSegment) {
        continue;
      }

      if (!leftSegment) {
        return -1;
      }

      if (!rightSegment) {
        return 1;
      }

      const categoryComparison = compareLabelsWithManualOrder(
        left.categoryPath.slice(0, index),
        leftSegment,
        rightSegment
      );

      if (categoryComparison !== 0) {
        return categoryComparison;
      }
    }

    return compareByName(left.name, right.name);
  });

  const data = {
    generatedAt: new Date().toISOString(),
    categories: sortCategoryTree(categoryTree),
    featuredSlugs,
    products
  };

  await fs.writeFile(outputFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

buildCatalog().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
