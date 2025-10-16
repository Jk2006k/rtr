# RTR — React to React Native Converter

### 🔗 Transform your React web apps into React Native mobile-ready projects in seconds!

RTR (React To React Native) is a powerful web-based tool that automatically converts existing **React.js** web applications into **React Native** code.
It helps developers quickly migrate their web UI into mobile environments, saving countless hours of manual code rewriting.

---

## 🌟 Features

✅ **Drag & Drop Upload** — Upload your `.zip` React project directly from the browser.
✅ **Automated Conversion** — Converts HTML tags and web-specific React code to React Native equivalents.
✅ **Zipped Output Download** — Get your converted React Native app instantly as a `.zip` file.
✅ **Test Sample App** — Try the conversion using a built-in sample React project.
✅ **Auto Cleanup** — Old converted files are automatically removed from the server to save space.
✅ **Full-stack Integration** — Built with Express.js (Backend) and React.js (Frontend).

---

## 🧠 How It Works

1. **Upload your React project (.zip)**

   * The server extracts your uploaded project safely.

2. **Conversion Process**

   * The backend scans each React component file and replaces:

     * HTML tags (`div`, `h1`, `button`, etc.) with React Native components (`View`, `Text`, `TouchableOpacity`, etc.)
     * CSS class-based styles into React Native StyleSheet syntax.
     * Browser imports with React Native compatible imports.

3. **Zipping and Downloading**

   * After conversion, a `.zip` file is generated containing your **React Native** version.
   * You can download it directly from the interface.

4. **Auto Cleanup**

   * The backend deletes old converted files daily to save server storage.

---

## ⚙️ Tech Stack

### **Frontend**

* React.js
* Tailwind CSS
* Fetch API
* Deployed on **Vercel**

### **Backend**

* Node.js + Express.js
* Multer (for file upload)
* Archiver (for zipping folders)
* File System (fs)
* Deployed on **Render**

---

## 🧹 Auto Cleanup Feature

The backend automatically deletes any **converted files older than 24 hours** from the `/converted` directory to optimize server storage.

---

## 🌍 Deployment Links

* **Frontend (Vercel):** [https://rtr-puce.vercel.app](https://rtr-puce.vercel.app)
* **Backend (Render):** [https://rtr-us34.onrender.com](https://rtr-us34.onrender.com)

---

## 👨‍💻 Author

**Kishoore J**
Full Stack Developer | Software Product Engineer 

