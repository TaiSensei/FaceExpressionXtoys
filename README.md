# Facial Expression Game for XToys + Motorbunny

This web application uses your camera to detect facial expressions and drives a toy in one of three ways:

* **XToys cloud webhook** — original behaviour. Sends emotion / intensity params to your XToys webhook.
* **Local webhook URL** — same params, posted to any local HTTP endpoint.
* **Bluetooth (Motorbunny direct)** — *new on the `taisensei` branch.* Drives a Motorbunny Classic directly over Web Bluetooth, no XToys or internet required.
* **XToys + Bluetooth (both)** — sends webhook params *and* writes BLE vibration in parallel.

It also includes a configurable "smile contest" round where intensity ramps up over the round duration and decays whenever the smile criterion breaks.

## What's new on `taisensei`

* **Direct Motorbunny BLE control** via the Web Bluetooth API (Chrome / Edge / Opera on desktop, Android Chrome). No XToys subscription needed for local-only play. The browser pairs with a device advertising the name `MB Controller`, writes to characteristic `0000fff6-…` on service `0000fff0-…`, and uses the 17-byte vibrate / 6-byte stop packets from the open Motorbunny protocol.
* **Configurable round system.** Set the round duration (default **180 s**), start intensity (default **3 %**) and end intensity (default **100 %**) in *Settings → Round & Intensity*. The toy ramps linearly from start → end across the round.
* **Smile-break decay.** When the smile criterion is enabled but currently broken, the live intensity bleeds at a configurable rate (default **1 % / second**) until the user resumes smiling, at which point it recovers toward the ramp target. Configurable in *Settings → Smile-break decay*.
* **Per-criterion scoring checkboxes** for Eyes / Smile / Brows / Expression-lock / Head-still — all on by default. Untick to ignore a criterion both for scoring and for the smile-break logic.
* **Neutral baseline capture.** Press *Capture Neutral Baseline* (Game Controls panel), hold a relaxed face through the 3-2-1 countdown, and the app records your personal neutral brow-height and mouth-width ratios. After that, "smile" and "brows raised" are evaluated as *deltas vs your baseline* instead of fixed thresholds — much more reliable across face shapes and camera angles.

## How to Use

1. **Open `index.html`** in a modern browser (Chrome / Edge recommended — Web Bluetooth only works there).
2. **Choose Output Mode** in *Settings → Output Mode*:
   * *Cloud (XToys)* — paste your XToys Webhook ID below.
   * *Local Server* — set the local URL (default `http://localhost:3000/webhook`).
   * *Bluetooth (Motorbunny direct)* — click **Connect** and pick `MB Controller` from the browser's BLE picker. Pair the toy in your OS first if needed.
   * *XToys + Bluetooth* — both at once.
3. **Start Camera** (after models load). Allow camera permission.
4. *(Optional)* Press **Capture Neutral Baseline** with a relaxed face for adaptive smile/brow detection.
5. *(Optional)* Press **Lock Expression** to set the Expression-Lock criterion to whatever face you make.
6. **Start Game** → enter player name → the round runs for the configured duration. The score is the sum of *active seconds* across enabled criteria.
7. **Stop Game** at any time. The toy stops automatically when the round ends or the camera is stopped.

## Running locally

For full functionality (especially **Bluetooth — Web Bluetooth requires a secure context**), don't open `index.html` with `file://`. Serve it over `http://localhost`:

```powershell
# any of these works — pick whichever is installed
python -m http.server 8080
# or
npx --yes http-server -p 8080
```

Then visit <http://localhost:8080/>. Cloud / Local-webhook modes work from `file://` too, but Web Bluetooth (Motorbunny) and camera permissions are happier on `http://localhost`.

## Per-branch GitHub Pages previews

This repo ships `.github/workflows/pages-per-branch.yml`, which publishes every pushed branch into its own subfolder of a shared `gh-pages` branch. Once Pages is enabled (Settings → Pages → Source: **Deploy from a branch**, branch: **`gh-pages`**, folder: `/ (root)`), each branch is reachable at:

```
https://<owner>.github.io/<repo>/<branch>/
```

e.g. `https://taisensei.github.io/FaceExpressionXtoys/taisensei/`. The root of the Pages site shows an auto-generated index of every published branch.

> The workflow needs `Settings → Actions → General → Workflow permissions = Read and write` so it can push to `gh-pages`.

## Detected Emotions and IDs


The application can detect the following facial expressions and sends a corresponding numeric ID:

* **neutral:** ID `0`
* **happy:** ID `1`
* **sad:** ID `2`
* **angry:** ID `3`
* **fearful:** ID `4`
* **disgusted:** ID `5`
* **surprised:** ID `6`

## XToys Script Integration

This application sends data as URL query parameters to the XToys cloud webhook using your Webhook ID. Your XToys script should be set up to use the "Webhook" trigger and then use the `GetData` action to read these parameters.

Example parameters sent:
* `intensity`: (0-100)
* `emotion`: (e.g., "happy", "surprised") - Text name of the emotion.
* `emotionId`: (numeric ID, e.g., 1 for happy) - As listed in the "Detected Emotions and IDs" section.
* `mouthOpen`: (1 for open, 0 for closed)
* `eyesOpen`: (1 for open, 0 for closed)
* `mouthRatio`: (numeric ratio of mouth openness)
* `avgEAR`: (numeric average Eye Aspect Ratio)

You can use these values in your XToys script to control toy intensity, trigger patterns, or create other interactive experiences. Refer to the XToys documentation and your example script for how to utilize this data. The example script you've provided at `https://xtoys.app/scripts/FacialExpression` is a great reference.

## Troubleshooting

* **Stuck on "Initializing..." or "Loading library...":**
    * Check your internet connection.
    * Try a different CDN provider and click "Reload Library."
    * Open your browser's developer console (usually F12) for error messages.
* **Image for Webhook ID Example Not Showing:**
    * Ensure the image file (e.g., `xtoys_api_key_example.png`) is in the same directory as the HTML file in your repository. If it's in a subfolder, the path in the HTML needs to be updated (e.g., `images/xtoys_api_key_example.png`).
* **Camera Not Starting:**
    * Ensure you've granted camera permissions to your browser for this page.
    * Try selecting a different camera from the dropdown or refreshing the list.
    * Make sure no other application is exclusively using your camera.
* **XToys Not Responding:**
    * Double-check your XToys Webhook ID.
    * Verify your XToys script is active and correctly set up to use the webhook and `GetData`.
    * Check the "Activity Log" in the app and your browser's developer console for any errors related to sending data.

Enjoy!
