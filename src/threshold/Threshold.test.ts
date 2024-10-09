import { assertSpyCalls, spy } from "@std/testing/mock";
import { Threshold } from "./Threshold.ts";


Deno.test("Threshold", () => {
    const mockCallback = spy();

    const t = new Threshold(
        0, 
        mockCallback, 
        'falling',
        0, 
        1, 
        'C'
    );

    t.checkTemperature(2, 'C');
    assertSpyCalls(mockCallback, 0);
    t.checkTemperature(1, 'C');
    assertSpyCalls(mockCallback, 0);
    t.checkTemperature(0, 'C');
    assertSpyCalls(mockCallback, 1);
    t.checkTemperature(-1, 'C');
    assertSpyCalls(mockCallback, 1);
    t.checkTemperature(0, 'C');
    assertSpyCalls(mockCallback, 1);
    t.checkTemperature(0.75, 'C');
    assertSpyCalls(mockCallback, 1);
    t.checkTemperature(0, 'C');
    assertSpyCalls(mockCallback, 1);
    t.checkTemperature(-0.5, 'C');
    assertSpyCalls(mockCallback, 2)
});