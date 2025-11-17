export interface NGLRequestData {
  username: string;
  question: string;
  deviceId: string;
  gameSlug: string;
  referrer: string;
}

export interface SpamConfig {
  nglUsername: string;
  message: string;
  count: number;
}

export interface SpamResult {
  sent: number;
  failed: number;
  total: number;
}
