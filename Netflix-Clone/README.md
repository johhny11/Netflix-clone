# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Environment

Create a `.env.local` file before running the app and add your TMDB v4 read access token:

```env
VITE_TMDB_READ_ACCESS_TOKEN=your_tmdb_v4_read_access_token
```

Vite exposes `VITE_` values to browser code, so use a backend proxy or serverless function before treating the TMDB token as private in production.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
