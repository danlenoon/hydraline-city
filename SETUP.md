# Hydraline City: Setup & Installation

To run this simulation, you need to set up the local AI environment. Follow these simple steps.

## 1. Automated Setup (Recommended)
Run the setup script in PowerShell:
```powershell
./setup.ps1
```

## 2. Manual Setup
If the script fails, perform these manual steps:

1. **Install Ollama:** Download and install from [ollama.com](https://ollama.com/).
2. **Enable AI Bridge:** 
   - Open System Environment Variables.
   - Add: `OLLAMA_ORIGINS` = `*`
   - Restart the Ollama application from the System Tray.
3. **Pull Model:** Open terminal and run: `ollama pull tinydolphin`
4. **Launch Application:**
   ```powershell
   npm install
   npm run dev
   ```
