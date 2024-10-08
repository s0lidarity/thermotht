export type ThresholdCallback = (value: number, message: string) => void;

export interface Threshold {
    value: number;
    callback: ThresholdCallback;
    direction?: 'rising' | 'falling';
    minFlux?: number;
    message?: string;
}

export interface TemperatureReading {
    temperature: number;
    unit: 'C' | 'F';
}