# Facial Expression Game for XToys

This web application uses your camera to detect facial expressions and sends corresponding data (like emotion, intensity, mouth/eye state) to XToys via its cloud webhook service using your Webhook ID. It also includes a simple game to track how long you hold certain expressions and states.

## How to Use

1.  **Open the HTML File:** Simply open the `index.html` (or the name of the HTML file) in a modern web browser that supports camera access (like Chrome, Firefox, Edge).
2.  **Enter Your XToys Webhook ID:**
    * In the "Settings" section, find the input field labeled "XToys Webhook ID."
    * Enter the Webhook ID you obtained from the XToys cloud service. This is necessary for the app to communicate with your XToys account.
    * The application shows an example image (`xtoys_api_key_example.png` - make sure this image is in the same directory as the HTML file) to help you locate where to find this key on the XToys service's interface.
3.  **Select CDN (Optional):**
    * The application uses a CDN (Content Delivery Network) to load the `face-api.js` library for facial recognition.
    * "jsDelivr" is selected by default and is generally reliable. If you encounter issues loading the library (check the status messages or browser console), you can try switching to "Unpkg" or "GitHack" and clicking "Reload Library."
4.  **Select Camera (Optional):**
    * The application will attempt to list available cameras.
    * If you have multiple cameras, select your preferred one from the "Select Camera" dropdown.
    * Click "Refresh Camera List" if your camera doesn't appear initially or if you plug in a new one. If no camera is selected, it will try to use the default system camera.
5.  **Start the Camera:**
    * Once the library is loaded (status message will indicate "Ready..."), click the "Start Camera" button.
    * Your browser will likely ask for permission to access your camera. Please allow it.
6.  **Facial Detection & XToys Communication:**
    * The app will start detecting your face and expressions.
    * The "Live Status" section will show the detected stable emotion, its ID, mouth/eye state, and the calculated intensity being sent to XToys.
    * Data is sent to the XToys cloud webhook based on the "Update Interval" setting or when significant changes in expression/state occur.
7.  **Expression Game (Optional):**
    * Click "Start Expression Game" to begin tracking time spent in various states (Happy, Surprised, Mouth Open/Closed, Eyes Open/Closed).
    * A simple score is calculated based on "Time Mouth Closed" + "Time Happy."
    * Use "Stop Game" and "Reset Game Stats" as needed.
8.  **Test Webhook (Optional):**
    * Click "Test XToys Cloud Webhook" to send a predefined test signal to XToys. This helps verify your Webhook ID and connection.
9.  **Stop Detection:**
    * Click "Stop Camera" to turn off facial detection and release the camera.

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
