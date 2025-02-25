import { createGaugeTexture } from "./utils/gaugeUtils";
import { ThreeJSGauge, ThreeJSGaugeConfig } from "./ThreeJSGauge";
import * as THREE from "three";

// Speedometer-specific configuration interface
export interface ThreeJSSpeedometerConfig extends ThreeJSGaugeConfig {
  showKph?: boolean;
}

// Speedometer implementation that extends the base gauge
export class ThreeJSSpeedometer extends ThreeJSGauge {
  private showKph: boolean;

  constructor(config: ThreeJSSpeedometerConfig) {
    super(config);
    this.showKph = config.showKph ?? true;
    this.createGaugeMarkings();
  }

  protected createGaugeMarkings(): void {
    const { gaugeRadius, startAngle, endAngle, minValue, maxValue, tickColor } =
      this.config;

    // Create gauge markings
    const markingsGeometry = new THREE.CircleGeometry(gaugeRadius - 0.3, 64);
    const markingsTexture = new THREE.CanvasTexture(
      createGaugeTexture({
        startAngle,
        endAngle,
        minValue,
        maxValue,
        tickColor,
        showKph: this.showKph,
      })
    );
    const markingsMaterial = new THREE.MeshBasicMaterial({
      map: markingsTexture,
      transparent: true,
    });
    const markings = new THREE.Mesh(markingsGeometry, markingsMaterial);
    markings.position.z = 0.11;
    this.scene.add(markings);
  }
}
