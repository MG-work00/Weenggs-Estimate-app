# 📊 Estimate Manager App

A React-based application built to display and manage project estimate data by section and items — featuring live total calculations, editable fields, and clean UI with Tailwind CSS.

---

## 🚀 Tech Stack

- **React 19** with Vite
- **Tailwind CSS** for styling
- **React Icons**
- **React Router DOM**
- **Custom data fetching & transformation service**
- **ESLint** + hooks & refresh plugins

---

## 📁 Project Structure

WEENGGS-ESTIMATE-APP/
├── public/
│ └── data/
│ └── React JS- Estimate_detail.json # Simulated API JSON
├── src/
│ ├── assets/ # Static icons/images
│ ├── components/
│ │ └── EstimateTable.jsx # Section & table logic
│ ├── services/
│ │ └── estimateService.js # Fetching, formatting, utils
│ ├── App.jsx # Root component
│ ├── main.jsx # Entry point

---

## 📦 Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/weenggs-estimate-app.git

# 2. Navigate into project
cd weenggs-estimate-app

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev

# 5. Open your browser and visit:
```

http://localhost:5173

## 📁 Project Structure

Fetches estimate data via AJAX (fetch) from a local JSON file (simulated API)

Displays multiple sections and items in responsive tables

Inline editable QTY and Unit Cost fields

Live updating of section total and grand total

Optimized with useEffect, useRef, and useState

Clean UI built with Tailwind CSS and React Icons

📄 Task Requirements Covered
Use of AJAX (fetch) — no hardcoded or imported data

Table per section with editable fields

All cost values formatted (divided by 100 as per instructions)

Total updates on keypress

Grand total at top — updated dynamically

Responsive design + clean code organization

👨‍💻 Author
Manish Gohil
Frontend Developer
