/**
 * Gauge abstraction for different types of vehicle gauges
 * This provides a common interface for all gauge implementations
 */

// Base gauge configuration interface
export interface GaugeConfig {
  minValue: number;
  maxValue: number;
  initialValue?: number;
}

// Base gauge interface that all gauge implementations should follow
export interface Gauge {
  // Core methods
  setValue(value: number): void;
  getValue(): number;

  // Animation
  animateTo(targetValue: number, duration?: number): Promise<void>;

  // Cleanup
  dispose(): void;
}

// Gauge types for vehicle instrumentation
export enum GaugeType {
  SPEEDOMETER = "speedometer",
  TACHOMETER = "tachometer",
  WATER_TEMP = "water_temp",
  OIL_TEMP = "oil_temp",
  FUEL = "fuel",
}

// Configuration for specific gauge types
export interface SpeedometerConfig extends GaugeConfig {
  showKph?: boolean;
  type: GaugeType.SPEEDOMETER;
  container: HTMLElement;
}

export interface TachometerConfig extends GaugeConfig {
  redlineStart?: number;
  type: GaugeType.TACHOMETER;
  container: HTMLElement;
}

export interface WaterTempConfig extends GaugeConfig {
  warningThreshold?: number;
  criticalThreshold?: number;
  type: GaugeType.WATER_TEMP;
  container: HTMLElement;
}

export interface OilTempConfig extends GaugeConfig {
  warningThreshold?: number;
  criticalThreshold?: number;
  type: GaugeType.OIL_TEMP;
  container: HTMLElement;
}

export interface FuelConfig extends GaugeConfig {
  lowFuelThreshold?: number;
  type: GaugeType.FUEL;
  container: HTMLElement;
}

// Union type for all gauge configurations
export type SpecificGaugeConfig =
  | SpeedometerConfig
  | TachometerConfig
  | WaterTempConfig
  | OilTempConfig
  | FuelConfig;
