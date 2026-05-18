# Check for Ollama
if (-not (Get-Command "ollama" -ErrorAction SilentlyContinue)) {
    Write-Host "Ollama not found! Please install it from https://ollama.com/" -ForegroundColor Red
    exit
}

# Set CORS
[Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "*", "User")
Write-Host "CORS settings updated. Please restart Ollama." -ForegroundColor Green

# Pull Model
Write-Host "Pulling Gemma 4 AI model..." -ForegroundColor Yellow
ollama pull gemma4:2b

# Install Node modules
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Setup complete! Run 'npm run dev' to launch." -ForegroundColor Green