# 🧮 Electron Calculator App

A simple yet powerful calculator built with **Electron.js** that includes:

### 🌟 Features

- Basic calculator functionality
- Scroll to change window opacity
- Always-on-top
- System tray integration
- Global shortcut: `Ctrl + Shift + C` to show/hide the app
- Auto-launch on system startup

---

### 🚀 How to Run the App

#### 1. **Clone the Repository**

```bash
git clone https://github.com/Arnadeep/Calculator-electron-app.git
cd electron-calculator
```

#### 2. **Install Dependencies**
```bash
npm install
```
#### 3. **Start the App**
```bash
npm start
```

#### 📦 Package for Distribution
```bash
npm run package
```
- This will generate a packaged version inside the dist folder.

### 🛠 Requirements
- Node.js >= 14
- Electron (comes via dependencies)

### 📌 Notes
Make sure preload.js, main.js, and other files are correctly referenced in index.html

To edit the global shortcut, check the main.js file

### 📬 Contributing
Feel free to open issues or submit pull requests!
