import { expect } from "jsr:@std/expect";
import { 
    getTemperatureInCelsius, 
    getTemperatureInFahrenheit, 
} from "./utils.ts";

Deno.test("Celcius to Fahrenheit", () => {
    let f = 32;
    let c = 0;
    expect(getTemperatureInCelsius(f)).toBe(c);
    f = 212;
    c = 100;
    expect(getTemperatureInCelsius(f)).toBe(c);
    f = -40;
    c = -40;
    expect(getTemperatureInCelsius(f)).toBe(c);
});

Deno.test("Fahrenheit to Celcius", () => {
    let c = 0;
    let f = 32;
    expect(getTemperatureInFahrenheit(c)).toBe(f);
    c = 100;
    f = 212;
    expect(getTemperatureInFahrenheit(c)).toBe(f);
    c = -40;
    f = -40;
    expect(getTemperatureInFahrenheit(c)).toBe(f);
});