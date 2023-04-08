import { injectableMetadata } from '../metadata/metaProps';

export function Inject(
  prop: any
): (target: any, property: string | symbol) => void {
  return (target: any, property: string | symbol) => {
    const _target = target.constructor;
    let props = injectableMetadata.injectProps.get(_target);
    const value = { target: _target, prop, name: property };
    if (props) {
      props.push(value);
    } else {
      props = [value];
    }
    injectableMetadata.injectProps.set(_target, props);
  };
}
