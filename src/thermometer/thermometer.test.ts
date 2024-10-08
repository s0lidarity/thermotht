import { expect } from "jsr:@std/expect";

import Thermometer  from "./thermometer.ts";

Deno.test("Thermometer", () => {
    const thermometer = new Thermometer();

    thermometer.updateTemperature(0, "C");
    thermometer.setThreshold({
        value: 0,
        callback: (temperature, message) => {
            expect(temperature).toBe(0);
            expect(message).toBe("Temperature has breached 0 degrees ");
        },
    });

    thermometer.updateTemperature(32, "F");
    thermometer.setThreshold({
        value: 0,
        callback: (temperature, message) => {
            expect(temperature).toBe(0);
            expect(message).toBe("Temperature has breached 0 degrees ");
        },
    });

    thermometer.updateTemperature(100, "C");
    thermometer.setThreshold({
        value: 100,
        callback: (temperature, message) => {
            expect(temperature).toBe(100);
            expect(message).toBe("Temperature has breached 100 degrees ");
        },
    });
});