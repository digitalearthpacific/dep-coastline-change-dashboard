# DEP Shoreline Change Dashboard

An interactive web application that surfaces multi-year shoreline change insights for Pacific Island nations. The dashboard combines coastline time series, hotspot detection, population exposure, and environmental context so decision makers can explore risks and adaptation opportunities.

## Overview

- Built as a single-page React application with TypeScript and Vite for rapid development and hot module reloading.
- Uses MapLibre GL to render Digital Earth Pacific vector and raster tiles, including coastline change, hotspot polygons, mangroves, buildings, and population density layers.
- Applies responsive layout patterns so analysts can work on desktops, tablets, or small screens, with fullscreen mode for maximized map analysis.
- Supports drawing, measuring, and exporting hotspot selections to help communicate findings off-platform.

## Core Features

- Country search and map fly-to behavior powered by hosted GeoJSON metadata.
- Hotspot filtering by severity, date range controls, and toggleable layers for mangroves, buildings, and coastline visibility.
- Result panels summarizing shoreline retreat/growth, population exposure, and built environment metrics for the active country or custom geometry.
- Guided onboarding alert, glossary, and background information panes to contextualize datasets.

## Tech Stack

- React 19, React Router, and Context APIs for state management.
- MapLibre GL 5 and `react-map-gl` bindings for map rendering and interaction.
- Turf.js utilities for spatial filtering, bounding boxes, and polygon processing.
- Plotly.js visualizations embedded within dashboard cards.
- Radix UI themes and icons for accessible UI primitives.
- SCSS modules for component-scoped styling.

## Getting Started

### Prerequisites

- Node.js 18 LTS (minimum Node 16)
- npm (bundled with Node)

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables template and provide a MapTiler key:
   ```bash
   cp .env.sample .env
   ```
3. Edit `.env` and set `COASTLINE_APP_MAP_TILER_API_KEY` to a valid MapTiler API key.
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000 to access the dashboard (hot reload enabled).

### Environment Variables

- `COASTLINE_APP_MAP_TILER_API_KEY`: Required for fetching MapTiler base map styles used in the basemap selector. Keep this value in local `.env` files and in repository secrets for GitHub Pages deployments.

## npm Scripts

- `npm run dev` – Start the Vite development server.
- `npm run build` – Type-check and bundle the application for production output in `dist/`.
- `npm run preview` – Serve the production build locally for smoke testing.
- `npm run lint` – Run ESLint against the TypeScript/React source tree.
- `npm run lint:fix` – Lint with automatic fixes where possible.
- `npm run format` – Format TypeScript, JSX, and styles with Prettier.
- `npm run prepare` – Install Husky git hooks so lint-staged runs before commits.

## Data and Services

- Country list and metadata load from a hosted GeoJSON feed in Amazon S3.
- Coastline change, hotspot, mangrove, building, and population layers stream from Digital Earth Pacific tile services; no large datasets ship with the repo.
- MapTiler serves base maps (satellite, street, light, dark) selected via the map settings popover.

## Deployment

- Hosted via GitHub Pages at https://digitalearthpacific.github.io/dep-coastline-change-dashboard/.
- GitHub Actions workflow `.github/workflows/deploy-to-github-pages.yml` builds the project on pushes to `main` (or manual runs) and deploys `dist/` to Pages using the repository’s `MAP_TILER_API_KEY` secret.
- To redeploy manually, trigger the workflow from the Actions tab in GitHub.

## Support and Questions

- For access or administrative changes, contact Alex Leith.
- Data or product questions can be sent to the Digital Earth Pacific program team (dep@ga.gov.au).
- Report issues or feature requests via GitHub Issues so maintainers receive notifications.
