export type TemperatureUnit = 'C' | 'F';

export interface TemperatureReading {
    temperature: number;
    unit: TemperatureUnit;
}