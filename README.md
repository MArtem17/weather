# Nuxt 3 Service Weather
Использованы зависимости:
vuetify - для использования компонентов vuetify на frontend
mdi - подключен набор иконок
prisma -для подключения и работы с базой данных PostgreSQL
axios - для запросов клиент-сервер

Список избранного доступен только в автороизованном режиме
Для проверки авторизации используется SessionStorage
Для хранения истории запросов и контроля количества запросов используется LocalStorage
Данные о пользователях хранятся в базе данных PostgreSQL в таблице users
Для поиска погоды в городе необходимо указать название города в текстовом поле и нажать на значок поиска

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
