# Camera Structure Documentation

## Overview
Each camera in the SafeWatch system now has three distinct properties for better organization and filtering. Additionally, cameras can be toggled on/off directly from the Live page for better control.

## Camera Properties

### 1. **Camera ID** (`id`)
- **Type**: Number
- **Description**: Unique identifier for each camera
- **Usage**: Used for routing and database references
- **Display**: Shows as "Camera #1", "Camera #2", etc.

### 2. **Position** (`position`)
- **Type**: String
- **Description**: Specific location/position where the camera is mounted
- **Examples**: 
  - Main Entrance
  - Parking Area
  - Hall
  - Main Door
  - Reception
  - Emergency Exit
- **Usage**: Describes the exact position within a location
- **Display**: Shows with door icon (🚪)

### 3. **Location** (`location`)
- **Type**: String
- **Description**: Broader area/region where the camera is located
- **Examples**:
  - Rohini
  - Narela
  - Dwarka
- **Usage**: Used for location-based filtering
- **Display**: Shows with map marker icon (📍)

## New Features

### Camera Toggle Control
Each camera can be turned ON or OFF directly from the Live page:
- **Toggle Switch Icon**: Visual indicator showing current camera status (green for ON, gray for OFF)
- **Turn ON/OFF Button**: Click to toggle camera status
- **Status Display**: Shows "Camera #X - ON/OFF" with corresponding colored toggle icon
- **Real-time Updates**: Camera feed updates immediately when toggled

### Toggle Button Styling
- **ON State**: Red "Turn OFF" button with green toggle icon
- **OFF State**: Green "Turn ON" button with gray toggle icon
- **Hover Effects**: Smooth color transitions on hover

## Current Camera Configuration

```javascript
const cameras = [
  { 
    id: 1, 
    position: "Main Entrance", 
    location: "Rohini", 
    url: "http://localhost:5000/video_feed", 
    isOnline: true 
  },
  { 
    id: 2, 
    position: "Parking Area", 
    location: "Rohini", 
    url: "http://localhost:5000/video_feed", 
    isOnline: false 
  },
  { 
    id: 3, 
    position: "Hall", 
    location: "Narela", 
    url: "http://localhost:5000/video_feed", 
    isOnline: false 
  },
  { 
    id: 4, 
    position: "Main Door", 
    location: "Narela", 
    url: "http://localhost:5000/video_feed", 
    isOnline: false 
  },
  { 
    id: 5, 
    position: "Reception", 
    location: "Dwarka", 
    url: "http://localhost:5000/video_feed", 
    isOnline: false 
  },
  { 
    id: 6, 
    position: "Emergency Exit", 
    location: "Dwarka", 
    url: "http://localhost:5000/video_feed", 
    isOnline: false 
  },
];
```

## Display Format

### Camera Toggle Control Bar
```
🔘 Camera #1 - ON          [Turn OFF]
```
or
```
⚪ Camera #1 - OFF         [Turn ON]
```

### Camera Tile Header
```
Camera #1                    [Online/Offline Badge]
🚪 Main Entrance
📍 Rohini
```

### Camera Detail Page Header
```
← Back to Camera Grid

🎥 Camera #1                 [Online]
   Main Entrance • Rohini
```

## Location Filter Options
- **All** - Shows all cameras
- **Rohini** - Shows cameras in Rohini area (Camera #1, #2)
- **Narela** - Shows cameras in Narela area (Camera #3, #4)
- **Dwarka** - Shows cameras in Dwarka area (Camera #5, #6)

## Files Updated
1. `frontend/src/components/CameraGrid.jsx`
   - Updated LiveCamera component props
   - Updated DummyCamera component props
   - Modified camera data structure
   - Added location filtering logic
   - **NEW**: Added camera toggle on/off functionality
   - **NEW**: Added toggle control UI above each camera feed

2. `frontend/src/pages/Live.jsx`
   - Updated location filter options to match areas
   - Changed from position-based to location-based filtering

3. `frontend/src/pages/CameraDetail.jsx`
   - Updated camera data structure
   - Modified display to show Camera ID, position, and location
   - Updated video feed alt text

4. `frontend/src/components/Navbar.jsx`
   - **NEW**: Added underline styling for active navigation links
   - **NEW**: Active links show red text with underline
   - **NEW**: Hover state matches active state styling (underline effect)
   - **NEW**: Smooth transitions between states

## Benefits of This Structure

1. **Hierarchical Organization**: Location (area) → Position (specific place) → Camera ID
2. **Better Filtering**: Users can filter by broader areas (Rohini, Narela, Dwarka)
3. **Clear Identification**: Each camera has a unique ID and clear position
4. **Scalability**: Easy to add new locations and positions
5. **User-Friendly**: Icons help distinguish between position and location
6. **Control**: Easy toggle on/off for each camera feed
7. **Visual Feedback**: Clear navigation with underlined active links

## Adding New Cameras

To add a new camera:

```javascript
{
  id: 7,                        // Next sequential ID
  position: "Back Gate",        // Specific position
  location: "Rohini",           // Area/region
  url: "http://localhost:5000/video_feed",
  isOnline: true
}
```

Remember to update the location filter in `Live.jsx` if adding a new location area.
