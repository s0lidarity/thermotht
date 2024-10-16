// temperature feed celsius sample 1
// for testing temp thresholds around freezing in celsius
// should trigger 6 falling callbacks
export const tfc1 = [
    "1.5 C",
    "1.0 C",
    "0.5 C",
    "0.0 C",
    "-0.5 C",
    "0.0 C",
    "-0.5 C",
    "0.0 C",
    "0.5 C",
    "0.0 C",
];

// temperature feed celsius sample 2
// for testing temp thresholds around boiling in celsius
// should trigger 4 rising callbacks & 6 falling callbacks
export const tfc2 = [
    "99.5 C",
    "99.0 C",
    "98.5 C",
    "99.5 C",
    "100.0 C",
    "100.5 C",
    "101.0 C",
    "100.5 C",
    "99.0 C",
];

// temperature feed celsius sample 3
// for testing temp thresholds in the negative range in celsius
export const tfc3 = [
    "-10.5 C",
    "-20.0 C",
    "-21.5 C",
    "-30.0 C",
    "-30.5 C",
    "-40.0 C",
    "-40.5 C",
    "-50.0 C",
    "-40.5 C",
    "-50.0 C",
];


// temperature feed fahrenheit sample 1
// for testing temp thresholds around freezing in fahrenheit
// should trigger 6 falling callbacks
export const tff1 = [
    "35.0 F",
    "34.0 F",
    "33.0 F",
    "32.0 F",
    "31.0 F",
    "32.0 F",
    "31.0 F",
    "32.0 F",
    "33.0 F",
    "32.0 F",
];

// temperature feed fahrenheit sample 2
// for testing temp thresholds around boiling in fahrenheit
export const tff2 = [
    "211.1 F",
    "210.2 F",
    "209.4 F",
    "211.1 F",
    "212.0 F",
    "212.9 F",
    "213.8 F",
    "212.9 F",
    "210.2 F",
];

// temperature feed fahrenheit sample 3
// for testing temp thresholds in the negative range in fahrenheit
export const tff3 = [
    "-12.1 F",
    "-4.0 F",
    "-6.3 F",
    "-22.0 F",
    "-23.9 F",
    "-40.0 F",
    "-40.9 F",
    "-58.0 F",
    "-40.9 F",
    "-58.0 F",
];

// temperature feed mixed sample 1
// crosses freezing and boiling in each direction mixing C & F
export const tfm1 = [
    "1.5 C",
    "0.5C",
    "32.0 F",
    "-1.0 C",
    "33.8 F",
    "209.0 F",
    "102.0 C",
    "210.0 F",
]
