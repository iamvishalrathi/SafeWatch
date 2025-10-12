# Camera Structure Documentation

## Overview
Each camera in the SafeWatch system now has three distinct properties for better organization and filtering. Additionally, cameras can be enabled/disabled using a toggle switch directly on each camera feed for better control.

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

### 4. **Enabled Status** (`isEnabled`)
- **Type**: Boolean
- **Description**: Controls whether the camera feed is active or disabled
- **Usage**: User can toggle this to enable/disable camera input
- **Default**: true (enabled)
- **Display**: Toggle switch on camera header

## New Features

### Camera Toggle Control
Each camera has a toggle switch directly on its feed for instant enable/disable control:

#### Live Page (Camera Grid)
- **Location**: Top-right corner of each camera tile header
- **Toggle Switch**: Modern iOS-style toggle switch
  - **Enabled (ON)**: Green background, switch on right
  - **Disabled (OFF)**: Gray background, switch on left
- **Visual Feedback**: 
  - Camera icon color changes (green when enabled, gray when disabled)
  - Feed shows different content based on state
- **Click Behavior**: Toggle doesn't interfere with camera navigation
- **Feed States**:
  - **Enabled + Online**: Shows live video feed
  - **Enabled + Feed Error**: Shows error message with warning icon
  - **Disabled**: Shows "Camera Disabled" message

#### Camera Detail Page
- **Location**: Top-right of "Live Camera Feed" header
- **Toggle Switch**: Same iOS-style toggle as grid view
- **Status Label**: Shows "Enabled" or "Disabled" next to toggle
- **Feed States**:
  - **Enabled + Online**: Shows full-size live video feed (664x450px)
  - **Enabled + Offline**: Shows "Camera Unavailable" with error icon
  - **Disabled**: Shows "Camera Disabled" message

### Toggle Switch Design
```css
- Width: 44px (11 units)
- Height: 24px (6 units)
- Border Radius: Fully rounded
- Background (OFF): Gray (#4B5563)
- Background (ON): Green (#16A34A)
- Switch Circle: White, 20px diameter
- Transition: Smooth slide animation
```

## Current Camera Configuration

```javascript
const cameras = [
  { 
    id: 1, 
    position: "Main Entrance", 
    location: "Rohini", 
    url: "http://localhost:5000/video_feed", 
    isOnline: true,
    isEnabled: true  // Can be toggled by user
  },
  { 
    id: 2, 
    position: "Parking Area", 
    location: "Rohini", 
    url: "http://localhost:5000/video_feed", 
    isOnline: false,
    isEnabled: true
  },
  { 
    id: 3, 
    position: "Hall", 
    location: "Narela", 
    url: "http://localhost:5000/video_feed", 
    isOnline: false,
    isEnabled: true
  },
  { 
    id: 4, 
    position: "Main Door", 
    location: "Narela", 
    url: "http://localhost:5000/video_feed", 
    isOnline: false,
    isEnabled: true
  },
  { 
    id: 5, 
    position: "Reception", 
    location: "Dwarka", 
    url: "http://localhost:5000/video_feed", 
    isOnline: false,
    isEnabled: true
  },
  { 
    id: 6, 
    position: "Emergency Exit", 
    location: "Dwarka", 
    url: "http://localhost:5000/video_feed", 
    isOnline: false,
    isEnabled: true
  },
];
```

## Display Format

### Camera Tile Header (Live Page Grid)
```
Camera #1                    [Toggle Switch 🟢]
🚪 Main Entrance
📍 Rohini
```

When disabled:
```
Camera #1                    [Toggle Switch ⚪]
🚪 Main Entrance
📍 Rohini
[Camera Disabled - Turn on to view feed]
```

### Camera Detail Page Header
```
← Back to Camera Grid

🎥 Camera #1       Enabled [Toggle Switch 🟢]
   Main Entrance • Rohini
```

## Location Filter Options
- **All** - Shows all cameras
- **Rohini** - Shows cameras in Rohini area (Camera #1, #2)
- **Narela** - Shows cameras in Narela area (Camera #3, #4)
- **Dwarka** - Shows cameras in Dwarka area (Camera #5, #6)

## Files Updated

### 1. `frontend/src/components/CameraGrid.jsx`
   - Updated LiveCamera component with toggle switch
   - Added `isEnabled` prop and `onToggle` callback
   - Toggle switch integrated directly in camera header
   - Click event handling to prevent navigation when toggling
   - Modified camera data structure to include `isEnabled` property
   - Added location filtering logic
   - Shows different states: Enabled+Live, Enabled+Error, Disabled
   - Updated stats to show "Cameras Enabled" instead of "Online"

### 2. `frontend/src/pages/Live.jsx`
   - Updated location filter options to match areas (Rohini, Narela, Dwarka)
   - Changed from position-based to location-based filtering

### 3. `frontend/src/pages/CameraDetail.jsx`
   - **NEW**: Added toggle switch in video feed header
   - **NEW**: Added `isCameraEnabled` state management
   - Toggle switch with "Enabled/Disabled" label
   - Conditional rendering based on enabled status
   - Shows "Camera Disabled" message when toggled off
   - Maintains all original functionality (alerts, screenshots, maps)

3. `frontend/src/pages/CameraDetail.jsx`
   - Updated camera data structure
### 4. `frontend/src/components/Navbar.jsx`
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
6. **Instant Control**: Toggle switch on each camera for instant enable/disable
7. **Visual Feedback**: 
   - Clear navigation with underlined active links
   - Toggle switch shows enabled/disabled state
   - Camera icon color indicates status
8. **Privacy Control**: Users can disable camera feeds they don't want to monitor
9. **Resource Management**: Disabling cameras can reduce bandwidth/processing

## Toggle Feature Benefits

1. **User Control**: Direct control over which cameras are active
2. **Privacy**: Can temporarily disable cameras
3. **Focus**: Disable unneeded cameras to focus on important feeds
4. **Non-Destructive**: Toggle is temporary, doesn't affect camera configuration
5. **Instant Feedback**: Immediate visual response when toggling
6. **Accessible**: Works on both grid view and detail pages

## Adding New Cameras

To add a new camera:

```javascript
{
  id: 7,                        // Next sequential ID
  position: "Back Gate",        // Specific position
  location: "Rohini",           // Area/region
  url: "http://localhost:5000/video_feed",
  isOnline: true,               // Physical camera status
  isEnabled: true               // User control toggle
}
```

Remember to update the location filter in `Live.jsx` if adding a new location area.
