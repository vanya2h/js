import { FullPublishMetadata, PreDeployMetadataFetched } from "../../schema";

export type DeployOptions = {
  forceDirectDeploy?: boolean;
};

export type DeployMetadata = {
  compilerMetadata: PreDeployMetadataFetched;
  extendedMetadata?: FullPublishMetadata;
};
