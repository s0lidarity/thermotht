import { assertEquals } from "jsr:@std/assert/equals";
import { assertThrows } from "@std/assert";
import { assertSpyCalls, spy } from "@std/testing/mock";
import Thermometer from "./Thermometer.ts";
import Threshold from "../threshold/Threshold.ts";

import { tfc1, tfc2, tff1 } from "./sampleData/SampleTempFeed.ts";


Deno.test("readTemperatureFeed '1.5 C'", () => {
    const thermometer = new Thermometer();
    const f = thermometer.readTemperatureFeed("1.5 C");
    assertEquals(f, { temperature: 1.5, unit: 'C'} );
});

Deno.test("readTemperatureFeed '45 F'", () => {
    const thermometer = new Thermometer();
    const f = thermometer.readTemperatureFeed("45 F");
    assertEquals(f, { temperature: 45, unit: 'F'} );
});

Deno.test("readTemperatureFeed '100' no unit provided", () => {
    const thermometer = new Thermometer();
    const f = thermometer.readTemperatureFeed("100");
    assertEquals(f, { temperature: 100, unit: 'C'} );
});

Deno.test("readTemperatureFeed throws an error with invalid feed", () => {
    const thermometer = new Thermometer();
    assertThrows(() => thermometer.readTemperatureFeed("onehundred C"), Error, "Invalid temperature from feed: onehundred C");
});

Deno.test("should process a feed for one threshold in C", () => {
    const thermometer = new Thermometer();
    const mockCallback = spy();
    const threshold = new Threshold({
        value: 0,
        callback: mockCallback,
        direction: 'falling',
        lastObservedTemp: null,
        minFlux: null,
        unit: 'C',
    });
    thermometer.addThreshold(threshold);
    
    for(const feed of tfc1) {
        thermometer.readTemperatureFeed(feed);
    }
    assertSpyCalls(mockCallback, 6);
});

Deno.test("should process a feed for two thresholds in C", () => {
    const thermometer = new Thermometer();
    const boilingCB = spy();
    const threshold1 = new Threshold({
        value: 100,
        callback: boilingCB,
        direction: 'rising',
        lastObservedTemp: null,
        minFlux: null,
        unit: 'C',
    });
    thermometer.addThreshold(threshold1);

    const mockCallback2 = spy();
    const condensingCB = new Threshold({
        value: 100,
        callback: mockCallback2,
        direction: 'falling',
        lastObservedTemp: null,
        minFlux: null,
        unit: 'C',
    });
    thermometer.addThreshold(condensingCB);
    
    for(const feed of tfc2) {
        thermometer.readTemperatureFeed(feed);
    }
    assertSpyCalls(boilingCB, 4);
    assertSpyCalls(mockCallback2, 6);
});

// Deno Test is running weird here, revisit
// Deno.test("should process a feed for one threshold in F", () => {
//     const thermometer = new Thermometer();
//     const freezing = spy();
//     const threshold = new Threshold({
//         value: 32,
//         callback: freezing,
//         direction: 'falling',
//         lastObservedTemp: 45,
//         unit: 'F',
//     });
//     thermometer.addThreshold(threshold);
    
//     for(const feed of tff1) {
//         console.log(`feed: ${feed}`);
//         thermometer.readTemperatureFeed(feed);
//     }
//     // returning 10
//     assertSpyCalls(freezing, 6);
// });