export interface ArgsOptions {
  description?: string;
  type?: () => any;
}

export function Args(
  property: string,
  options: ArgsOptions
): ParameterDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    parameterIndex: number
  ) => {
    //
  };
}
