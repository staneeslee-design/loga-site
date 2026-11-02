# Loga group — сайт + Payload CMS

Сайт автозапчастей Loga group в утверждённом дизайне. Все данные хранятся в **Payload CMS 3** (админка `/admin`), сайт работает на **Next.js 16** с серверным рендерингом (SEO), языки LT / EN / RU.

## Быстрый старт

Нужен Node.js 22.x (LTS) или новее.

```bash
cd loga-cms
npm install
npm run seed      # наполнит базу: тексты, DUK, 51 авто, 25 двигателей, 861 фото
npm run dev       # http://localhost:3000  ·  админка: http://localhost:3000/admin
```

- Логин и пароль администратора берутся из `.env` (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`). Seed печатает их в консоль. Смените пароль после первого входа.
- Seed берёт фото из `../Loga-site-handoff/photos`. Другой путь задаётся в `PHOTOS_DIR`.
- База — один файл `loga.db` (SQLite), загруженные фото лежат в папке `media/`.

Продакшен: `npm run build && npm start`. **Деплой на Hostinger:** см. [DEPLOY-HOSTINGER.md](DEPLOY-HOSTINGER.md).

---

## Что можно делать в админке

| Раздел | Что там |
|---|---|
| **Prietaisų skydelis** (главная админки) | Счётчики автомобилей, двигателей и новых заявок, последние заявки, быстрые кнопки. |
| **Katalogas → Automobiliai** | Добавить, изменить или удалить машину. Галерея: загрузка многих фото сразу (кнопка или перетаскивание с рабочего стола), смена порядка перетаскиванием или стрелками, кнопка ★ делает фото главным, ✕ убирает. Главное фото — первое, оно показывается в карточке. Флажки «Rodyti svetainėje» (показывать на сайте) и «Rodyti pagrindiniame puslapyje» (блок «Naujai ardomi automobiliai», до 4 машин). |
| **Katalogas → Varikliai** | Двигатели: то же самое, плюс цена и гарантия. |
| **Užklausos** | Все заявки с форм сайта: «Užklausa», «Rasti detalę», «Pasiūlyti automobilį», «Perskambinti». Статусы: nauja / vykdoma / atlikta, внутренние заметки. |
| **Turinys → Svetainės tekstai** | **Все тексты сайта** (около 300): меню, заголовки, кнопки, формы, футер, cookie-баннер. Поиск и фильтр по разделам. Язык переключается вверху справа («Lokalė»): сначала LT, потом EN и RU. |
| **Turinys → DUK** | Вопросы и ответы. Порядок меняется перетаскиванием строк, есть флажок «показывать». |
| **Turinys → Privatumas ir slapukai** | Тексты политики конфиденциальности и cookies по разделам, на каждом языке. |
| **Nustatymai → Kontaktai** | Телефон, e-mail, Viber, WhatsApp, адрес, ссылка на карту, название и код компании. Подставляются по всему сайту. `[ĮMONĖS PAVADINIMAS]` и `[KODAS]` в юридических текстах заменяются автоматически. |
| **Nustatymai → Pranešimai** | Куда отправлять заявки: **e-mail** (получатели + SMTP), **Telegram** (токен бота и chat ID), **Viber-бот**, **Webhook** (Make / Zapier / CRM / WhatsApp через Twilio). Можно включить несколько каналов сразу. |
| **Nustatymai → SEO** | Title и description страниц по языкам. |

После сохранения в админке сайт обновляется сразу (`revalidatePath`).

### Как подключить уведомления
- **E-mail (Gmail):** сервер `smtp.gmail.com`, порт `465`, SSL включён. Пользователь — ваш адрес Gmail, пароль — «пароль приложения» (Google → Безопасность → Пароли приложений).
- **Telegram:**
  1. В @BotFather выполните `/newbot` и скопируйте токен.
  2. Напишите своему боту любое сообщение.
  3. Откройте `https://api.telegram.org/bot<TOKEN>/getUpdates` — там будет `chat.id`.
  4. Для группы: добавьте бота в группу, ID группы начинается с `-`.
- **WhatsApp:** у WhatsApp нет простого бесплатного API. Включите Webhook и пересылайте заявки через Make / Zapier / Twilio WhatsApp.

---

## Как устроен код

```
src/
├── payload.config.ts        конфиг CMS: языки lt/en/ru, коллекции, глобалы, админка
├── collections/             Cars, Engines, Faq, Inquiries, UiStrings, Media, Users
├── globals/                 Settings (контакты, уведомления, SEO), Legal
├── fields/                  slug (уникальный, из названия), gallery (поле фото)
├── components/admin/        GalleryField (менеджер фото), Dashboard, Logo, CoverCell…
├── lib/
│   ├── site-data.ts         загрузка данных из Payload для страниц
│   ├── notify.ts            отправка заявок: e-mail / Telegram / Viber / webhook
│   └── revalidate.ts        обновление сайта после сохранения
├── app/
│   ├── (frontend)/[locale]/ страницы: /, /automobiliai, /automobiliai/[slug], /varikliai…, /privatumas
│   ├── (frontend)/inquiry/  POST-эндпоинт форм (валидация, анти-спам, лимит)
│   └── (payload)/           админка и REST/GraphQL API (/api)
├── site/                    вёрстка сайта из дизайна
│   ├── templates/*.html     разметка страниц ({{значения}}, <sc-if>, <sc-for>)
│   ├── css/*.css            стили страниц
│   ├── logic/*.js           логика страниц: фильтры, галерея, модальные окна, формы
│   ├── pages/*.tsx          клиентские компоненты страниц
│   └── runtime.tsx          рендерер шаблонов (SSR + гидратация, React)
└── seed/                    начальные данные и скрипт наполнения
```

- **URL:** литовский язык — без префикса (`/automobiliai/bmw-x5`), английский и русский — `/en/...` и `/ru/...`. Rewrites описаны в `next.config.ts`.
- **Тексты:** в шаблоне стоит литовский оригинал, а при рендере он заменяется текстом из «Svetainės tekstai» на нужном языке. Поле «Originalus tekstas (raktas)» — это ключ, его не меняют.
- **Разметка:** правьте `src/site/templates/*.html`. Перед `dev` и `build` они автоматически компилируются в `.json` (`npm run templates`).
- **Фото:** Payload генерирует размеры `thumb` (400×300), `card` (900×675) и `large` (1600). На сайте используются они.

## Перед запуском в интернет
1. В `.env` задайте свой `PAYLOAD_SECRET` и `NEXT_PUBLIC_SERVER_URL=https://ваш-домен`.
2. **База:** SQLite подходит для одного сервера (VPS). Для облака или нескольких серверов — `@payloadcms/db-postgres`: замените адаптер в `payload.config.ts`.
3. **Фото:** на VPS храните папку `media/` и делайте её бэкап. Для Vercel и подобных нужен `@payloadcms/storage-s3`.
4. Заполните «Nustatymai → Pranešimai», затем отправьте тестовую заявку с сайта.
5. Заполните название и код компании, а также `[ĮRANKIS]` (инструмент аналитики) и `[TERMINAS]` (срок хранения) в «Privatumas ir slapukai».
6. Аналитику (GA, Meta Pixel) подключайте только после согласия: выбор хранится в `localStorage['logaCookies']` (`{a: аналитика, m: маркетинг}`).
