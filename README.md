![](/images/app-icon-256x256.png)

TETRIS
=====================
A modern web-based remake of the legendary block-stacking puzzle game.

## About
Originally created in 1984 by Alexey Pajitnov. This is a faithful web remake built on the [svision](https://github.com/mitrenga/svision) engine, specifically designed to recreate the authentic look and feel of the classic 1987 Mirrorsoft (48K) release for the ZX Spectrum.

Supported:
- keyboard
- mouse
- gamepad
- touchscreen
- PWA application


## Requirements (Production)
- PHP 8.1+
- nginx
- MySQL / MariaDB
- Node.js + terser, for building the bundle (`npm i -g terser`)
- es-check, for the ES2018 compatibility gate in `svtool verify` (`npm i -g es-check`)


## Install (Linux / macOS)
(`~/` below refers to the project root, not your home directory.)
- clone this repository with its engine submodule: `git clone --recurse-submodules https://github.com/Filda4515/tetris-svision.git`
- *(if already cloned without submodules, run: `git submodule update --init`)*
- **(Optional - Shared Engine):** If you host multiple games and prefer using a shared engine via symlink instead of the submodule:
  - clone this repository normally: `git clone https://github.com/Filda4515/tetris-svision.git`
  - clone the library repository elsewhere: `git clone https://github.com/mitrenga/svision`
  - remove the empty submodule folder `rmdir ~/app/svision` and make a symlink: `ln -s /path/to/shared/svision ~/app/svision`
- configure nginx (example: `~/config/nginx.conf`)
- create path `~/js` with permissions 0777
- create database (script: `~/config/createDB.sql`)
- create configuration file `~/config/config.php` (example: `~/config/config.php.sample`)
- build the production bundle: `php app/svision/tools/svtool build bundle`

## Install (Windows local environment)
- clone this repository with its engine submodule: `git clone --recurse-submodules https://github.com/Filda4515/tetris-svision.git`
- *(if already cloned without submodules, run: `git submodule update --init`)*
- create database (script: `config/createDB.sql`)
- create configuration file `config/config.php` (example: `config/config.php.sample`)
- build the production bundle: `windows_svtool.bat build bundle`


## Developer mode
Developer mode is switched in `~/config/config.php` (both settings are optional; without them the app runs in production mode):

```php
$devMode = true;
$devModeName = '.{\"penColor\":\"#000000\",\"bkColor\":\"#fefe00\",\"width\":185}◢◤ ◢◤ ◢◤ ◢◤  DEVELOPER MODE ◢◤ ◢◤ ◢◤ ◢◤';
```

`$devMode` values:
- `true` — development: JS sources are served directly instead of the bundle and the service worker is unregistered/bypassed.
- `['serviceWorker' => true]` — development, but the service worker stays enabled (for testing SW behavior against a built `js/` deploy).
- `false` or not set — production: minified bundle + service worker.

`$devModeName` is a label rendered in the top border of the game screen, so a development instance is recognizable at a glance. Set it to `false` (or leave it empty) to hide the label. The value is either plain text, or text prefixed with `.{...}` — a JSON object whose properties are applied to the label's TextEntity, typically:
- `penColor` — text color
- `bkColor` — background color
- `width` — label width in game pixels (the text is centered inside it)

The config is written into a double-quoted JavaScript string, so quotes inside the JSON prefix must be escaped as `\"` (see the example above).


## Build & tooling
The `svtool` CLI (`~/app/svision/tools/svtool`) builds and checks the deploy. Run it from the project root. On Windows, substitute svtool with the provided windows_svtool.bat wrapper:
- `svtool build bundle` — minified production bundle `js/bundle.<version>.min.js` (requires terser)
- `svtool build import-from` — source mirrors in `js/` for browsers without dynamic `import()` (e.g. older devices)
- `svtool verify` — check the `js/` deploy is complete, matches the current sources, and stays within ES2018 (authoritative via es-check if installed, otherwise a heuristic scan)
- `svtool info` — show the app version, deploy state and the most recent database records
- `svtool clean` — remove everything generated from `js/`

Optional (Linux / macOS) — run `svtool` from anywhere and enable bash completion (adjust the path to your svision clone):
- `sudo ln -s /path/to/svision/tools/svtool /usr/bin/svtool`
- `sudo ln -s /path/to/svision/tools/svtool-completion.bash /etc/bash_completion.d/svtool`

Open a new shell afterwards, then run `svtool <command>` from any project root.

Production serves the bundle; in development the sources are served directly (await-import) or as mirrors (import-from).

## License
See the [LICENSE](LICENSE) file.