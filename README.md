# Audiotron3000 Soundboard App

![alt text](https://github.com/mattgipson/soundboard-msg317/blob/main/public/images/soundboard-screenshot.png?raw=true)

A **React/Next.js** project featuring a customizable soundboard with a **retro audio visualizer**. It allows users to drag-and-drop audio files onto a fully mapped QWERTY keyboard, then play sounds via mouse clicks or keystrokes. The equalizer provides a **Winamp-style** bouncy animation with peak caps and neon aesthetics.

---

## Features

- **Full QWERTY Layout**: Over 30 keys assigned; each can hold a separate audio file.  
- **Default Sounds**: Pre-configured with several example `.wav` files mapped to the first few keys.  
- **Drag & Drop**: Quickly override a key’s audio file by dropping a file onto it.  
- **Retro Equalizer**: Animated visualizer with bouncy bars, lingering peak caps, and neon gradients.  
- **One-Sound-at-a-Time** (optional): Pauses other sounds automatically if you want strictly single playback.  
- **Keyboard Press or Click**: Trigger audio with either physical keyboard or UI button.  

---

## Technical Stack

- **Next.js**: Renders the main React application and handles routing/build.  
- **React Hooks**: Manages component state, side effects, and references to `<audio>` elements.  
- **Web Audio API**: Facilitates real-time audio analysis and visualization.  
- **HTML5 Audio**: Each keyboard button corresponds to an `<audio>` element.  
- **Bulma (optional)**: Can be used for quick UI styling and layout helpers.  
- **CSS** / Custom JS for the **Winamp-style** neon bars.

---

## Requirements

- **Node.js** (LTS recommended)  
- **npm** (or **yarn**) for dependencies  
- **Modern Browser** with Web Audio support

---

## Installation & Setup

1. **Clone** the repository:
   ```bash
   git clone https://github.com/username/soundboard-app.git
   cd soundboard-app

2. Install dependencies:
    ```bash
    npm install

3. Run locally:
    ```bash
    npm run dev

4. Open http://localhost:3000 in your browser to load the app.

## Usage

- Drop a file onto any key to assign a custom sound.
- Press that key on your keyboard or click the on-screen button to trigger playback.
- Watch the equalizer respond in real time.
- Customize code or styles to your liking (e.g., add default sounds, tweak visualizer, etc.).

## Notes

- Make sure your audio file paths match your setup (by default, files go in public/sounds/).
- The equalizer uses the Web Audio API; it may remain silent if the browser’s audio context is blocked (common until user interaction).
- For multi-sound overlap or single-sound mode, modify the handlePlay logic in Soundboard.js.

## Roadmap

- Refactor CSS (change to SCSS, add variables and tokens for better themeing)
- Replace "start soundboard" button with better solution
- Improve visualizer design/function and Speakers animations
- Improve UI
- Extend audio options with UI toggles (TBD)
- Host a demo for this project
- Make visuazlier easier to theme 
- Much more TBD

## License

MIT License - Feel free to use and adapt for personal or commercial projects.

Happy coding and jamming! If you run into any issues or have suggestions, please open an issue or submit a pull request. Enjoy!