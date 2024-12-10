const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
       const {latitude, longitude} = position.coords;
       socket.emit("send-location", {latitude, longitude});
    }, (error)=>{
        console.error(error)
    },
    {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }
)
}

// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13); // Coordinates and zoom level

// Add the tile layer (Make sure URL and options are correctly specified)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
}).addTo(map); 

const markers = {}

socket.on("receive-location", (data)=>{
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude]);

    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    }
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
})

socket.on("user-disconnected", (id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})
