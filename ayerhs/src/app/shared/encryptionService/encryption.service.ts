import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  private key = CryptoJS.enc.Base64.parse(environment.aesKey);

  encrypt(text: string): string {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(text, this.key, { iv: iv });
    return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
  }
}
