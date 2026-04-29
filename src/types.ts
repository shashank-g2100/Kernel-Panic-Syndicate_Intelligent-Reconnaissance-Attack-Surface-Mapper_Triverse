export type UserRole = 'admin' | 'analyst' | 'viewer';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface Asset {
  id: string;
  type: 'domain' | 'ip' | 'service';
  value: string;
  riskScore: number;
  status: 'active' | 'inactive';
  lastSeen: string;
  metadata: {
    parent?: string;
    ip?: string;
    ports?: number[];
    services?: string[];
    tech?: string[];
    waf?: string;
  };
}

export interface Finding {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  priority: Priority;
  assetId: string;
  description: string;
  timestamp: string;
}

export interface ScanStatus {
  isScanning: boolean;
  progress: number;
  logs: string[];
}
