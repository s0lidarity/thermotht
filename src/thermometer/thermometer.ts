import { Threshold } from "../threshold/Threshold.ts";
import { getTemperatureInCelsius } from "./Utils.ts";
import { TemperatureUnit } from "./ThermometerTypes.d.ts";
import { TemperatureReading } from "./ThermometerTypes.d.ts";

class Thermometer {
    private currentTemperature: number = 0;
    private thresholds: Threshold[] = [];

    constructor(initialTemperature: number = 0, initialThresholds: Threshold[] = []) {
        this.currentTemperature = initialTemperature;
        this.thresholds = initialThresholds;
    }

    public readTemperatureFeed(feed: string): TemperatureReading {
        const parts = feed.split(' ');
        const temperature = parseFloat(parts[0]);
        if(isNaN(temperature)){
            throw new Error(`Invalid temperature from feed: ${feed}`);
        }

        const unit = parts.length > 1 ? parts[1] as TemperatureUnit : 'C';

        this.updateTemperature(temperature, unit);
        return {temperature, unit};
    };

    public updateTemperature(n: number, unit: TemperatureUnit): void {
        if(unit === 'C') {
            this.currentTemperature = n;
        } else {
            this.currentTemperature = getTemperatureInCelsius(n);
        }
        this.checkThresholds();
    }

    public addThreshold(t: Threshold): void {
        this.thresholds.push(t);
    }

    private checkThresholds(): void {
        for(const t of this.thresholds) {
            t.checkTemperature(this.currentTemperature, t.unit ?? 'C');
        }
    };
}

export default Thermometer;