# Aegis ASM: Real-Time Intelligent Attack Surface Management

Aegis is a production-ready, interactive platform designed for continuous asset discovery and vulnerability analysis. It visualizes your organization's external infrastructure and calculates real-time risk scores using AI-driven analysis.

## ✨ Features

- **Automated Recon Pipeline**: Simulated integration with tools like `subfinder`, `nmap`, and `httpx`.
- **Intelligent Risk Engine**: Multi-factor risk scoring based on exposure, severity, and sensitivity.
- **Interactive Infrastructure Map**: D3-powered graph visualization of asset relationships.
- **AI Risk Analysis**: Gemini-powered simplified explanations and remediation steps for critical findings.
- **Real-Time Updates**: WebSocket-driven live logs and instant UI sync during active scans.

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Google Gemini API Key (for AI analysis features)

### Local Development
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables in `.env`:
   ```bash
   GEMINI_API_KEY=your_key_here
   ```
4. Start the full-stack development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

### Docker Deployment
```bash
docker-compose up --build
```

## 📂 Project Structure

- `/server.ts`: Express + Socket.io backend with reconnaissance simulation logic.
- `/src/App.tsx`: React frontend with Dashboard, Scanner, and Graph components.
- `/src/lib/d3-graph.ts`: Custom D3.js visualization logic.
- `/src/types.ts`: Shared TypeScript interfaces.

## 🛡️ Security
This platform is intended for authorized security testing and perimeter defense monitoring only.

## 📜 License
Apache-2.0

## Contributors
Darshini N