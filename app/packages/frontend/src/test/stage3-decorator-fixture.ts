let decoratorRan = false;

function trackDecorator<
  TClass extends abstract new (...args: never[]) => object,
>(target: TClass, context: ClassDecoratorContext<TClass>): void {
  void target;
  void context;
  decoratorRan = true;
}

@trackDecorator
export class Stage3DecoratedFixture {}

export const stage3DecoratorRan = decoratorRan;
