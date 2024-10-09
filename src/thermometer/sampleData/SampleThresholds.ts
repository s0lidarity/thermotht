import { Threshold } from "../../threshold/Threshold.ts";

export const freezes: Threshold = new Threshold(
    0,
    undefined,
    'falling',
    0, 
    2,
    'C',
);

export const boils: Threshold = new Threshold(
    100,
    undefined,
    'rising',
    0, 
    1,
    'C',
);

export const thaws: Threshold = new Threshold(
    0,
    undefined,
    'rising',
    0, 
    0.5,
    'C',
);

export const condenses: Threshold = new Threshold(
    100,
    undefined,
    'falling',
    0, 
    1,
    'C',
);

export const freezeOrThaw: Threshold = new Threshold(
    32,
    undefined,
    undefined,
    0, 
    2,
    'F',
);

export const boilOrCondense: Threshold = new Threshold(
    212,
    undefined,
    undefined,
    0, 
    2,
    'F',
);

export const sampleThresholds: Threshold[] = [
    freezes,
    boils,
    thaws,
    condenses,
    freezeOrThaw,
    boilOrCondense,
];