import { TemperatureUnit } from "../thermometer/ThermometerTypes.d.ts";
import { getTemperatureInCelsius, getTemperatureInFahrenheit } from "../thermometer/Utils.ts";

export type ThresholdCallback = (currentTemp: number, value: number, direction?: 'rising' | 'falling') => void;

interface ThresholdParams {
    value: number;
    callback: ThresholdCallback;
    direction: 'rising' | 'falling';
    lastObservedTemp: number | null;
    minFlux?: number | null;
    unit?: TemperatureUnit;
}

export class Threshold {
    value: number;
    callback: ThresholdCallback;
    direction?: 'rising' | 'falling';
    lastObservedTemp: number | null;
    minFlux?: number | null;
    unit?: TemperatureUnit;
    risingMatters: boolean;
    fallingMatters: boolean;

    private static defaultCallback: ThresholdCallback = (currentTemp: number, value: number, direction?: 'rising' | 'falling') => {
        console.log(`Temperature has breached ${value} degrees at ${currentTemp} ${direction ? `while ${direction}` : ''}`);
    };

    constructor({
        value,
        callback,
        direction,
        lastObservedTemp,
        minFlux,
        unit,
    }: ThresholdParams ) {
        this.value = value;
        this.callback = callback || ((currentTemperature: number) => Threshold.defaultCallback(currentTemperature, this.value, this.direction));
        this.direction = direction;
        this.lastObservedTemp = lastObservedTemp ?? null;
        this.minFlux = minFlux;
        this.unit = unit ? unit : 'C';
        this.risingMatters = !direction || direction === 'rising';
        this.fallingMatters = !direction || direction === 'falling';
    }

    updateLastObservedTemperature(currentTemperature: number, unit: TemperatureUnit = 'C'): void {
        if(unit === 'C') {
            this.lastObservedTemp = currentTemperature;
        } else {
            this.lastObservedTemp = getTemperatureInCelsius(currentTemperature);
        }
    };

    exceedsMinFlux(currentTemperature: number, incomingUnit: TemperatureUnit): boolean {
        // special case, no minFlux to beat
        if(!this.minFlux) return true;
        // special case, no previously observed temperature, cannot calculate flux
        if(!this.lastObservedTemp) return false;
        // if units match, compare as is
        if(this.unit === incomingUnit){
            return Math.abs(currentTemperature - this.lastObservedTemp) >= this.minFlux;
        }
        
        // convert currentTemp to Celsius to standardize units
        if(this.unit === 'C' && incomingUnit === 'F') {
            return Math.abs(getTemperatureInCelsius(currentTemperature) - this.lastObservedTemp) >= this.minFlux;
        }
        // convert our lastOvservedTemp to F to standarize units
        if(this.unit === 'F' && incomingUnit === 'C' ) {
            return Math.abs(currentTemperature - getTemperatureInFahrenheit(this.lastObservedTemp)) >= this.minFlux;
        }

        // fallthrough, should not be possible
        console.error(`exceedsMiniFlux found a new special case: 
            currentTemp: ${currentTemperature}
            incomingUnit: ${incomingUnit}
            this.unit: ${this.unit}
            this.lastObservedTemp: ${this.lastObservedTemp}`);
        return false;
    };

    // refactor opportunity, split into smaller functions to simplify testing
    checkTemperature(currentTemperature: number, unit: TemperatureUnit): void {
        // accounting for no previously observed temperature        
        if(!this.lastObservedTemp){
            this.updateLastObservedTemperature(currentTemperature, unit);
            if(this.value === currentTemperature) {
                this.callback(currentTemperature, this.value, this.direction);
                return;
            } 
            if(this.risingMatters && currentTemperature > this.value) {
                this.callback(currentTemperature, this.value, this.direction);
                return;
            } 
            if (this.fallingMatters && currentTemperature < this.value) {
                this.callback(currentTemperature, this.value, this.direction);
                return;
            }
        }

        // if the change in temperature is too small, do not callback
        if(
            this.minFlux 
            && !this.exceedsMinFlux(currentTemperature, unit)
        ) return;

        // establishing flags to simplify logic
        let isFallingBelowThreshold = false;
        if (
            currentTemperature <= this.value
        ) isFallingBelowThreshold = true;

        let isRisingAboveThreshold = false;
        if(
            currentTemperature >= this.value
        ) isRisingAboveThreshold = true;

        if( (this.risingMatters && isRisingAboveThreshold) || (this.fallingMatters && isFallingBelowThreshold) ) {
            this.callback(currentTemperature, this.value, this.direction);
            this.lastObservedTemp = currentTemperature;
        }
    }
}

export default Threshold;