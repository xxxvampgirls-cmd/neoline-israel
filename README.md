# NEOLINE Israel — структура проекта

Рабочий сайт: https://neoline-israel.pages.dev/  
Основная ветка: `main`. Перед оптимизацией 18.11.2026 создана **полная резервная ветка**
[`backup/2026-11-18-before-full-cleanup`](https://github.com/xxxvampgirls-cmd/neoline-israel/tree/backup/2026-11-18-before-full-cleanup).

## Страницы

| Страница | Содержание |
| --- | --- |
| `index.html` | Главная, каталог, рекламные слайды, корзина |
| `news.html` | Новости Израиля и 30-дневный график публикаций о ДТП |
| `hot.html` | Срочные сообщения полиции, 72-часовая лента и Waze |
| `delivery.html` | Карта точек выдачи, магазинов и фильтры |
| `teoria.html` | Учебная игра «Теория вождения» |

Шапка общая: `site-header.css`, `site-header.js`, `assets/flag-israel.svg`.
Нижнее меню: `nav-current.css`, `nav-current.js`.

## Данные и автообновление

- Каталог: `assets/catalog/catalog.json`, `scripts/sync_catalog.py` и workflow `sync-catalog.yml`.
- Новости: `assets/news/news.json`, `scripts/sync_news.py`, `scripts/build_news_thumbnails.py`, workflow `sync-news.yml`.
- Точки доставки: `assets/pickup/points.json`, `scripts/sync_pickup_points.py`, workflow `sync-pickup-points.yml`.
- Магазины: `assets/retail/points.json`, `scripts/sync_retail_points.py`, workflow `sync-retail-points.yml`.
- Игра: `assets/teoria/{ru,he,en}.json`, workflow `sync-teoria.yml`.
- Срочные события: данные полиции в отдельной ветке `traffic-live`, workflow `sync-traffic.yml`.

Карта отображает только доступные координаты OSM. Сведения о продавцах не подтверждают партнёрства.
График ДТП показывает **количество уникальных публикаций**, а не реальное число аварий. Не дополнять график страховыми данными без устойчивых идентификаторов происшествий.
Прозрачные фотографии `assets/transparent/` — используемые изображения, не удалять.

## Обслуживание

1. Перед удалением файлов создавать отдельную резервную ветку из актуального `main`.
2. Не удалять картинки `assets/catalog/images/` и `assets/news/images/` по совпадающему хешу: все текущие пути используются в JSON. Если внедряется дедупликация — обновлять и генератор, и манифест одновременно.
3. При изменениях проверять `node --check` для JS, ссылки на ассеты и GitHub Actions. Обновлять параметр `?v=` у изменённых ресурсов для сброса кеша Cloudflare.
4. Публичную публикацию Cloudflare подтверждать отдельно; коммит в GitHub не доказывает, что новая версия уже доступна на сайте.

Хронология предыдущих пробных итераций и исходный `CURRENT_TASK.md` полностью сохранены в резервной ветке.
