# Thermo Take Home Test or therrmotht

Andrew Sobiesiak's submission for the Thermometer Take Home Test from Wizards of the Coast.

Built with typescript and deno.

## Commands

```bash
deno test
```

Runs all test files in the repository.

```bash
deno test thermometer.test.ts 
```

Runs only the thermometer specific tests

```bash
deno run thermometer.ts
```

Runs the thermometer class
params:

1. file with temperature change input separated by line


Assumptions:

1. the expected input matches the following format

```text
1.5 C
1.0 C
-2.0 C
```

Each line contains one number followed by a 'C' or 'F' to indicate the unit of the measurement.


2. A threshold has been met/breached when a new temperature matches or exceeds the defined threshold