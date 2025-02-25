import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import helvetikerRegular from "three/examples/fonts/helvetiker_regular.typeface.json";
import { valueToAngle } from "./utils/gaugeUtils";
import { Gauge, GaugeConfig } from "./abstractions/Gauge";

// Base gauge configuration interface
export interface ThreeGaugeConfig extends GaugeConfig {
  container: HTMLElement;
  startAngle?: number; // in degrees
  endAngle?: number; // in degrees
  gaugeRadius?: number;
  backgroundColor?: number;
  tickColor?: string;
  needleColor?: number;
  size?: number; // Controls the apparent size of the gauge (default: 1.0)
  textConfig?: {
    fontSize?: number; // Base font size (default: 0.5)
    fontColor?: number; // Color of the text (default: 0xffffff)
    fontFamily?: string; // Font family to use (default: Arial)
  };
}

// Base gauge class that can be extended for different gauge types
export abstract class ThreeGauge implements Gauge {
  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  protected renderer: THREE.WebGLRenderer;
  protected needleGroup: THREE.Group;
  protected textGroup: THREE.Group;
  protected animationFrameId: number | null = null;

  protected config: Required<ThreeGaugeConfig>;
  protected currentValue: number;
  protected baseZPosition: number = 10; // Base camera Z position

  constructor(config: ThreeGaugeConfig) {
    // Set default values for optional config properties
    this.config = {
      container: config.container,
      minValue: config.minValue,
      maxValue: config.maxValue,
      startAngle: config.startAngle ?? 0,
      endAngle: config.endAngle ?? 360,
      initialValue: config.initialValue ?? config.minValue,
      gaugeRadius: config.gaugeRadius ?? 5,
      backgroundColor: config.backgroundColor ?? 0x000000,
      tickColor: config.tickColor ?? "#8080ff",
      needleColor: config.needleColor ?? 0xff0000,
      size: config.size ?? 1.0,
      textConfig: {
        fontSize: config.textConfig?.fontSize ?? 0.5,
        fontColor: config.textConfig?.fontColor ?? 0xffffff,
        fontFamily: config.textConfig?.fontFamily ?? "Arial",
      },
    };

    this.currentValue = this.config.initialValue;

    // Initialize Three.js components
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.needleGroup = new THREE.Group();
    this.textGroup = new THREE.Group();

    this.init();
  }

  protected init(): void {
    const { container, gaugeRadius, backgroundColor, needleColor, size } =
      this.config;

    // Set up renderer
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.renderer.setSize(width, height);
    container.appendChild(this.renderer.domElement);

    // Set up scene
    this.scene.background = new THREE.Color(backgroundColor);

    // Set up camera with size-adjusted position
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.camera.position.z = this.baseZPosition / size; // Adjust camera position based on size

    // Set up lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    // Create gauge face
    const gaugeGeometry = new THREE.CylinderGeometry(
      gaugeRadius,
      gaugeRadius,
      0.2,
      64
    );
    const gaugeMaterial = new THREE.MeshPhongMaterial({
      color: backgroundColor,
      specular: 0x333333,
      shininess: 40,
      emissive: 0x000000,
    });
    const gauge = new THREE.Mesh(gaugeGeometry, gaugeMaterial);
    gauge.rotation.x = Math.PI / 2;
    this.scene.add(gauge);

    // Create gauge rim with glass effect
    const rimGeometry = new THREE.TorusGeometry(gaugeRadius, 0.2, 16, 100);
    const rimMaterial = new THREE.MeshPhongMaterial({
      color: 0x444444,
      specular: 0xaaaaaa,
      shininess: 100,
      transparent: true,
      opacity: 0.9,
    });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.position.z = 0.1;
    this.scene.add(rim);

    // Add outer glow ring
    const outerRimGeometry = new THREE.TorusGeometry(
      gaugeRadius + 0.1,
      0.05,
      16,
      100
    );
    const outerRimMaterial = new THREE.MeshPhongMaterial({
      color: 0x555555,
      specular: 0xcccccc,
      shininess: 100,
      transparent: true,
      opacity: 0.5,
    });
    const outerRim = new THREE.Mesh(outerRimGeometry, outerRimMaterial);
    outerRim.position.z = 0.05;
    this.scene.add(outerRim);

    // Create needle
    this.createNeedle(needleColor);

    // Set initial needle position
    this.setValue(this.config.initialValue);

    // Start animation loop
    this.animate();

    // Handle window resize
    window.addEventListener("resize", this.handleResize);

    // Add text group to scene
    this.scene.add(this.textGroup);
  }

  // Abstract method to be implemented by subclasses to create gauge markings
  protected abstract createGaugeMarkings(): void;

  protected createNeedle(needleColor: number): void {
    // Create needle shape with depth
    const needleShape = new THREE.Shape();
    needleShape.moveTo(0, 0);
    needleShape.lineTo(-0.08, 0.2);
    needleShape.lineTo(-0.02, 3.8);
    needleShape.lineTo(0.02, 3.8);
    needleShape.lineTo(0.08, 0.2);
    needleShape.lineTo(0, 0);

    const extrudeSettings = {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
    };

    const needleGeometry = new THREE.ExtrudeGeometry(
      needleShape,
      extrudeSettings
    );
    const needleMaterial = new THREE.MeshPhongMaterial({
      color: needleColor,
      specular: 0xffffff,
      shininess: 100,
    });
    const needle = new THREE.Mesh(needleGeometry, needleMaterial);
    needle.position.z = 0.15;
    needle.position.x = -0.025;

    // Create needle backing (black part) with depth
    const needleBackShape = new THREE.Shape();
    needleBackShape.moveTo(0, 0);
    needleBackShape.lineTo(-0.08, 0.2);
    needleBackShape.lineTo(-0.02, 2.0);
    needleBackShape.lineTo(0.02, 2.0);
    needleBackShape.lineTo(0.08, 0.2);
    needleBackShape.lineTo(0, 0);

    const needleBackGeometry = new THREE.ExtrudeGeometry(needleBackShape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
    });
    const needleBackMaterial = new THREE.MeshPhongMaterial({
      color: 0x000000,
      specular: 0x222222,
      shininess: 50,
    });
    const needleBack = new THREE.Mesh(needleBackGeometry, needleBackMaterial);
    needleBack.position.z = 0.14;
    needleBack.position.x = -0.025;

    this.needleGroup.add(needle);
    this.needleGroup.add(needleBack);

    // Add needle center cap with depth
    const capGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.15, 32);
    const capMaterial = new THREE.MeshPhongMaterial({
      color: 0x444444,
      specular: 0xaaaaaa,
      shininess: 100,
    });
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.rotation.x = Math.PI / 2;
    cap.position.z = 0.2;
    cap.position.x = -0.025;

    // Add cap bevel ring
    const capRingGeometry = new THREE.TorusGeometry(0.3, 0.03, 16, 32);
    const capRingMaterial = new THREE.MeshPhongMaterial({
      color: 0x666666,
      specular: 0xcccccc,
      shininess: 100,
    });
    const capRing = new THREE.Mesh(capRingGeometry, capRingMaterial);
    capRing.rotation.x = Math.PI / 2;
    capRing.position.z = 0.25;
    capRing.position.x = -0.025;

    this.needleGroup.add(cap);
    this.needleGroup.add(capRing);

    this.scene.add(this.needleGroup);
  }

  protected createText(
    text: string,
    position: THREE.Vector3,
    options: {
      fontSize?: number;
      color?: number;
      fontFamily?: string;
    } = {}
  ): THREE.Mesh {
    const { textConfig } = this.config;
    const fontSize = options.fontSize ?? textConfig.fontSize;
    const color = options.color ?? textConfig.fontColor;
    const fontFamily = options.fontFamily ?? textConfig.fontFamily;

    const loader = new FontLoader();
    const font = loader.parse(helvetikerRegular);

    const geometry = new TextGeometry(text, {
      font: font,
      size: fontSize,
      // height: 0.05,
      curveSegments: 12,
      bevelEnabled: false,
    });

    const material = new THREE.MeshPhongMaterial({
      color: color,
      specular: 0x444444,
      shininess: 30,
    });

    const textMesh = new THREE.Mesh(geometry, material);
    textMesh.position.copy(position);

    // Center the text
    geometry.computeBoundingBox();
    const centerOffset = new THREE.Vector3();
    if (geometry.boundingBox) {
      centerOffset.x =
        -(geometry.boundingBox.max.x - geometry.boundingBox.min.x) / 2;
      centerOffset.y =
        -(geometry.boundingBox.max.y - geometry.boundingBox.min.y) / 2;
    }
    textMesh.position.add(centerOffset);

    this.textGroup.add(textMesh);
    return textMesh;
  }

  protected animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  };

  protected handleResize = (): void => {
    const { container, size } = this.config;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.position.z = this.baseZPosition / size; // Maintain size during resize
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public setValue(value: number): void {
    const { minValue, maxValue, startAngle, endAngle } = this.config;
    const clampedValue = Math.min(Math.max(value, minValue), maxValue);
    this.currentValue = clampedValue;

    // Convert value to angle in degrees
    const angle = valueToAngle(
      clampedValue,
      minValue,
      maxValue,
      startAngle,
      endAngle
    );

    // Convert to radians and adjust for THREE.js coordinate system
    // Add 90° to transform from 12 o'clock reference to THREE.js's 3 o'clock reference
    const angleRad = ((angle + 90) * Math.PI) / 180;
    this.needleGroup.rotation.z = -angleRad;
  }

  public getValue(): number {
    return this.currentValue;
  }

  public get minValue(): number {
    return this.config.minValue;
  }

  public get maxValue(): number {
    return this.config.maxValue;
  }

  public get startAngle(): number {
    return this.config.startAngle;
  }

  public get endAngle(): number {
    return this.config.endAngle;
  }

  public animateTo(
    targetValue: number,
    duration: number = 1000,
    easing: (t: number) => number = (t) => t
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      const startValue = this.currentValue;
      const startTime = performance.now();
      const endTime = startTime + duration;

      const animate = (time: number) => {
        if (time >= endTime) {
          this.setValue(targetValue);
          resolve();
          return;
        }

        const elapsed = time - startTime;
        const progress = elapsed / duration;
        const easedProgress = easing(progress);
        const currentValue =
          startValue + (targetValue - startValue) * easedProgress;

        this.setValue(currentValue);
        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    });
  }

  public dispose(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    window.removeEventListener("resize", this.handleResize);

    // Dispose of Three.js resources
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.geometry) {
          object.geometry.dispose();
        }

        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => {
              if (material.map) material.map.dispose();
              material.dispose();
            });
          } else {
            if (object.material.map) object.material.map.dispose();
            object.material.dispose();
          }
        }
      }
    });

    this.renderer.dispose();
    this.renderer.forceContextLoss();
    const canvas = this.renderer.domElement;
    canvas.parentElement?.removeChild(canvas);

    // Add text geometry disposal
    this.textGroup.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      }
    });
  }

  public setSize(newSize: number): void {
    this.config.size = newSize;
    this.camera.position.z = this.baseZPosition / newSize;

    // Scale text group inversely to maintain readable text size
    const scale = 1 / newSize;
    this.textGroup.scale.set(scale, scale, scale);

    this.camera.updateProjectionMatrix();
  }
}
