import crypto from 'crypto';

import {
    PrivateKey,
    PublicKey,
    EcdhSharedKey,
} from '@panther-core/crypto/lib/types/keypair';
import {babyjub} from 'circomlibjs';

import {ICiphertext} from './types/message';

export const generateEcdhSharedKey = (
    privateKey: PrivateKey,
    publicKey: PublicKey,
): EcdhSharedKey => {
    return babyjub.mulPointEscalar(publicKey, privateKey);
};

export function encryptMessage(
    plaintext: Uint8Array,
    cipherKey: Uint8Array,
    iv: Uint8Array,
): ICiphertext {
    try {
        const cipher = crypto.createCipheriv('aes-128-cbc', cipherKey, iv);
        cipher.setAutoPadding(false);
        const cipheredText1 = cipher.update(plaintext);
        const cipheredText2 = cipher.final();
        return new Uint8Array([...cipheredText1, ...cipheredText2]);
    } catch (error) {
        throw Error(`Failed to encrypt message: ${error}`);
    }
}

export function decryptMessage(
    ciphertext: ICiphertext,
    cipherKey: Uint8Array,
    iv: Uint8Array,
): Uint8Array {
    const decipher = crypto.createDecipheriv('aes-128-cbc', cipherKey, iv);
    decipher.setAutoPadding(false);

    return new Uint8Array([
        ...decipher.update(ciphertext),
        ...decipher.final(),
    ]);
}
