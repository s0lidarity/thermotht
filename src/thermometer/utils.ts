export function getTemperatureInFahrenheit(temperatureInCelsius: number): number {
    return temperatureInCelsius * 9 / 5 + 32;
};

export function getTemperatureInCelsius(temperatureInFahrenheit: number): number {
    return (temperatureInFahrenheit - 32) * 5 / 9;
};