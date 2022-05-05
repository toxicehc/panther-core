import {DeployFunction} from 'hardhat-deploy/types';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {utils} from 'ethers';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deployments, getNamedAccounts} = hre;
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    await deploy('StakeRewardController2', {
        from: deployer,
        args: [
            deployer, // owner
            process.env.TOKEN_ADDRESS,
            process.env.STAKING_CONTRACT,
            process.env.REWARD_MASTER,
            utils.parseEther(String(3.555e6)),
        ],
        log: true,
        autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
    });
};
export default func;

func.tags = ['StakeRewardController2'];
