import { TemperatureUnit } from "../Thermometer/thermometerTypes.d.ts";
import { getTemperatureInCelsius } from "../Thermometer/Utils.ts";

export type ThresholdCallback = (message: string) => void;

export class Threshold {
    value: number;
    callback: ThresholdCallback;
    direction?: 'rising' | 'falling';
    lastObservedTemp: number | null;
    minFlux?: number | null;
    message: string;
    unit?: TemperatureUnit;

    private static defaultCallback = ( message: string) => {
        console.log(`${message}`);
    };

    constructor(
        value: number,
        callback: ThresholdCallback = Threshold.defaultCallback,
        direction?: 'rising' | 'falling',
        lastObservedTemp?: number | null,
        minFlux?: number,
        message?: string,
        unit?: TemperatureUnit,
    ) {
        this.value = value;
        this.callback = callback;
        this.direction = direction;
        this.lastObservedTemp = lastObservedTemp ?? null;
        this.minFlux = minFlux;
        this.message = message ?? `Temperature has breached ${value} degrees ${direction ? `while ${direction}` : ''}`;
        this.unit = unit;
    }

    updateLastObservedTemperature(currentTemperature: number, unit: TemperatureUnit = 'C'): void {
        if(unit === 'C') {
            this.lastObservedTemp = currentTemperature;
        } else {
            this.lastObservedTemp = getTemperatureInCelsius(currentTemperature);
        }
    };

    // might want to make this a boolean to trigger callback outside of this function for test purposes
    checkTemperature(currentTemperature: number, unit: TemperatureUnit): void {
        if(!this.lastObservedTemp){
            this.updateLastObservedTemperature(currentTemperature, unit);
            return;
        }

        let isFallingBelowThreshold = false;
        if (
            this.lastObservedTemp
            && this.lastObservedTemp > this.value
            && currentTemperature <= this.value
        ) isFallingBelowThreshold = true;

        let isRisingAboveThreshold = false;
        if(
            this.lastObservedTemp
            && this.lastObservedTemp < this.value
            && currentTemperature >= this.value
        ) isRisingAboveThreshold = true;

        // if direction is not specified, both rising and falling matter
        let risingMatters = true;
        let fallingMatters = true;

        if(this.direction){
            if(this.direction === 'rising') {
                risingMatters = true;
            } else if(this.direction === 'falling') {
                fallingMatters = true;
            }
        }


        if(!this.minFlux){
            if( (risingMatters && isRisingAboveThreshold) || (fallingMatters && isFallingBelowThreshold) ) {
                this.callback(this.message);
                this.lastObservedTemp = currentTemperature;
                return;
            }
        }

        if(this.minFlux){
            if(
                Math.abs(currentTemperature - this.lastObservedTemp) > this.minFlux
                && (risingMatters && isRisingAboveThreshold) || (fallingMatters && isFallingBelowThreshold)
            ) {
                this.callback(this.message);
            }
            this.lastObservedTemp = currentTemperature;
        } 
    }
}