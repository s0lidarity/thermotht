import { Threshold } from "../threshold/Threshold.ts";
import { getTemperatureInCelsius } from "./Utils.ts";
import { TemperatureUnit } from "./ThermometerTypes.d.ts";

class Thermometer {
    private currentTemperature: number = 0;
    private lastTemperature: number = 0;
    private thresholds: Threshold[] = [];

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
        this.lastTemperature = this.currentTemperature;
    };
}

export default Thermometer;