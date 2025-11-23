/**
 * Camera Setup Script
 * Run this in browser console on Live page to add 6 cameras
 * 2 in Narela, 2 in Rohini, 1 in Bawana, 1 in Kanjhawla
 */

const cameras = [
  // Narela Cameras (2)
  {
    id: 1,
    position: "Main Gate",
    location: "Narela",
    locality: "Sector 1",
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
    lat: 28.8328,
    lng: 77.0167,
    url: "http://localhost:5000/video_feed",
    isOnline: false,
    isEnabled: true
  }
];

// Save to localStorage
localStorage.setItem('cameras', JSON.stringify(cameras));

console.log('✅ Successfully added 6 cameras:');
console.log('   📍 Narela: 2 cameras');
console.log('   📍 Rohini: 2 cameras');
console.log('   📍 Bawana: 1 camera');
console.log('   📍 Kanjhawla: 1 camera');
console.log('\n🔄 Refresh the page to see the cameras!');
