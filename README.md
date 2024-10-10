# Thermo Take Home Test or therrmotht

Andrew Sobiesiak's submission for the Thermometer Take Home Test from Wizards of the Coast.

Built with typescript and deno. I chose Typescript because I enjoy it and am currently most comfortable in Typescript. I chose Deno because I wanted to try the new Deno 2.0 and keep the package small and tidy.

## Commands

```bash
deno test
```

> Runs all test files in the repository

```bash
deno test thermometer.test.ts 
```

> Runs only the thermometer specific tests

## Assumptions

1. the expected input matches the following format

    ```text
    1.5 C
    1.0 C
    -2.0 C
    ```

    > **Note** Each line contains one number followed by a 'C' or 'F' to indicate the unit of the measurement.

2. Thresholds are inclusive limits. A threshold has been met/breached when a new temperature matches or exceeds the defined threshold.
3. If there is a minimum fluctuation established, we do not update the temperature reading if a new temperature is smaller than the minimum fluctuation.
4. Thresholds need a direction or else any number will trigger them.
5. Minimum fluctuations are defined by the unit specified by the threshold.
