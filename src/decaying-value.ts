export class DecayingValue {
  private _time = Date.now();

  constructor(private _value: number, private readonly _decayRate: number) {}

  public get(): number {
    const diff = (Date.now() - this._time) / 1000;
    return Math.max(0, this._value - (this._decayRate * diff));
  }

  public set(value: number): void {
    this._value = value;
    this._time = Date.now();
  }

  public increment(amount = 1): void {
    this.set(this.get() + amount);
  }
}
