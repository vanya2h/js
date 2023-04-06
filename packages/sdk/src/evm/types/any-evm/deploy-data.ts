import { InfraContractType } from "../../core";

export type PrecomputedDeploymentData = {
  predictedAddress: string;
  bytecode: string;
  encodedArgs: any;
};

export type DeploymentInfo = {
  bytecode: string;
  encodedArgs: any;
  predictedAddress: string;
  infraContractsToDeploy: InfraContractType[];
};

export type KeylessTransaction = {
  signer: string;
  transaction: string;
};

export type KeylessDeploymentInfo = {
  signer: string;
  transaction: string;
  deployment: string;
};