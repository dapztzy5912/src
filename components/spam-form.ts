import { SpamConfig, SpamResult } from '../types/ngl-types';
import { NGLService } from '../services/ngl-service';

export class SpamForm {
  private nglUsernameInput: HTMLInputElement;
  private messageInput: HTMLInputElement;
  private countInput: HTMLInputElement;
  private statusElement: HTMLElement;
  private logElement: HTMLElement;
  private startButton: HTMLButtonElement;

  constructor() {
    this.initializeElements();
    this.attachEventListeners();
  }

  private initializeElements(): void {
    this.nglUsernameInput = document.getElementById('nglUsername') as HTMLInputElement;
    this.messageInput = document.getElementById('message') as HTMLInputElement;
    this.countInput = document.getElementById('count') as HTMLInputElement;
    this.statusElement = document.getElementById('status') as HTMLElement;
    this.logElement = document.getElementById('log') as HTMLElement;
    this.startButton = document.querySelector('button') as HTMLButtonElement;
  }

  private attachEventListeners(): void {
    this.startButton.addEventListener('click', () => this.startSpam());
  }

  private logMessage(message: string): void {
    this.logElement.innerHTML += message + '<br>';
    this.logElement.scrollTop = this.logElement.scrollHeight;
  }

  private validateInputs(): boolean {
    const nglUsername = this.nglUsernameInput.value.trim();
    const message = this.messageInput.value.trim();
    const count = parseInt(this.countInput.value);

    if (!nglUsername || !message || isNaN(count) || count <= 0) {
      this.statusElement.textContent = 'Masukkan semua informasi dengan benar!';
      return false;
    }

    return true;
  }

  private getSpamConfig(): SpamConfig {
    return {
      nglUsername: this.nglUsernameInput.value.trim(),
      message: this.messageInput.value.trim(),
      count: parseInt(this.countInput.value)
    };
  }

  private async startSpam(): Promise<void> {
    if (!this.validateInputs()) return;

    const config = this.getSpamConfig();
    this.statusElement.textContent = `Memulai spam ke ${config.nglUsername}, pesan: ${config.message}, jumlah: ${config.count}`;
    this.logMessage(`Memulai spam ke ${config.nglUsername}, pesan: ${config.message}, jumlah: ${config.count}`);

    const result = await this.executeSpam(config);
    this.displayResult(result, config);
  }

  private async executeSpam(config: SpamConfig): Promise<SpamResult> {
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < config.count; i++) {
      const success = await NGLService.sendMessage(config.nglUsername, config.message);
      
      if (success) {
        sent++;
        this.logMessage(`Pesan terkirim ke ${config.nglUsername}`);
      } else {
        failed++;
        this.logMessage(`Gagal mengirim pesan ke ${config.nglUsername}`);
      }

      this.statusElement.textContent = 
        `Terkirim: ${sent}/${config.count}, Gagal: ${failed}, Progress: ${Math.round((sent / config.count) * 100)}%`;
      
      await this.delay(1000); // Delay 1 detik
    }

    return { sent, failed, total: config.count };
  }

  private displayResult(result: SpamResult, config: SpamConfig): void {
    this.statusElement.textContent = 
      `Spam selesai!\nBerhasil: ${result.sent} pesan\nGagal: ${result.failed} pesan\nTarget: ${config.nglUsername}\nPesan: ${config.message}`;
    
    this.logMessage(`Spam selesai!\nBerhasil: ${result.sent} pesan\nGagal: ${result.failed} pesan\nTarget: ${config.nglUsername}\nPesan: ${config.message}`);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
