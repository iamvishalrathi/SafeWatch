# 🎨 SheSafe Frontend - React Dashboard

## 📋 Overview

The SheSafe frontend is a modern React.js application that provides a user-friendly dashboard for monitoring the AI-powered safety detection system. It displays live video feeds, safety alerts, analytics, and interactive maps for comprehensive safety monitoring.

## 🔧 Features

- **Live Video Dashboard**: Real-time video feed display from backend
- **Alert Management**: View and manage safety alerts
- **Interactive Maps**: Geographic visualization of incidents using Leaflet
- **Analytics Dashboard**: Charts and statistics using Chart.js
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Modern UI/UX**: Smooth animations with GSAP and Framer Motion
- **Real-time Updates**: Live data synchronization with backend

## 📋 Prerequisites

- **Node.js 16.0 or higher**
- **npm 8.0+ or yarn 1.22+**
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **Backend server running** on `http://localhost:5000`

## 🚀 Installation & Setup

### 1. Navigate to Frontend Directory

```bash
cd "c:\Users\Vishal\OneDrive\Desktop\Personal\Projects\Group Projects\SheSafe\frontend"
```

### 2. Install Dependencies

**Using npm:**
```bash
npm install
```

**Using yarn:**
```bash
yarn install
```

### 3. Verify Package Installation

Check that these key packages are installed:
```bash
npm list react react-dom react-router-dom
```

## 🏃‍♀️ Running the Frontend

### Start Development Server

**Using npm:**
```bash
npm run dev
```

**Using yarn:**
```bash
yarn dev
```

**Expected Output:**
```
  VITE v5.4.1  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 🌐 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Start development server with hot reload |
| Build | `npm run build` | Create production build |
| Preview | `npm run preview` | Preview production build locally |
| Lint | `npm run lint` | Run ESLint for code quality |

### Production Build

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

**Build output location:** `dist/` directory

## 📱 Application Features

### Navigation

- **Home** (`/`) - Landing page and main dashboard
- **Live Feed** (`/live`) - Real-time video monitoring
- **Alerts** (`/alerts`) - Safety alerts management
- **Events** (`/events`) - Incident history and analytics
- **Contact** (`/contact`) - Support and contact information

### Components

| Component | Description | Location |
|-----------|-------------|----------|
| Navbar | Main navigation header | `src/components/Navbar.jsx` |
| VideoFeed | Live video stream display | `src/components/VideoFeed.jsx` |
| HotspotMap | Interactive safety map | `src/components/HotspotMap.jsx` |
| Piegraph | Analytics charts | `src/components/Piegraph.jsx` |
| Footer | Application footer | `src/components/Footer.jsx` |

## ⚙️ Configuration

### Backend Connection

Edit `src/utils/axiosInstance.js` to configure backend URL:

```javascript
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Backend server URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default axiosInstance;
```

### Environment Variables

Create `.env` file in root directory:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_TITLE=SheSafe Dashboard
VITE_MAP_API_KEY=your_map_api_key
```

Access in components:
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## 🎨 Styling & Theme

### Tailwind CSS Configuration

The project uses Tailwind CSS for styling. Configuration in `tailwind.config.js`:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#218EA6',
        'secondary': '#FF6B6B',
        // Custom colors
      }
    },
  },
  plugins: [],
}
```

### Custom Styles

Additional styles in `src/index.css` and `src/App.css`

## 📡 API Integration

### Connecting to Backend

The frontend connects to backend endpoints:

```javascript
// Get live video feed
const videoFeedUrl = `${API_BASE_URL}/video_feed`;

// Fetch alerts
const fetchAlerts = async () => {
  try {
    const response = await axiosInstance.get('/alerts');
    return response.data;
  } catch (error) {
    console.error('Error fetching alerts:', error);
  }
};

// Get alert image
const getAlertImage = (alertId) => {
  return `${API_BASE_URL}/alert_image/${alertId}`;
};
```

### Real-time Updates

For real-time features, consider adding WebSocket connection:

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('new_alert', (alert) => {
  // Handle new alert
  setAlerts(prevAlerts => [...prevAlerts, alert]);
});
```

## 🗺️ Maps Integration

### Leaflet Maps Setup

The app uses React Leaflet for maps:

```javascript
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function SafetyMap({ incidents }) {
  return (
    <MapContainer center={[28.6139, 77.2090]} zoom={13}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {incidents.map(incident => (
        <Marker 
          key={incident.id} 
          position={[incident.latitude, incident.longitude]}
        >
          <Popup>{incident.alert_type}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
```

## 📊 Analytics & Charts

### Chart.js Integration

Display safety analytics:

```javascript
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function SafetyChart({ data }) {
  const chartData = {
    labels: ['Safe Areas', 'Alert Areas', 'High Risk'],
    datasets: [{
      data: [data.safe, data.alert, data.risk],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
    }]
  };

  return <Pie data={chartData} />;
}
```

## 🐛 Troubleshooting

### Common Issues

**1. Development server won't start:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**2. Backend connection failed:**
- Ensure backend server is running on `http://localhost:5000`
- Check CORS configuration in backend
- Verify firewall/antivirus isn't blocking connections

**3. Build fails:**
```bash
# Check for TypeScript errors
npm run lint

# Update dependencies
npm update
```

**4. Styling issues:**
```bash
# Rebuild Tailwind CSS
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch
```

**5. Hot reload not working:**
- Check Vite configuration in `vite.config.js`
- Ensure files are saved properly
- Try restarting development server

### Debug Mode

Enable detailed logging:
```javascript
// In main.jsx or App.jsx
if (import.meta.env.DEV) {
  console.log('Development mode enabled');
}
```

## 📱 Mobile Responsiveness

The app is designed to be mobile-friendly:

```css
/* Responsive design classes */
.container {
  @apply px-4 sm:px-6 lg:px-8;
  @apply mx-auto max-w-7xl;
}

/* Mobile-first approach */
.grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3;
}
```

## 🔒 Security Considerations

- **API Keys**: Store sensitive keys in environment variables
- **HTTPS**: Use HTTPS in production
- **CORS**: Configure proper CORS headers
- **Input Validation**: Validate user inputs
- **Authentication**: Implement user authentication if needed

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Static Hosting

**Netlify:**
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Apache/Nginx:**
```bash
# Copy dist folder to web server
cp -r dist/* /var/www/html/
```

## 📊 Performance Optimization

### Bundle Analysis

```bash
npm install --save-dev rollup-plugin-visualizer
npm run build
```

### Lazy Loading

```javascript
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./components/HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

## 🔄 Development Workflow

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── Navbar.jsx
│   ├── VideoFeed.jsx
│   └── HotspotMap.jsx
├── pages/               # Page components
│   ├── Home.jsx
│   ├── Live.jsx
│   └── Alerts.jsx
├── utils/               # Utility functions
│   └── axiosInstance.js
├── assets/              # Static assets
│   └── images/
├── App.jsx              # Main app component
└── main.jsx            # Entry point
```

### Adding New Features

1. **New Page**: Add to `src/pages/` and update routing in `App.jsx`
2. **New Component**: Add to `src/components/`
3. **New API Call**: Update `src/utils/axiosInstance.js`
4. **New Styles**: Use Tailwind classes or add to CSS files

## 📞 Support

For frontend-specific issues:
- Check browser console for JavaScript errors
- Verify backend connectivity
- Test responsive design on different devices
- Check network tab for failed API calls

---

🎨 **SheSafe Frontend** - Modern React Safety Dashboard
