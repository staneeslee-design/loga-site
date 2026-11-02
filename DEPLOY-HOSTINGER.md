# Деплой на Hostinger (Node.js Web App)

Нужен тариф Hostinger, в котором есть **Node.js Web Apps**: Business или Cloud.

В пакете два файла:

| Файл | Что внутри | Куда загружать |
|---|---|---|
| `loga-site-hostinger.zip` | код сайта и админки, без node_modules | hPanel → Node.js Web App → Upload files |
| `loga-data.zip` | база `loga.db` и папка `media/` с фото (текущие данные с вашего Mac) | File Manager → папка `loga-data` рядом с сайтом |

> **Почему данные отдельно.** Hostinger при каждом деплое собирает приложение в новую папку (`hbuilds/...`). Если база и фото лежат внутри приложения, они пропадут при следующем обновлении. Поэтому они хранятся в отдельной папке `loga-data`, и пути к ней задаются в переменных окружения.

---

## 1. Загрузить данные

1. hPanel → **Files → File Manager**. Откройте папку домена `domains/ВАШ-ДОМЕН/`. Полный путь вверху будет вида `/home/u123456789/domains/loga.lt/`.
2. Создайте в ней папку **`loga-data`**.
3. Загрузите в неё `loga-data.zip` и распакуйте (правый клик → Extract). Должно получиться:
   ```
   /home/u123456789/domains/loga.lt/loga-data/loga.db
   /home/u123456789/domains/loga.lt/loga-data/media/...
   ```
4. Запишите полный путь к `loga-data`: он понадобится в шаге 2.

## 2. Создать Node.js приложение

1. hPanel → **Websites → Add Website → Node.js Web App → Upload your files**.
2. Загрузите `loga-site-hostinger.zip`.
3. Проверьте настройки сборки. Обычно Hostinger определяет их сам:
   - Framework: **Next.js**
   - Node.js version: **22**
   - Root directory: `/`
   - Build script: **`build`**
   - Output directory: **`.next`**
   - Package manager: **npm**
4. **Environment variables.** Подставьте свой путь и домен:

   ```
   PAYLOAD_SECRET=__ВСТАВЬТЕ_ДЛИННУЮ_СЛУЧАЙНУЮ_СТРОКУ__
   DATABASE_URL=file:/home/u123456789/domains/loga.lt/loga-data/loga.db
   MEDIA_DIR=/home/u123456789/domains/loga.lt/loga-data/media
   NEXT_PUBLIC_SERVER_URL=https://loga.lt
   ```
   - `PAYLOAD_SECRET` можно взять из файла `.env` в папке `loga-cms` на вашем Mac. Если его поменять, все будут разлогинены, больше ничего не изменится.
   - В `DATABASE_URL` после `file:` нужен **абсолютный путь**: он начинается с `/home/...`.
5. Нажмите **Deploy**. Сборка занимает 2–5 минут, логи видны в разделе Deployments.

## 3. Проверить

- Сайт: `https://ВАШ-ДОМЕН/`
- Админка: `https://ВАШ-ДОМЕН/admin`. Логин и пароль те же, что на вашем Mac. Смените пароль после первого входа.
- Отправьте тестовую заявку с сайта. Она должна появиться в «Užklausos».
- Заполните **Nustatymai → Pranešimai** (e-mail, Telegram).

---

## Обновление сайта

Загрузите новый `loga-site-hostinger.zip` в то же приложение (Deployments → Redeploy или новая загрузка). Папку `loga-data` не трогайте: база и фото сохранятся.

## Бэкап

Регулярно скачивайте папку `loga-data` (File Manager → Compress → Download). В ней весь контент: машины, тексты, заявки и фото.

## Если нужна чистая база вместо загрузки `loga-data.zip`

Нужен SSH (hPanel → Advanced → SSH Access):
```bash
cd ~/domains/ВАШ-ДОМЕН/hbuilds/current/nodejs     # папка приложения
export DATABASE_URL=file:/home/u123456789/domains/loga.lt/loga-data/loga.db
export MEDIA_DIR=/home/u123456789/domains/loga.lt/loga-data/media
export PAYLOAD_SECRET=... SEED_ADMIN_EMAIL=admin@loga.lt SEED_ADMIN_PASSWORD=... PHOTOS_DIR=/путь/к/photos
npm run seed
```

## Если что-то не так

| Симптом | Причина / решение |
|---|---|
| Сборка падает на `sharp` или `libsql` | Выберите Node.js 22 и нажмите Redeploy. |
| Сайт открывается, но без машин, ошибка `no such table` | Неверный `DATABASE_URL`: путь должен быть абсолютным и указывать на существующий `loga.db`. |
| Фото не грузятся (404 на `/api/media/file/...`) | Неверный `MEDIA_DIR` или `media/` распакована не в `loga-data`. |
| После входа в админку снова просит логин | Проверьте, что `NEXT_PUBLIC_SERVER_URL` совпадает с адресом сайта (https). |
| Не хватает памяти при сборке | В тарифе мало RAM для `next build`. Используйте тариф Cloud или VPS. |

## Альтернатива: Hostinger VPS

```bash
# Ubuntu, Node 22 + pm2
git clone … или распакуйте loga-site-hostinger.zip в /var/www/loga
cd /var/www/loga && npm ci && npm run build
cp .env.example .env   # заполнить: DATABASE_URL=file:/var/www/loga-data/loga.db, MEDIA_DIR=/var/www/loga-data/media …
pm2 start npm --name loga -- start && pm2 save
# nginx: proxy_pass http://127.0.0.1:3000; client_max_body_size 30m;
```
