import { Threshold } from './thermometerTypes.d.ts';

class Thermometer {
    private currentTemperature: number = 0;
    private lastTemperature: number = 0;
    private thresholds: Threshold[] = [];
    private lastNotifiedThresholds: Set<number> = new Set();

    public updateTemperature(n: number, unit: 'C' | 'F'): void {
        if(unit === 'C') {
            this.currentTemperature = n;
        } else {
            this.currentTemperature = (n - 32) * 5 / 9;
        }
        this.checkThresholds();
    }

    public setThreshold(t: Threshold): void {
        const { value, callback, direction, minFlux, message } = t;
        const defaultMessage = 
            `Temperature has breached ${value} degrees ${direction ? `while ${direction}` : ''}`;
        const threshold: Threshold = { 
            value, 
            callback, 
            direction, 
            minFlux, 
            message: message || defaultMessage,
        };
        this.thresholds.push(threshold);
    }

    private checkThresholds(): void {
        for(const t of this.thresholds) {
            const { value, callback, message } = t;
            const temperature = this.currentTemperature;

            if(this.shouldNotify(t)) {
                callback(temperature, message || '');
                this.lastNotifiedThresholds.add(value);
            }
        }
        this.lastTemperature = this.currentTemperature;
    };

    private shouldNotify(threshold: Threshold): boolean {
        const { value, direction, minFlux } = threshold;
        const temperature = this.currentTemperature;
        const lastTemperature = this.lastTemperature;

        if(minFlux && Math.abs(temperature - lastTemperature) < minFlux) {
            return false;
        }

        if(direction === 'rising') {
            return temperature >= value && lastTemperature < value;
        } else if(direction === 'falling') {
            return temperature <= value && lastTemperature > value;
        } else {
            return temperature === value
        }
    }
}

export default Thermometer;