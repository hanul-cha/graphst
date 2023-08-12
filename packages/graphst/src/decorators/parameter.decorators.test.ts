import { MetadataStorage } from '../metadata/metadataStorage';
import { Args, Context, Info, Parent } from './parameter.decorators';

class TestClass {
  doTest(@Args() test: string, @Parent() test2: string) {
    return 'doTestInTestClass';
  }
  doTest2() {
    return 'doTest2InTestClass';
  }
}

class TestClass2 {
  doTest(@Args() test: string, _: null, @Args() test3: string) {
    return 'doTestInTestClass2';
  }

  doTest2(
    @Info() info: string,
    @Parent() test2: string,
    @Args() test3: string,
    @Context() context: string
  ) {
    return 'doTest2InTestClass2';
  }
}

describe('parameter.decorators.test', () => {
  const storage = MetadataStorage.getStorage();

  const testClassArray = storage.getParameter(TestClass, 'doTest');
  const test2ClassArray = storage.getParameter(TestClass, 'doTest2');

  const testClassArray2 = storage.getParameter(TestClass2, 'doTest');
  const test2ClassArray2 = storage.getParameter(TestClass2, 'doTest2');

  it('parameter', () => {
    expect(testClassArray).toEqual([1, 0]);
    expect(test2ClassArray).toEqual(null);

    expect(testClassArray2).toEqual([1, undefined, 1]);
    expect(test2ClassArray2).toEqual([3, 0, 1, 2]);
  });
});
