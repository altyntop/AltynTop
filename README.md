## ALTYNTOP catalog

- сайт запускается из `docs/`
- локальный запуск: `npm start`
- пересобрать каталог: `npm run catalog:generate`
- обновить версии ассетов в HTML: `npm run sync:pages`

## Как теперь устроен каталог

- источник фото: `/home/dastan/Desktop/tg-media-folder-bot/exports`
- структура папок = структура каталога
- папка верхнего уровня = категория
- папка внутри категории = подгруппа
- папка внутри подгруппы = товар с фото

Пример:

```text
exports/
  Обувь/
    Бутсы/
      Бутсы Адидас Предатор 2800 цена/
        01.jpg
```

## Что попадает в `catalog.json`

- дерево `categories` собирается из названий папок
- у товара сохраняются `category`, `group`, `categoryPath`, `categoryPathKeys`
- картинки копируются в `docs/assets/catalog/<category>/<group>/<slug>/`

## Важно

- группы больше не нужно вручную прописывать в JSON
- если добавить новую подгруппу папкой, сайт увидит ее после `npm run catalog:generate`
- текстовые метаданные товара пока остаются в `scripts/generate_catalog.mjs`
