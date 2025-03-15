# Automotive Gauges Project

This project provides a collection of customizable automotive gauges for racing simulation or real-world automotive applications. It includes traditional gauges as well as a FuelTech-style digital dashboard.

## Features

- Traditional analog-style gauges (speedometer, tachometer, temperature)
- FuelTech FT550-style digital dashboard
- Real-time data updates
- Responsive design
- Easy switching between different gauge styles

## Gauge Types

### Standard Gauges
- Speedometer
- Tachometer (with redline indicator)
- Temperature Gauge
- Gear Indicator

### FuelTech Dashboard
The FuelTech dashboard displays:
- RPM with visual bar graph
- Speed
- MAP (Manifold Absolute Pressure)
- O2 Sensors (Left and Right AFR)
- Front Brake Pressure
- Injector Pulse Width
- Throttle Position
- Fuel Pressure
- Battery Voltage
- Oil Pressure
- Timing
- O2 Correction
- Data Logging Status

## Usage

1. Run the application
2. Use the dropdown in the top-right corner to switch between gauge styles:
   - Default Gauges: Traditional analog-style gauges
   - FuelTech Dashboard: Digital FuelTech FT550-style dashboard
   - Dev Mode: Development testing mode (only available in dev environment)

## Development

The project is built with:
- React
- TypeScript
- Tailwind CSS
- Canvas API for custom graphics

### Project Structure

- `src/components/`: UI components
- `src/hooks/`: Custom React hooks
- `src/store/`: State management using Zustand
- `src/beam.ts`: Game interface integration

### Adding New Gauges

To add a new gauge:
1. Create a new component in `src/components/`
2. Add any required data to the game data store
3. Create a custom hook if needed for gauge-specific logic
4. Add the gauge to the appropriate App component

## License

MIT