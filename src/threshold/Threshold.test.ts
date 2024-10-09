import { assertSpyCalls, spy } from "@std/testing/mock";
import { Threshold } from "./Threshold.ts";
import { assertEquals } from "@std/assert/equals";

// note this is my first time using deno, I found out about the jsr @std/testing/bbd when I was low on time
// For a production application, I would have adjusted the tests to use beforeEach and afterEach for DRY purposes
Deno.test("Threshold Tests in Celsius with no previously observed temperature", async (t) => {
    await t.step("should not callback when there is no previously observed temperature and the current temperature is above threshold", () => {
        const mockCallback = spy();
        const fallsBelowFreezing = new Threshold({
            value: 0,
            callback: mockCallback,
            direction: 'falling',
            lastObservedTemp: null,
        });
        fallsBelowFreezing.checkTemperature(2, 'C');
        assertSpyCalls(mockCallback, 0);
        fallsBelowFreezing.checkTemperature(1, 'C');
        assertSpyCalls(mockCallback, 0);
    });

    await t.step("should callback when there is no previously observed temperature and the current temperature falls to threshold", () => {
        const mockCallback = spy();
        const fallsBelowFreezing = new Threshold({
            value: 0,
            callback: mockCallback,
            direction: 'falling',
            lastObservedTemp: null,
        });
        fallsBelowFreezing.checkTemperature(0, 'C');
        assertSpyCalls(mockCallback, 1);
    });

    await t.step("should callback when there is no previously observed temperature and the current temperature falls below threshold", () => {
        const mockCallback = spy();
        const fallsBelowFreezing = new Threshold({
            value: 0,
            callback: mockCallback,
            direction: 'falling',
            lastObservedTemp: null,
        });
        fallsBelowFreezing.checkTemperature(-1, 'C');
        assertSpyCalls(mockCallback, 1);
    });

    await t.step("should not callback when there is no previously observed temperature and the current temperature is not above threshold", () => {
        const mockCallback = spy();
        const thaws = new Threshold({
            value: 0,
            callback: mockCallback,
            direction: 'rising',
            lastObservedTemp: null,
        });
        thaws.checkTemperature(-1, 'C');
        assertSpyCalls(mockCallback, 0);
    });

    await t.step("should callback when there is no previously observed temperature and the current temperature rises to threshold", () => {
        const mockCallback = spy();
        const thaws = new Threshold({
            value: 0,
            callback: mockCallback,
            direction: 'rising',
            lastObservedTemp: null,
        });
        thaws.checkTemperature(0, 'C');
        assertSpyCalls(mockCallback, 1);
    });

    await t.step("should callback when there is no previously observed temperature and the current temperature rises above threshold", () => {
        const mockCallback = spy();
        const thaws = new Threshold({
            value: 0,
            callback: mockCallback,
            direction: 'rising',
            lastObservedTemp: null,
        });
        thaws.checkTemperature(1, 'C');
        assertSpyCalls(mockCallback, 1);
    });
});

Deno.test("Threshold Tests in Celsius with previously observed temperature", async (t) => {
    await t.step("should not callback when temperature falls but remains above threshold", () => {
        const mockCallback = spy();
        const fallsBelowFreezing = new Threshold({
            value: 0,
            callback: mockCallback,
            direction: 'falling',
            lastObservedTemp: 2,
        });
        fallsBelowFreezing.checkTemperature(2, 'C');
        assertSpyCalls(mockCallback, 0);
        fallsBelowFreezing.checkTemperature(1, 'C');
        assertSpyCalls(mockCallback, 0);
    });

    await t.step("should callback when temperature falls to threshold", () => {
        const mockCallback = spy();
        const fallsBelowFreezing = new Threshold({
            value: 0,
            callback: mockCallback,
            direction: 'falling',
            lastObservedTemp: 2,
            unit: 'C',
        });
        fallsBelowFreezing.checkTemperature(0, 'C');
        assertSpyCalls(mockCallback, 1);
    });

    await t.step("should callback when temperature falls below threshold", () => {
        const mockCallback = spy();
        const fallsBelowFreezing = new Threshold({
            value: 0,
            callback: mockCallback,
            direction: 'falling',
            lastObservedTemp: 2,
        });
        fallsBelowFreezing.checkTemperature(-1, 'C');
        assertSpyCalls(mockCallback, 1);
    });

    await t.step("should callback each time temperature is at or below threshold when direction is falling", () => {
        const mockCallback = spy();
        const fallsBelowFreezing = new Threshold({
            value: 0,
            callback: mockCallback,
            direction: 'falling',
            lastObservedTemp: 2,
        });
        fallsBelowFreezing.checkTemperature(0, 'C');
        assertSpyCalls(mockCallback, 1);
        fallsBelowFreezing.checkTemperature(-2, 'C');
        assertSpyCalls(mockCallback, 2);
    });

    await t.step("should callback each time temperature is at or above threshold when direction is rising", () => {
        const mockCallback = spy();
        const thaws = new Threshold({
            value: 0,
            callback: mockCallback,
            direction: 'rising',
            lastObservedTemp: -2,
        });
        thaws.checkTemperature(0, 'C');
        assertSpyCalls(mockCallback, 1);
        thaws.checkTemperature(2, 'C');
        assertSpyCalls(mockCallback, 2);
    });

    await t.step("should not callback when temperature rises above threshold and direction is falling", () => {
        const mockCallback = spy();
        const threshold = new Threshold({
            value: 0,
            callback: mockCallback,
            direction: 'falling',
            lastObservedTemp: 2,
        });
        threshold.checkTemperature(3, 'C');
        assertSpyCalls(mockCallback, 0);
    });

    await t.step("should not callback when temperature falls below threshold, but minFlux was not met", () => {
        const mockCallback = spy();
        const threshold = new Threshold({
            value: 0,
            callback: mockCallback,
            direction: 'falling',
            lastObservedTemp: 2,
            minFlux: 10,
        });
        threshold.checkTemperature(-0.5, 'C');
        assertSpyCalls(mockCallback, 0);
    });

    await(t.step("should callback when temperature falls below threshold and minFlux was met", () => {
        const mockCallback = spy();
        const threshold = new Threshold({
            value: 0,
            callback: mockCallback,
            direction: 'falling',
            lastObservedTemp: 2,
            minFlux: 1,
        });
        threshold.checkTemperature(-1, 'C');
        assertSpyCalls(mockCallback, 1);
    }));

    await(t.step("should callback when temperature rises above threshold and minFlux was met", () => {
        const mockCallback = spy();
        const threshold = new Threshold({
            value: 0,
            callback: mockCallback,
            direction: 'rising',
            lastObservedTemp: -2,
            minFlux: 1,
        });
        threshold.checkTemperature(1, 'C');
        assertSpyCalls(mockCallback, 1);
    }));

    await(t.step("should callback when temperature rises to threshold and minFlux was met", () => {
        const mockCallback = spy();
        const threshold = new Threshold({
            value: 0,
            callback: mockCallback,
            direction: 'rising',
            lastObservedTemp: -2,
            minFlux: 1,
        });
        threshold.checkTemperature(0, 'C');
        assertSpyCalls(mockCallback, 1);
    }));

});

Deno.test("Threshold Tests in Fahrenheit with no previously observed temps", async (t) => {
    await t.step("should not callback when there is no previously observed temperature and the current temperature is above threshold", () => {
        const mockCallback = spy();
        const fallsBelowFreezing = new Threshold({
            value: 32,
            callback: mockCallback,
            direction: 'falling',
            lastObservedTemp: null,
            unit: 'F',
        });
        fallsBelowFreezing.checkTemperature(33.8, 'F');
        assertSpyCalls(mockCallback, 0);
        fallsBelowFreezing.checkTemperature(33.1, 'F');
        assertSpyCalls(mockCallback, 0);
    });

    await t.step("should callback when there is no previously observed temperature and the current temperature falls to threshold", () => {
        const mockCallback = spy();
        const fallsBelowFreezing = new Threshold({
            value: 32,
            callback: mockCallback,
            direction: 'falling',
            lastObservedTemp: null,
            unit: 'F',
        });
        fallsBelowFreezing.checkTemperature(32, 'F');
        assertSpyCalls(mockCallback, 1);
    });

    await t.step("should callback when there is no previously observed temperature and the current temperature falls below threshold", () => {
        const mockCallback = spy();
        const fallsBelowFreezing = new Threshold({
            value: 32,
            callback: mockCallback,
            direction: 'falling',
            lastObservedTemp: null,
            unit: 'F',
        });
        fallsBelowFreezing.checkTemperature(31.1, 'F');
        assertSpyCalls(mockCallback, 1);
    });

    await t.step("should not callback when there is no previously observed temperature and the current temperature is not above threshold", () => {
        const mockCallback = spy();
        const thaws = new Threshold({
            value: 32,
            callback: mockCallback,
            direction: 'rising',
            lastObservedTemp: null,
            unit: 'F',
        });
        thaws.checkTemperature(31.1, 'F');
        assertSpyCalls(mockCallback, 0);
    });

    await t.step("should callback when there is no previously observed temperature and the current temperature rises to threshold", () => {
        const mockCallback = spy();
        const thaws = new Threshold({
            value: 32,
            callback: mockCallback,
            direction: 'rising',
            lastObservedTemp: null,
            unit: 'F',
        });
        thaws.checkTemperature(32, 'F');
        assertSpyCalls(mockCallback, 1);
    });
});

Deno.test("Threshold Tests in Fahrenheit with previously observed temps", async (t) => {
    await t.step("should not callback when temperature falls but remains above threshold", () => {
        const mockCallback = spy();
        const fallsBelowFreezing = new Threshold({
            value: 32,
            callback: mockCallback,
            direction: 'falling',
            lastObservedTemp: 2,
            unit: 'F',
        });
        fallsBelowFreezing.checkTemperature(34, 'F');
        assertSpyCalls(mockCallback, 0);
        fallsBelowFreezing.checkTemperature(33, 'F');
        assertSpyCalls(mockCallback, 0);
    });

    await t.step("should callback when temperature falls to threshold", () => {
        const mockCallback = spy();
        const fallsBelowFreezing = new Threshold({
            value: 32,
            callback: mockCallback,
            direction: 'falling',
            lastObservedTemp: 34,
            minFlux: 1,
            unit: 'F',
        });
        fallsBelowFreezing.checkTemperature(32, 'F');
        assertSpyCalls(mockCallback, 1);
    });

    await t.step("should callback when temperature falls below threshold", () => {
        const mockCallback = spy();
        const fallsBelowFreezing = new Threshold({
            value: 32,
            callback: mockCallback,
            direction: 'falling',
            lastObservedTemp: 34,
            unit: 'F',
        });
        fallsBelowFreezing.checkTemperature(-1, 'F');
        assertSpyCalls(mockCallback, 1);
    });

    await t.step("should callback each time temperature is at or below threshold when direction is falling", () => {
        const mockCallback = spy();
        const fallsBelowFreezing = new Threshold({
            value: 32,
            callback: mockCallback,
            direction: 'falling',
            lastObservedTemp: 34,
            unit: 'F',
        });
        fallsBelowFreezing.checkTemperature(32, 'F');
        assertSpyCalls(mockCallback, 1);
        fallsBelowFreezing.checkTemperature(-2, 'F');
        assertSpyCalls(mockCallback, 2);
    });

    await t.step("should callback each time temperature is at or above threshold when direction is rising", () => {
        const mockCallback = spy();
        const thaws = new Threshold({
            value: 32,
            callback: mockCallback,
            direction: 'rising',
            lastObservedTemp: 30,
            unit: 'F',
        });
        thaws.checkTemperature(32, 'F');
        assertSpyCalls(mockCallback, 1);
        thaws.checkTemperature(35, 'F');
        assertSpyCalls(mockCallback, 2);
    });

    await t.step("should not callback when temperature rises above threshold and direction is falling", () => {
        const mockCallback = spy();
        const thaws = new Threshold({
            value: 32,
            callback: mockCallback,
            direction: 'falling',
            lastObservedTemp: 30,
            unit: 'F',
        });
        thaws.checkTemperature(35, 'F');
        assertSpyCalls(mockCallback, 0);
    });

    await t.step("should not callback when temperature falls below threshold, but minFlux was not met", () => {
        const mockCallback = spy();
        const freezes = new Threshold({
            value: 32,
            callback: mockCallback,
            direction: 'falling',
            lastObservedTemp: 34,
            minFlux: 10,
            unit: 'F',
        });
        freezes.checkTemperature(31, 'F');
        assertSpyCalls(mockCallback, 0);
    });

    await(t.step("should callback when temperature falls below threshold and minFlux was met", () => {
        const mockCallback = spy();
        const codenses = new Threshold({
            value: 212,
            callback: mockCallback,
            direction: 'falling',
            lastObservedTemp: 215,
            unit: 'F',
            minFlux: 1,
        });
        codenses.checkTemperature(210, 'F');
        assertSpyCalls(mockCallback, 1);
    }));

    await(t.step("should callback when temperature rises above threshold and minFlux was met", () => {
        const mockCallback = spy();
        const boils = new Threshold({
            value: 212,
            callback: mockCallback,
            direction: 'rising',
            lastObservedTemp: 211,
            unit: 'F',
            minFlux: 1,
        });
        boils.checkTemperature(213, 'F');
        assertSpyCalls(mockCallback, 1);
    }));

    await(t.step("should callback when temperature rises to threshold and minFlux was met", () => {
        const mockCallback = spy();
        const threshold = new Threshold({
            value: 212,
            callback: mockCallback,
            direction: 'rising',
            lastObservedTemp: 211,
            unit: 'F',
            minFlux: 1,
        });
        threshold.checkTemperature(212, 'F');
        assertSpyCalls(mockCallback, 1);
    }));
});

Deno.test("Threshold exceedsMinFlux", () => {

    Deno.test("minFlux tests with C units", () => {
        const threshold = new Threshold({
            value: 0,
            callback: () => {},
            direction: 'falling',
            lastObservedTemp: 2,
            minFlux: 1,
            unit: 'C',
        });
    
        const exceedsMinFlux = threshold.exceedsMinFlux(0, 'C');
        assertEquals(exceedsMinFlux, true);
    
        const doesNotExceedMinFlux = threshold.exceedsMinFlux(-0.5, 'C');
        assertEquals(doesNotExceedMinFlux, false);
    });

    Deno.test("minFlux tests with F units", () => {
        const threshold = new Threshold({
            value: 32,
            callback: () => {},
            direction: 'falling',
            lastObservedTemp: 34,
            minFlux: 1,
            unit: 'F',
        });
    
        const exceedsMinFlux = threshold.exceedsMinFlux(32, 'F');
        assertEquals(exceedsMinFlux, true);
    
        const doesNotExceedMinFlux = threshold.exceedsMinFlux(31, 'F');
        assertEquals(doesNotExceedMinFlux, false);
    });

    Deno.test("minFlux tests with no minFlux", () => {
        const threshold = new Threshold({
            value: 32,
            callback: () => {},
            direction: 'falling',
            lastObservedTemp: 34,            
        });

        const exceedsMinFluxInF = threshold.exceedsMinFlux(32, 'F');
        assertEquals(exceedsMinFluxInF, true);

        const exceedsMinFluxInC = threshold.exceedsMinFlux(0, 'C');
        assertEquals(exceedsMinFluxInC, true);
    });

    Deno.test("exceedsMinFlux converting from C to F", () => {
        const threshold = new Threshold({
            value: 32,
            callback: () => {},
            direction: 'falling',
            lastObservedTemp: 45,
            minFlux: 10,
            unit: 'F',
        });
        
        const exceedsMinFlux = threshold.exceedsMinFlux(0, 'C');
        assertEquals(exceedsMinFlux, true);

        const doesNotExceedMinFlux = threshold.exceedsMinFlux(-0.5, 'C');
        assertEquals(doesNotExceedMinFlux, false);

    });
});