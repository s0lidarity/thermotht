import { expect } from "jsr:@std/expect";

import Thermometer  from "./Thermometer.ts";

Deno.test("Thermometer", () => {
    const thermometer = new Thermometer();

    expect(thermometer).toBeDefined();
});