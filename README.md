## Что внутри

- главная страница с реальными товарами: [main/index.html](/home/dastan/Desktop/streetwear-store/main/index.html)
- отдельная страница товара с галереей: [main/product.html](/home/dastan/Desktop/streetwear-store/main/product.html)
- конфиг магазина и WhatsApp: [main/data.js](/home/dastan/Desktop/streetwear-store/main/data.js)
- JSON-каталог товаров: [main/assets/catalog/catalog.json](/home/dastan/Desktop/streetwear-store/main/assets/catalog/catalog.json)
- логика главной страницы: [main/script.js](/home/dastan/Desktop/streetwear-store/main/script.js)
- логика страницы товара: [main/product.js](/home/dastan/Desktop/streetwear-store/main/product.js)
- общие хелперы: [main/shared.js](/home/dastan/Desktop/streetwear-store/main/shared.js)
- стили: [main/styles.css](/home/dastan/Desktop/streetwear-store/main/styles.css)

## Формат товара

Фото товара лежат в папке:

- [main/assets/catalog](/home/dastan/Desktop/streetwear-store/main/assets/catalog)

Пример записи в `catalog.json`:

{
  "slug": "adidas-predator-boots",
  "name": "Бутсы Adidas Predator",
  "price": 2800,
  "categoryKey": "footwear",
  "short": "Контроль мяча и плотная посадка",
  "description": "Классическая модель бутс для футбола.",
  "imageCount": 3
}
