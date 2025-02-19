# gauges
digital gauges for beamng

### Getting Started

1. **Prerequisites**
   - Install [Node.js](https://nodejs.org/) (version 16 or higher)
   - Install [Git](https://git-scm.com/downloads)
   - A code editor (we recommend [Visual Studio Code](https://code.visualstudio.com/))

2. **Clone the Repository**
   ```bash
   # Open your terminal/command prompt
   git clone https://github.com/your-username/gauges.git
   cd gauges
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   This will start the development server at `http://localhost:3000`

5. **Create Your First Gauge**
   - Navigate to the `src/components/gauges` folder
   - Create a new file for your gauge (e.g., `MyGauge.tsx`)
   - Use the following template to get started:
   ```typescript
   import { useGaugeData } from '@/hooks/useGaugeData';

   export const MyGauge = () => {
     const { value } = useGaugeData('engineRPM'); // Replace with desired data point

     return (
       <div className="gauge">
         <h2>My Gauge</h2>
         <div>{value}</div>
       </div>
     );
   };
   ```

6. **Test Your Gauge**
   - Import and add your gauge to `src/pages/index.tsx`
   - The gauge will automatically update with live data when connected to BeamNG

7. **Basic Customization**
   - Modify the CSS in your gauge component
   - Use the provided hooks to access different vehicle data
   - Experiment with different layouts and visualizations

### Use Gauges

The output of this repo goes into a dist.zip. If you put that dist folder into a vehicle mod and then link the html file file in