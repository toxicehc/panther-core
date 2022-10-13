import {
    deriveKeypairFromSignature,
    deriveChildPrivKeyFromRootPrivKey,
    deriveKeypairFromSeed,
    deriveChildPubKeyFromRootPubKey,
    isChildPubKeyValid,
} from '@panther-core/crypto/lib/keychain';
import {IKeypair, PrivateKey} from '@panther-core/crypto/lib/types/keypair';
import {poseidon} from 'circomlibjs';
import {Signer} from 'ethers';

import {parseTxErrorMessage} from '../lib/errors';

// generateSpendingChildKeypair generates child spending keypair (s', S')
// using root spending private key and random scalar r as input.
export function generateSpendingChildKeypair(
    rootSpendingPrivKey: PrivateKey,
    r: bigint,
): IKeypair {
    const spendingChildPrivKey = deriveChildPrivKeyFromRootPrivKey(
        rootSpendingPrivKey,
        r,
    );
    return deriveKeypairFromSeed(spendingChildPrivKey);
}

export async function deriveRootKeypairs(
    signer: Signer,
): Promise<IKeypair[] | Error> {
    const derivationMessage = `Greetings from Panther Protocol!

Sign this message in order to obtain the keys to your Panther wallet.

This signature will not cost you any fees.

Keypair version: 1`;
    let signature: string;
    try {
        signature = await signer.signMessage(derivationMessage);
    } catch (error) {
        return new Error(parseTxErrorMessage(error));
    }

    const hashedSignature = poseidon([signature]);
    return [
        deriveKeypairFromSignature(signature),
        deriveKeypairFromSeed(hashedSignature),
    ];
}

export function deriveSpendingChildKeypair(
    rootSpendingKeypair: IKeypair,
    randomSecret: bigint,
): [IKeypair, boolean] {
    console.time('deriveSpendingChildKeypair()');
    const childSpendingPrivateKey = deriveChildPrivKeyFromRootPrivKey(
        rootSpendingKeypair.privateKey,
        randomSecret,
    );

    const spendingChildPubKey = deriveChildPubKeyFromRootPubKey(
        rootSpendingKeypair.publicKey,
        randomSecret,
    );

    console.debug('derived spenderChildPubKey:', spendingChildPubKey);
    const isValid = isChildPubKeyValid(
        spendingChildPubKey,
        rootSpendingKeypair,
        randomSecret,
    );

    console.timeEnd('deriveSpendingChildKeypair()');
    return [
        {privateKey: childSpendingPrivateKey, publicKey: spendingChildPubKey},
        isValid,
    ];
}
