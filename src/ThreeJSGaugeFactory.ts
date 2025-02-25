import {
  Gauge,
  GaugeFactory,
  GaugeType,
  SpecificGaugeConfig,
  SpeedometerConfig,
} from "./abstractions/Gauge";
import { ThreeJSSpeedometer } from "./Speedometer";

/**
 * ThreeJS implementation of the gauge factory
 * Creates different types of ThreeJS-based gauges
 */
export class ThreeJSGaugeFactory implements GaugeFactory {
  createGauge(config: SpecificGaugeConfig): Gauge {
    switch (config.type) {
      case GaugeType.SPEEDOMETER:
        return this.createSpeedometer(config as SpeedometerConfig);
      case GaugeType.TACHOMETER:
        // For now, we'll just return a placeholder message
        // This would be implemented in the future
        throw new Error("Tachometer not implemented yet");
      case GaugeType.WATER_TEMP:
        // For now, we'll just return a placeholder message
        // This would be implemented in the future
        throw new Error("Water temperature gauge not implemented yet");
      case GaugeType.OIL_TEMP:
        // For now, we'll just return a placeholder message
        // This would be implemented in the future
        throw new Error("Oil temperature gauge not implemented yet");
      case GaugeType.FUEL:
        // For now, we'll just return a placeholder message
        // This would be implemented in the future
        throw new Error("Fuel gauge not implemented yet");
      default:
        throw new Error(`Unknown gauge type: ${(config as any).type}`);
    }
  }

  private createSpeedometer(config: SpeedometerConfig): Gauge {
    if (!config.container) {
      throw new Error("Container is required for ThreeJS speedometer");
    }

    return new ThreeJSSpeedometer({
      container: config.container,
      minValue: config.minValue,
      maxValue: config.maxValue,
      initialValue: config.initialValue,
      startAngle: 140, // Default start angle (bottom left)
      endAngle: 400, // Default end angle (bottom right)
      showKph: config.showKph,
      needleColor: 0x00ff00,
    });
  }
}
