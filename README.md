# AutoLuxe — Company Cars Showroom

A premium, animated car sales website built with **React + TypeScript + Vite**, ready to be tested with **Jenkins**.

## Features

- Cinematic hero: car flies in with motion blur, speed streaks, spinning wheels, floating glow
- Hand-drawn SVG cars (no image assets), recoloured per model
- Showroom catalog with category filter, search and sorting
- 3D tilt cards, detail modal and test-drive request form
- Responsive layout, keyboard accessible, respects `prefers-reduced-motion`
- Vitest + Testing Library test suite

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck
npm test
npm run build
```

## Jenkins setup

1. Install plugins: **Pipeline**, **Docker Pipeline**, **JUnit**, **Timestamper**, **Workspace Cleanup**
   (or **NodeJS** instead of Docker Pipeline).
2. Push this project to Git (GitHub, GitLab, Bitbucket).
3. In Jenkins: **New Item → Pipeline** (or **Multibranch Pipeline**).
4. Under *Pipeline*, choose **Pipeline script from SCM**, set your repo URL and keep **Script Path** as `Jenkinsfile`.
5. Click **Build Now**.

### Pipeline stages

| Stage     | Command             | Result                           |
| --------- | ------------------- | -------------------------------- |
| Install   | `npm ci`            | Reproducible dependencies        |
| Typecheck | `npm run typecheck` | TypeScript errors fail the build |
| Test      | `npm run test:ci`   | JUnit report in Jenkins UI       |
| Build     | `npm run build`     | Production bundle in `dist/`     |
| Archive   | `archiveArtifacts`  | Downloadable build artifact      |

### Using the NodeJS plugin instead of Docker

1. **Manage Jenkins → Tools → NodeJS → Add NodeJS**, name it `node24`, version 24.x.
2. In the `Jenkinsfile`, replace the `agent { docker { ... } }` block with:

```groovy
agent any
tools { nodejs 'node24' }
```

## Project structure

```
src/
  components/   Header, Hero, Catalog, CarCard, CarModal, CarArt, Footer
  data/cars.ts  Car inventory + price formatter
  test/setup.ts Testing Library setup
  App.test.tsx  UI tests
Jenkinsfile     CI pipeline
```

## Using real car photos

Every car can show a real photo or render instead of the built-in SVG drawing:

1. Put the image in `public/cars/` (for example `public/cars/titan-x.jpg`).
2. In `src/data/cars.ts`, add `image: '/cars/titan-x.jpg'` to that car.

Cars without an `image` keep the SVG drawing. The hero image is `public/images/hero-car.png`
(647×360). For sharp results on large screens, use images at least 1600 px wide.
Only use photos you own or have a licence to use.

## 3D cars

Opening a car shows a 3D viewer (three.js): drag to rotate, scroll to zoom, it auto-rotates when idle.
The built-in cars are original, procedurally generated shapes (supercar, SUV, sedan, EV) in `src/three/buildCar.ts`.
They are stylised, not photoreal. If WebGL is unavailable, the viewer falls back to the 2D drawing.

### Get a photoreal car: use your own .glb model

1. Get a car model in glTF binary format (`.glb`) that you own or are licensed to use
   (for example from Sketchfab with a CC-BY licence, or a model you bought). Keep it under ~15 MB.
2. Put it in `public/models/`, for example `public/models/titan-x.glb`.
3. In `src/data/cars.ts`, add `model: '/models/titan-x.glb'` to that car.

The viewer automatically scales and centres the model and adds studio lighting and a turntable.
Cars without a `model` keep the built-in 3D shape. Credit the model author if the licence requires it.
