export function Resolver(metadata: any): ClassDecorator {
  const storage = ChildMetadataStorage.getModuleStorage();
  return (target: Function) => {
    storage.resolvers.set(target, metadata);
  };
}
