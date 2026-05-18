# 💧 Hydraline

Hydraline is a visually immersive, gamified hydration tracking application built with **React**, **TypeScript**, and **Vite**. It transforms personal health into a strategic city-building experience, powered by **local-first AI (Gemma 4)** to provide private, intelligent wellness coaching.

## ✨ Features

-   **Gamified Hydration:** Track your water intake through "Faucets" and "Flasks," leveling up your hydration experience to grow a digital metropolis.
-   **Local AI Health Companion:** Powered by **Gemma 4 via Ollama**, providing a persistent, two-way intelligence stream for personalized wellness coaching.
-   **Interactive Chat History:** A high-fidelity, iMessage-style interface that maintains a history of your metropolitan strategy and health consultations.
-   **Privacy-First Architecture:** All AI inference happens locally on your device, ensuring your sensitive health data and conversation history never leave your hardware.
-   **Immersive UI:** High-quality "glass-morphism" design with backdrop blurs, liquid gradients, and smooth Framer Motion animations.
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

1.  **Prepare the Project Folder**
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

-   `src/App.tsx`: The main application logic, state management, and UI components.
-   `src/index.css`: Global styles, Tailwind directives, and custom "glass" utility classes.
-   `tailwind.config.js`: Custom theme configuration, including the `alkaline` and `aqua` color palettes.
-   `setup.ps1`: Automated environment configuration for Ollama and dependencies.

## 🎨 Design System

Hydraline utilizes a custom-designed aesthetic:
-   **Glassmorphism:** Layers of blur and transparency (`glass-container`, `glass-card`).
-   **Alkaline Palette:** A vibrant gradient system from cyan to green, representing fresh water.
-   **Fluid Motion:** Physics-based animations for an organic feel.

## 📄 License

-   **Code:** This project's source code is licensed under the [MIT License](LICENSE).
-   **Documentation & Writeup:** The project documentation and Kaggle writeup are licensed under the [Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/) license.
