# 🛠️ Hydraline City: Setup & Installation

Follow these steps to get the Hydraline City development environment running on your local machine. This project utilizes **Ollama** for a persistent, local-first AI intelligence stream to ensure user privacy and offline functionality.

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Ollama](https://ollama.com/) (Required for local AI features)

## 🚀 Quick Start

1.  **Prepare the Project Folder**
    Create a new folder named `hydraline` on your local machine and navigate into it:
    ```bash
    mkdir hydraline
    cd hydraline
    ```

2.  **Clone the Repository**
    Clone the project files into this folder:
    ```bash
    git clone <repository-url> .
    ```
    *(Note: If you have already downloaded the project files, simply move them into the `hydraline` folder.)*

3.  **Automated Setup (Recommended)**
    Run the setup script in PowerShell to configure Ollama and install dependencies:
    ```powershell
    ./setup.ps1
    ```
    This script will:
    - Verify Ollama installation.
    - Configure `OLLAMA_ORIGINS` for CORS support.
    - Pull the `gemma:2b` model.
    - Install Node.js dependencies.

4.  **Manual Setup**
    If the automated script fails, follow these manual steps:
    - **Configure Ollama CORS:** Set the environment variable `OLLAMA_ORIGINS` to `*` and restart the Ollama application.
    - **Pull the Model:** Run `ollama pull gemma:2b` in your terminal.
    - **Install Dependencies:** Run `npm install`.

5.  **Start Development Server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 🛠️ Available Scripts

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run lint`: Checks for code quality issues.
- `npm run preview`: Previews the production build locally.

## 🎨 Environment Configuration

Hydraline is built using **Tailwind CSS**. Theme configurations can be found in `tailwind.config.js` and `src/index.css`.

## 📝 Troubleshooting

- **Ollama Connection:** If the AI features are not responding, ensure Ollama is running and `OLLAMA_ORIGINS` is set correctly.
- **Node Version:** Ensure you are using a compatible Node.js version if `npm install` fails.