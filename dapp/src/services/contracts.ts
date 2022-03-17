import {JsonRpcSigner} from '@ethersproject/providers';
import {Contract} from 'ethers';

import {abi as PZKPTOKEN_ABI} from '../abi/PZkpToken';
import {abi as REWARD_MASTER_ABI} from '../abi/RewardMaster';
import {abi as STAKES_REPORTER_ABI} from '../abi/StakesReporter';
import {abi as STAKING_ABI} from '../abi/Staking';
import {abi as ZKPTOKEN_ABI} from '../abi/ZKPToken';
import {RewardMaster} from '../types/contracts/RewardMaster';
import {StakesReporter} from '../types/contracts/StakesReporter';
import {Staking} from '../types/contracts/Staking';

import {env} from './env';

export enum ContractName {
    STAKING,
    STAKES_REPORTER,
    REWARD_MASTER,
    STAKING_TOKEN,
}

export function getContractAddress(
    contractName: ContractName,
    chainId: number,
): string {
    const varName = `${ContractName[contractName]}_CONTRACT_${chainId}`;
    const address = env[varName];
    if (!address) {
        throw `${varName} not defined`;
    }
    console.debug(`Resolved ${varName} as ${address}`);
    return address;
}

export function getContractABI(
    contractName: ContractName,
    chainId: number,
): any {
    if (contractName === ContractName.REWARD_MASTER) return REWARD_MASTER_ABI;
    if (contractName === ContractName.STAKING) return STAKING_ABI;
    if (contractName === ContractName.STAKING_TOKEN) {
        if ([1, 4, 31337].includes(chainId)) return ZKPTOKEN_ABI;
        if ([137, 80001].includes(chainId)) return PZKPTOKEN_ABI;
        throw `Unsupported network ${chainId} when looking up token ABI`;
    }
}

export function getContract(
    contractName: ContractName,
    library: any,
    chainId: number,
): Contract {
    // FIXME: add cache
    const address = getContractAddress(contractName, chainId);
    const abi = getContractABI(contractName, chainId);
    return new Contract(address, abi, library);
}

export function getTokenContract(library: any, chainId: number): Contract {
    return getContract(ContractName.STAKING_TOKEN, library, chainId);
}

export function getStakingContract(library: any, chainId: number): Staking {
    return getContract(ContractName.STAKING, library, chainId) as Staking;
}

export function getStakesReporterContractOnPolygon(
    library: any,
): StakesReporter {
    return new Contract(
        process.env.STAKES_REPORTER_137 as string,
        STAKES_REPORTER_ABI,
        library,
    ) as StakesReporter;
}

export function getRewardMasterContract(
    library: any,
    chainId: number,
): RewardMaster {
    return getContract(
        ContractName.REWARD_MASTER,
        library,
        chainId,
    ) as RewardMaster;
}

type PossiblyTypedContract = Contract | RewardMaster | Staking;

export function getSignableContract<ContractType extends PossiblyTypedContract>(
    library: any,
    chainId: number,
    account: string,
    contractGetter: (library: any, chainId: number) => ContractType,
): {signer: JsonRpcSigner; contract: ContractType} {
    const signer = library.getSigner(account).connectUnchecked();
    if (!signer) {
        throw 'undefined signer';
    }
    const contract = contractGetter(library, chainId).connect(
        signer,
    ) as ContractType;
    return {signer, contract};
}
