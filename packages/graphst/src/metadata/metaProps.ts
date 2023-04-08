export interface MetadataInjectProp {
  target: any;
  prop: any;
  name: string | symbol;
}

export const injectableMetadata = {
  injectProps: new Map<Function, MetadataInjectProp[]>(),
};
