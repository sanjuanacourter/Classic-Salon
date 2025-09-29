import type { DeployFunction } from "hardhat-deploy/types";
import type { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("ClassicSalon", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};

export default func;
func.tags = ["ClassicSalon"];




