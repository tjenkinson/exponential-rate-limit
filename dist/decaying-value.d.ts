export declare class DecayingValue {
    private _value;
    private readonly _decayRate;
    private _time;
    constructor(_value: number, _decayRate: number);
    get(): number;
    set(value: number): void;
    increment(amount?: number): void;
}
