import { NGLRequestData } from '../types/ngl-types';
import { generateDeviceId } from '../utils/device-utils';
import { getRandomUserAgent } from '../utils/user-agent-utils';

export class NGLService {
  private static readonly URL = 'https://ngl.link/api/submit';

  static async sendMessage(nglUsername: string, message: string): Promise<boolean> {
    const deviceId = generateDeviceId();
    const userAgent = getRandomUserAgent();

    const headers: HeadersInit = {
      'Host': 'ngl.link',
      'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
      'accept': '*/*',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'x-requested-with': 'XMLHttpRequest',
      'sec-ch-ua-mobile': '?0',
      'user-agent': userAgent,
      'sec-ch-ua-platform': '"Windows"',
      'origin': 'https://ngl.link',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': `https://ngl.link/${nglUsername}`,
      'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
    };

    const data: NGLRequestData = {
      username: nglUsername,
      question: message,
      deviceId: deviceId,
      gameSlug: '',
      referrer: ''
    };

    const formData = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await fetch(this.URL, {
        method: 'POST',
        headers: headers,
        body: formData,
        mode: 'no-cors'
      });
      return true;
    } catch (error) {
      console.error(`Failed to send message to ${nglUsername}:`, error);
      return false;
    }
  }
}
