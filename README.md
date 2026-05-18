# 💧 Hydraline City

Hydraline City is a visually immersive, gamified hydration tracking application, built with **React**, **TypeScript**, and **Vite**. It transforms personal health into a strategic city-building experience, powered by **local-first AI (Gemma 4)** to provide private, intelligent wellness coaching.

## 🔗 Project Links

-   **Kaggle Writeup:** [Link to your Kaggle Writeup](https://www.kaggle.com/competitions/gemma-4-good-hackathon/writeups/hydraline-city)
-   **Video Demo:** [Link to your YouTube Video](https://youtu.be/ywfgdvy4JdQ)

## ✨ Features

-   **Gamified Hydration:** Track your water intake through Faucets, Hydroflasks, and Hydrodispensers, leveling up your hydration experience to grow a digital metropolis.
-   **Local AI Health Companion:** Powered by **Gemma 4 via Ollama**, which provides a persistent, two-way intelligence stream for personalized wellness coaching.
-   **Interactive Chat History:** A high-fidelity, iMessage-style interface that maintains a history of your metropolitan strategy and health consultations.
-   **Privacy-First Architecture:** All AI inference happens locally on your device, ensuring your sensitive health data and conversation history never leave your hardware.
-   **Immersive UI:** High-quality glassmorphism design with backdrop blurs, liquid gradients, and smooth Framer Motion animations.
-   **Dynamic Visuals:** Custom SVG-based visualizations for water flow and vessel levels.
-   **Responsive & Accessible:** Built with Tailwind CSS for a seamless experience across devices.
-   **Theming:** Deep integration with a custom "alkaline" color palette.

## 🚀 Tech Stack

-   **AI Model:** [Gemma 4 (2B/4B)](https://ai.google.dev/gemma)
-   **Local Inference:** [Ollama](https://ollama.com/)
-   **Framework:** [React 19](https://react.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool:** [Vite 8](https://vitejs.dev/)
-   **Styling:** [Tailwind CSS 3](https://tailwindcss.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)

## 🛠️ Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (Latest LTS recommended)
-   npm or yarn
-   [Ollama](https://ollama.com/) (For local AI features)

### Installation

1.  **Prepare the Project Folder:**
    Create a new folder named `hydraline` on your local machine and navigate into it:
    ```bash
    mkdir hydraline
    cd hydraline
    ```

2.  **Clone the repository:**
    ```bash
    git clone https://github.com/danlenoon/hydraline-city .
    ```

3.  **Setup local AI & Dependencies:**
    Run the automated setup script in PowerShell:
    ```powershell
    ./setup.ps1
    ```
    *This script configures Ollama CORS settings and pulls the Gemma 4 model.*

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

## 📂 Project Structure

-   **`public/`**: Contains static assets, including the application's favicon and public manifest.
-   **`src/`**: The primary source directory for the application.
    -   `App.tsx`: The architectural core containing the game loop, state management, and high-fidelity UI components.
    -   `main.tsx`: The React entry point responsible for mounting the application to the DOM.
    -   `index.css`: Global styles, Tailwind directives, and the project's custom glass utility library.
    -   `assets/`: Static image and SVG assets utilized throughout the simulation.
-   **`setup.ps1`**: A PowerShell automation script engineered for local environment orchestration, including Ollama CORS configuration and model weight management.
-   **`SETUP.md`**: A comprehensive, step-by-step developer guide for local installation and AI bridge configuration.
-   **`tailwind.config.js`**: Custom design system configuration defining the alkaline and aqua color palettes.
-   **`vite.config.ts`**: The build and development configuration for the Vite ecosystem.
-   **`package.json`**: Project metadata, dependency management, and build scripts.
-   **`LICENSE`**: The official project licensing documentation (MIT for code, CC BY 4.0 for writeup).

## 🎨 Design System

Hydraline utilizes a custom-designed aesthetic:
-   **Glassmorphism:** Layers of blur and transparency (`glass-container`, `glass-card`).
-   **Alkaline Palette:** A vibrant gradient system from cyan to green, representing fresh water.
-   **Fluid Motion:** Physics-based animations for an organic feel.

## 📄 License

-   **Code:** This project's source code is licensed under the MIT License:
    ```text
    MIT License

    Copyright (c) 2026 Danielle Lenon

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    ```
-   **Documentation and Writeup:** The project documentation and Kaggle writeup are licensed under the [Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/) license.

**Trademark Notice:** Gemma is a trademark of Google LLC. This project is an independent submission and is not affiliated with or endorsed by Google.