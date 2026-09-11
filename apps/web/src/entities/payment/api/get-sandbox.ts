import { api } from '@/shared/api/client';

export interface SandboxCard {
  id: string;
  title: string;
  maskedNumber: string;
  scenario: 'success' | 'decline';
}

export interface Sandbox {
  settlementDelayMs: number;
  cards: SandboxCard[];
}

export function getSandbox(): Promise<Sandbox> {
  return api.get<Sandbox>('/api/sandbox');
}
