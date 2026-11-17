# SSC CGL Targets — always-on-top study widget

A tiny, frameless, always-on-top desktop widget for tracking daily SSC CGL study
targets. Built with **Tauri v2 + React 19 + TypeScript + Tailwind CSS v4**.

- Floats above browsers, PDFs and mock tests (pin/unpin any time).
- Add, tick, edit and delete targets; progress bar shows `4/7 completed · 57%`.
- Opacity slider so it never fully blocks what is underneath.
- Collapses into a floating **progress pill** to save screen space.
- Targets persist locally and automatically roll over unchecked on a new day.

---

## 1. Prerequisites (Windows 10/11)

| Tool | Why | Install |
| --- | --- | --- |
| **Node.js 20.19+ / 22.12+** (or newer LTS) | Vite + React build | <https://nodejs.org> |
| **Rust (stable, MSVC toolchain)** | compiles the Tauri shell | <https://rustup.rs> → `rustup default stable-msvc` |
| **Visual Studio Build Tools** | MSVC linker + Windows SDK (`link.exe`) | <https://visualstudio.microsoft.com/visual-cpp-build-tools/> → check **Desktop development with C++** |
| **WebView2 runtime** | renders the UI | preinstalled on Windows 11 and current Windows 10 (Edge) |

Verify in PowerShell:

```powershell
node -v
rustc --version
cargo --version
```

> Rust installs to `%USERPROFILE%\.cargo\bin`. If `cargo` is not found, close and
> reopen your terminal (or add that folder to `PATH`).

---

## 2. Initialize and run

```powershell
# from the project folder
npm install            # installs React, Vite, Tailwind and the Tauri CLI
npm run dev            # optional: UI only in the browser at http://localhost:1420
npm run desktop        # the real widget window (Rust + WebView2), hot reload on
```

`npm run desktop` is `tauri dev`: it starts Vite on port 1420, compiles the Rust
side (first run takes a few minutes) and opens the frameless widget.

### Feature cheat-sheet

| Action | Where |
| --- | --- |
| Add a target | Type in the input, press **Enter** (or the `+` button) |
| Complete a target | Click the checkbox (animated tick + strikethrough) |
| Edit a target | **Double-click** the text, or the pencil on hover; `Enter` saves, `Esc` cancels |
| Delete a target | Trash icon on hover |
| Pin / unpin on top | Pushpin button in the header (green = pinned) |
| Change opacity | Droplet button → slider (40–100%) or a preset |
| Collapse to a pill | Chevron-down button; chevron-up inside the pill expands it again |
| New study day | **New day** in the footer unchecks everything (kept: the target list) |
| Move the window | Drag the **header**, the progress area, the footer, or the pill |
| Resize | Drag any window edge (min 200 × 44 px; pill mode is 214 × 56) |

Targets saved as `Subject: detail` (e.g. `Maths: 50 Algebra Qs`) get a coloured
subject chip; the rest of the text is the detail.

---

## 3. Build the `.exe` installer

```powershell
npm run desktop:build      # = tauri build
```

Artifacts (x64):

```
src-tauri/target/release/bundle/nsis/SSC CGL Targets_1.0.0_x64-setup.exe   ← installer
src-tauri/target/release/bundle/msi/SSC CGL Targets_1.0.0_x64_en-US.msi    ← MSI
src-tauri/target/release/ssc-cgl-targets.exe                               ← portable exe
```

The NSIS installer defaults to a **current-user** install (`installMode`), so it
does not need admin rights. The first bundle run downloads the NSIS/WiX tooling, so
keep a network connection for that build.

Useful variants:

```powershell
npm run desktop:build -- --bundles nsis     # installer only
npm run desktop:build -- --no-bundle        # exe only, no installer
npm run desktop:build -- --debug            # unsigned debug build, much faster
```

---

## 4. Project structure

```
.
├─ index.html                      # Vite entry document
├─ package.json
├─ tsconfig.json / tsconfig.node.json
├─ vite.config.ts                  # fixed port 1420, chrome105 target, Tailwind plugin
├─ src/
│  ├─ main.tsx                     # React root
│  ├─ App.tsx                      # layout: expanded card or compact pill
│  ├─ index.css                    # Tailwind v4, transparent shell, checkbox/strike/range CSS
│  ├─ types.ts                     # Task + Settings types
│  ├─ components/
│  │  ├─ Header.tsx                # drag strip, pin / opacity / collapse / minimize / close
│  │  ├─ ProgressSummary.tsx       # "4/7 completed · 57%" + progress bar
│  │  ├─ AddTargetForm.tsx         # quick-add input
│  │  ├─ TargetList.tsx            # list + empty state
│  │  ├─ TargetItem.tsx            # checkbox, strikethrough, inline edit, delete
│  │  ├─ CompactPill.tsx           # collapsed floating pill
│  │  ├─ ProgressRing.tsx          # circular progress for the pill
│  │  ├─ OpacityPanel.tsx          # slider + presets popover
│  │  ├─ IconButton.tsx            # shared icon button
│  │  └─ icons.tsx                 # inline SVG icon set (no icon dependency)
│  ├─ hooks/
│  │  ├─ useTasks.ts               # add/edit/delete/toggle/reset + new-day rollover
│  │  ├─ useSettings.ts            # pin, opacity, compact — persisted
│  │  └─ useWindowSync.ts          # mirrors settings onto the native window
│  └─ lib/
│     ├─ tauri.ts                  # window API wrapper (no-op outside Tauri)
│     ├─ storage.ts                # localStorage helpers + date keys
│     └─ parse.ts                  # "Subject: detail" parsing + subject colours
└─ src-tauri/
   ├─ Cargo.toml                   # tauri = "2", size-optimised release profile
   ├─ tauri.conf.json              # frameless, transparent, alwaysOnTop, 380×560
   ├─ capabilities/default.json    # window permissions actually used
   ├─ icon-source.svg              # icon source for `npx tauri icon`
   ├─ icons/                       # .ico / .png / .icns app icons
   ├─ build.rs
   └─ src/
      ├─ main.rs                   # binary entry (no console window in release)
      └─ lib.rs                    # tauri::Builder with no extra plugins
```

---

## 5. How each requirement is wired

**Frameless + transparent window** — `src-tauri/tauri.conf.json`:
`decorations: false`, `transparent: true`, `shadow: true`, `width/height: 380×560`,
`minWidth/minHeight: 200×44`, `maximizable: false` (double-clicking the drag strip
cannot maximise a widget), `resizable: true`. The rounded card you see is the React
`<main>` element; the window itself paints nothing.

**Always on top** — `alwaysOnTop: true` in the config, then toggled at runtime by
`applyAlwaysOnTop()` in `src/lib/tauri.ts` via `getCurrentWindow().setAlwaysOnTop()`,
driven by `useWindowSync`. Requires `core:window:allow-set-always-on-top` in
`src-tauri/capabilities/default.json`.

**Dragging** — Tauri's `data-tauri-drag-region` attribute on the header, the progress
block, the footer and the whole pill. Task rows, buttons and inputs are deliberately
*not* drag regions so clicks still register, and the scrolling list is not a drag
region so the scrollbar keeps working.

**Opacity** — the React root gets `style={{ opacity }}` (40–100%), so content fades
while the window stays fully interactive. This is CSS-driven on purpose: Tauri v2
exposes no per-window opacity API on Windows, and CSS opacity composites correctly
over the desktop because the window is transparent.

**Compact pill** — switching `compact` resizes the native window to 214 × 56
(`COMPACT_WINDOW_SIZE`), remembers the previous size, and restores it on expand.
The pill shows a progress ring, `done/total` and the percentage.

**Persistence and rollover** — `useTasks`/`useSettings` write to `localStorage`
(WebView2 profile for the app, e.g.
`%LOCALAPPDATA%\com.ssccgl.targets\EBWebView\Default\Local Storage`). The saved
`YYYY-MM-DD` key is compared with today on load: if the day changed, the targets
carry over **unchecked** automatically.

**Accessibility** — checkboxes are `role="checkbox"` with `aria-checked`, the bar is
`role="progressbar"` with `aria-valuenow`, every icon button has an `aria-label`, and
`prefers-reduced-motion` disables the animations.

---

## 6. Customizing

| Want | Change |
| --- | --- |
| Different default size | `width`/`height` in `tauri.conf.json` **and** `DEFAULT_WINDOW_SIZE` in `src/lib/tauri.ts` |
| Different pill size | `COMPACT_WINDOW_SIZE` in `src/lib/tauri.ts` |
| Start unpinned | `"alwaysOnTop": false` in `tauri.conf.json` and `DEFAULT_SETTINGS` in `src/hooks/useSettings.ts` |
| Accent colour | `emerald`/`teal` classes in the components and `#10b981`/`#34d399` in `src/index.css` |
| App name / installer text | `productName`, `identifier`, `bundle.shortDescription` in `tauri.conf.json` |
| New icon | `npx tauri icon src-tauri/icon-source.svg` (regenerates `src-tauri/icons`) |

---

## 7. Troubleshooting

- **`link.exe not found` / `msvc not found`** — install Visual Studio Build Tools with
  *Desktop development with C++*, then reopen the terminal.
- **`failed to get cargo metadata`** — Rust is missing or not on `PATH`
  (`%USERPROFILE%\.cargo\bin`).
- **Port 1420 already in use** — stop the other Vite/`tauri dev` instance; the port is
  fixed on purpose (`strictPort: true`).
- **First build takes minutes** — normal: ~400 Rust crates compile once, then rebuilds
  are incremental.
- **Blank white window in dev** — the frontend was not ready; check the `npm run dev`
  output in the same terminal.
- **Pin toggle does nothing** — make sure
  `core:window:allow-set-always-on-top` is still listed in
  `src-tauri/capabilities/default.json`.
- **SmartScreen warning on the installer** — unsigned binary; click *More info →
  Run anyway*, or sign the bundle with a code-signing certificate for distribution.

## 8. Notes / limits

- Targets and settings live in the WebView2 `localStorage`, not in a database file.
  Clearing the app's webview data resets the widget.
- The window is not click-through (`ignore_cursor_events`); at low opacity it still
  receives clicks on the areas it covers. Use the pill mode or move it when a test
  needs the space underneath.
- Verified on this machine: `tsc` typecheck and the Vite production build. The Rust
  side and the Windows installers must be built on Windows with the toolchain above
  (it cannot be compiled on Linux/macOS from this project as shipped).
