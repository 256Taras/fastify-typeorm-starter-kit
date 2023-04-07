import { ISeed } from "./database.d";

interface IFixture {
  [key: string]: {
    in?: {
      body?: Record<string, any>;
      headers?: Record<string, any>;
    };
    out?: Record<string, any>;
  };
}

interface FixtureFactoryDto {
  seeds: {
    positive?: ISeed;
    negative?: ISeed;
    common?: ISeed;
  };
  positive: IFixture;
  negative: IFixture;
}

export declare type TFixtureFactory = <T extends FixtureFactoryDto>(fixture: T) => T;

export declare const fixtureFactory: TFixtureFactory;
