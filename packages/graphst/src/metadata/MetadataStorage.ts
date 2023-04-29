import { MetadataInjectProp, ProviderMetadata } from './interfaces';
import { MetadataStorable } from './interfaces';

let Metadata: MetadataStorable | null = null;

export class MetadataStorage implements MetadataStorable {
  static getStorage(): MetadataStorable {
    if (!Metadata) {
      Metadata = new MetadataStorage();
    }
    return Metadata;
  }

  clear() {
    Metadata = null;
  }

  private providers = new Map<Function, ProviderMetadata>();
  private injectProps = new Map<Function, MetadataInjectProp[]>();

  setProvider(target: Function, metadata: ProviderMetadata) {
    this.providers.set(target, metadata);
  }

  setInjectProps(target: Function, metaData: MetadataInjectProp) {
    let props = this.injectProps.get(target);
    if (props) {
      props.push(metaData);
    } else {
      props = [metaData];
    }
    this.injectProps.set(target, props);
  }

  getProvider(target: Function) {
    return this.providers.get(target);
  }

  getInjectProps(target: Function) {
    return this.injectProps.get(target);
  }
}
