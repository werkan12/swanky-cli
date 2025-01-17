import { BaseCommand } from "../../lib/baseCommand.js";
import { Args } from "@oclif/core";
import { Contract } from "../../lib/contract.js";

export class ExplainContract extends BaseCommand {
  static description = "Explain contract messages based on the contracts' metadata";

  static args = {
    contractName: Args.string({
      name: "contractName",
      required: true,
      description: "Name of the contract",
    }),
  };

  async run(): Promise<void> {
    const { args } = await this.parse(ExplainContract);

    const contractRecord = this.swankyConfig.contracts[args.contractName];
    if (!contractRecord) {
      this.error(`Cannot find a contract named ${args.contractName} in swanky.config.json`);
    }

    const contract = new Contract(contractRecord);

    if (!(await contract.pathExists())) {
      this.error(`Path to contract ${args.contractName} does not exist: ${contract.contractPath}`);
    }

    const artifactsCheck = await contract.artifactsExist();

    if (!artifactsCheck.result) {
      this.error(`No artifact file found at path: ${artifactsCheck.missingPaths}`);
    }

    await contract.printInfo();
  }
}
