import "@testing-library/jest-dom";
import { beforeAll } from "vitest";

import { i18nInitialization } from "../i18n/i18n";

beforeAll(async () => {
  await i18nInitialization;
});
