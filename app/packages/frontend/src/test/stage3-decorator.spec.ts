import { describe, expect, it } from 'vitest';

import {
  Stage3DecoratedFixture,
  stage3DecoratorRan,
} from './stage3-decorator-fixture';

describe('Stage-3 decorators', () => {
  it('transforms and runs a decorated fixture', () => {
    expect(new Stage3DecoratedFixture()).toBeInstanceOf(Stage3DecoratedFixture);
    expect(stage3DecoratorRan).toBe(true);
  });
});
