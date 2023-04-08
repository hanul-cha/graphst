module.exports = {
  preset: 'ts-jest',
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.ts$',
  //   setupFilesAfterEnv: ['./jest.setup.js'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
