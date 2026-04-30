import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  app.use(express.json());

  // In-memory data store for the demo
  let assets: any[] = [];
  let findings: any[] = [];
  let isScanning = false;
  let scanProgress = 0;
  let scanLogs: string[] = [];
  let scanHistory: any[] = [];

  // Rest APIs
  app.get("/api/assets", (req, res) => {
    res.json(assets);
  });

  app.get("/api/findings", (req, res) => {
    res.json(findings);
  });

  app.get("/api/scans/history", (req, res) => {
    res.json(scanHistory);
  });

  app.patch("/api/findings/:id", (req, res) => {
    const { id } = req.params;
    const { priority } = req.body;
    const findingIndex = findings.findIndex(f => f.id === id);
    if (findingIndex !== -1) {
      findings[findingIndex] = { ...findings[findingIndex], priority };
      res.json(findings[findingIndex]);
    } else {
      res.status(404).json({ error: "Finding not found" });
    }
  });

  app.post("/api/scan/start", (req, res) => {
    if (isScanning) return res.status(400).json({ error: "Scan already in progress" });
    
    const { target } = req.body;
    if (!target) return res.status(400).json({ error: "Target is required" });

    startScan(target, io);
    res.json({ message: "Scan started" });
  });

  // Simulated Scanning Logic
  async function startScan(target: string, io: Server) {
    isScanning = true;
    scanProgress = 0;
    const scanId = Math.random().toString(36).substr(2, 6).toUpperCase();
    scanLogs = [`[INIT] Starting Aegis Advanced Recon Pipeline v2.4 [SCAN_ID: ${scanId}]`];
    assets = [];
    findings = [];
    
    io.emit("scan:update", { isScanning, progress: 0, log: scanLogs[0] });

    const steps = [
      { name: "Passive Recon & OSINT", duration: 2000, action: passiveDiscovery },
      { name: "DNS Mass-Resolution", duration: 2000, action: dnsResolution },
      { name: "WAF & Cloud Detection", duration: 1500, action: cloudDetection },
      { name: "Port & Service Discovery", duration: 3000, action: portScanning },
      { name: "Tech Stack Fingerprinting", duration: 2500, action: techFingerprinting },
      { name: "Deep Vulnerability Probing", duration: 4000, action: vulnerabilityProbing },
      { name: "Secret & Leak Discovery", duration: 3000, action: secretScanning },
    ];

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        scanLogs.push(`[STAGE] Executing ${step.name}...`);
        io.emit("scan:update", { log: scanLogs[scanLogs.length-1] });
        
        await new Promise(r => setTimeout(r, step.duration));
        
        step.action(target, io);
        
        scanProgress = Math.round(((i + 1) / steps.length) * 100);
        io.emit("scan:update", { 
            progress: scanProgress, 
            assets: assets,
            findings: findings
        });
    }

    isScanning = false;
    const completedAt = new Date().toISOString();
    scanLogs.push(`[FINISH] Scan ${scanId} completed. Found ${assets.length} assets and ${findings.length} findings.`);
    
    scanHistory.unshift({
        id: scanId,
        target,
        assetsCount: assets.length,
        findingCount: findings.length,
        timestamp: completedAt,
        status: 'completed'
    });

    io.emit("scan:update", { isScanning, progress: 100, log: scanLogs[scanLogs.length-1] });
  }

  function passiveDiscovery(target: string) {
    const subdomains = ["api", "dev", "prod", "vpn", "mail", "jenkins", "gitlab", "jira", "db-prod"];
    subdomains.forEach(sub => {
        const domain = `${sub}.${target}`;
        assets.push({
            id: Math.random().toString(36).substr(2, 9),
            type: "domain",
            value: domain,
            riskScore: Math.floor(Math.random() * 30),
            status: "active",
            lastSeen: new Date().toISOString(),
            metadata: { parent: target, tech: [], waf: "None" }
        });
    });
  }

  function dnsResolution(target: string) {
    assets.forEach(a => {
        if (a.type === "domain") {
            a.metadata.ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        }
    });
  }

  function cloudDetection(target: string) {
    assets.forEach(a => {
        const providers = ["Cloudflare", "AWS CloudFront", "Akamai", "Fastly"];
        if (Math.random() > 0.6) {
            a.metadata.waf = providers[Math.floor(Math.random() * providers.length)];
            a.metadata.tech.push("Cloud Native");
        }
    });
  }

  function portScanning(target: string) {
     assets.forEach(a => {
        if (a.type === "domain") {
            a.metadata.ports = [80, 443, 8080, 22, 3306, 6379].filter(() => Math.random() > 0.4);
        }
     });
  }

  function techFingerprinting(target: string) {
    const stack = ["React", "Express", "Node.js", "PHP 7.4", "WordPress", "Nginx", "Apache", "Java", "Python"];
    assets.forEach(a => {
        if (a.metadata?.ports?.length > 0) {
            const discovered = stack.filter(() => Math.random() > 0.7);
            a.metadata.tech = [...new Set([...a.metadata.tech, ...discovered])];
        }
    });
  }

  function vulnerabilityProbing(target: string, io: Server) {
    assets.forEach(a => {
        if (a.metadata?.tech?.includes("PHP 7.4") && Math.random() > 0.8) {
            addFinding("Outdated PHP Version", "medium", a.id, "Server running PHP 7.4 which has reached End-of-Life.", io);
            a.riskScore += 25;
        }
        if (a.metadata?.tech?.includes("WordPress") && Math.random() > 0.7) {
            addFinding("Vulnerable WP Plugin (wp-file-manager)", "critical", a.id, "Detected RCE vulnerability in file manager plugin.", io);
            a.riskScore += 65;
        }
        if (a.metadata?.ports?.includes(6379) && Math.random() > 0.8) {
            addFinding("Exposed Redis (No Auth)", "high", a.id, "Redis instance permits unauthenticated connections, risking data exfiltration.", io);
            a.riskScore += 50;
        }
    });
  }

  function secretScanning(target: string, io: Server) {
     assets.forEach(a => {
        if (a.value.includes("dev") || a.value.includes("db")) {
            if (Math.random() > 0.85) {
                addFinding("Exposed Git History", "high", a.id, "Found accessible .git directory on production-facing webroot.", io);
                a.riskScore += 45;
            }
        }
     });
  }

  function addFinding(title: string, severity: string, assetId: string, description: string, io: Server) {
    const finding = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        severity,
        priority: severity, // Default priority matches severity initially
        assetId,
        description,
        timestamp: new Date().toISOString()
    };
    findings.push(finding);
    if (severity === 'critical' || severity === 'high') {
        io.emit("notification", { 
            title: `CRITICAL ALERT: ${title}`, 
            message: `New threat detected on ${assetId}`,
            severity 
        });
    }
  }

  // Vite development middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
