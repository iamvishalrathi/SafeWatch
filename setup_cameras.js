/**
 * Camera Setup Script - SINGLE SOURCE OF TRUTH
 * 
 * This script initializes all cameras in the SafeWatch system.
 * Run this in browser console on Live page (http://localhost:5173/live)
 * 
 * Setup: 2 Narela, 2 Rohini, 1 Bawana, 1 Kanjhawla (6 total cameras)
 * 
 * IMPORTANT: This script overwrites any existing cameras in localStorage
 * All camera data should be managed through this script
 */

const cameras = [
  // Narela Cameras (2)
  {
    id: 1,
    position: "Main Gate",
    location: "Narela",
    locality: "Sector 1",
    model: "Hikvision DS-2CD2043G0-I",
    lat: 28.8500,
    lng: 77.0900,
    url: "http://localhost:5000/video_feed",
    isOnline: true,
    isEnabled: true
  },
  {
    id: 2,
    position: "Community Center",
    location: "Narela",
    locality: "Sector 2",
    model: "Dahua IPC-HFW2431S-S",
    lat: 28.8510,
    lng: 77.0910,
    url: "http://localhost:5000/video_feed",
    isOnline: false,
    isEnabled: true
  },
  
  // Rohini Cameras (2)
  {
    id: 3,
    position: "Main Entrance",
    location: "Rohini",
    locality: "Sector 10",
    model: "Axis M3046-V",
    lat: 28.7041,
    lng: 77.1025,
    url: "http://localhost:5000/video_feed",
    isOnline: true,
    isEnabled: true
  },
  {
    id: 4,
    position: "Parking Area",
    location: "Rohini",
    locality: "Sector 15",
    model: "CP Plus CP-UNC-TA40L3",
    lat: 28.7050,
    lng: 77.1030,
    url: "http://localhost:5000/video_feed",
    isOnline: false,
    isEnabled: true
  },
  
  // Bawana Camera (1)
  {
    id: 5,
    position: "Industrial Area Gate",
    location: "Bawana",
    locality: "Industrial Area",
    model: "Hikvision DS-2CD2143G0-I",
    lat: 28.7971,
    lng: 77.0325,
    url: "http://localhost:5000/video_feed",
    isOnline: false,
    isEnabled: true
  },
  
  // Kanjhawla Camera (1)
  {
    id: 6,
    position: "Market Square",
    location: "Kanjhawla",
    locality: "Central Market",
    model: "Dahua IPC-HDBW2431R-ZS",
    lat: 28.8328,
    lng: 77.0167,
    url: "http://localhost:5000/video_feed",
    isOnline: false,
    isEnabled: true
  }
];

// Save to localStorage (overwrites existing cameras)
localStorage.setItem('cameras', JSON.stringify(cameras));

console.log('✅ Successfully initialized 6 cameras (SINGLE SOURCE OF TRUTH):');
console.log('   📍 Narela: 2 cameras (Sector 1, Sector 2)');
console.log('   📍 Rohini: 2 cameras (Sector 10, Sector 15)');
console.log('   📍 Bawana: 1 camera (Industrial Area)');
console.log('   📍 Kanjhawla: 1 camera (Central Market)');
console.log('\n📋 Camera Models:');
console.log('   • Hikvision DS-2CD2043G0-I (2x)');
console.log('   • Dahua IPC-HFW2431S-S (1x)');
console.log('   • Axis M3046-V (1x)');
console.log('   • CP Plus CP-UNC-TA40L3 (1x)');
console.log('   • Dahua IPC-HDBW2431R-ZS (1x)');
console.log('\n🔄 Refresh the page to see the cameras!');
console.log('💡 Tip: Edit cameras in Live page, or modify this script to update all cameras at once.');
