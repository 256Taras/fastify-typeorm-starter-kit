import v8 from "v8";

/**
 * @type {import('./fixture-factory.d').TFixtureFactory}
 */
export const fixtureFactory = (fixture) =>
  // @ts-ignore ignore that returned type is not the same as input, but its specific behavior of Proxy
  new Proxy(fixture, {
    get(target, prop) {
      if (prop in target) {
        return v8.deserialize(v8.serialize(target[prop]));
      }
      throw new Error("Requested fixture does not exist");
    },
  });
