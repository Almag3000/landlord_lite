import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

// Supabase init
const supabaseUrl = "https://jwbxmumtwucyeilrtugk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3YnhtdW10d3VjeWVpbHJ0dWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4ODUzNjUsImV4cCI6MjA2NDQ2MTM2NX0.bZkqSZwwNToXlF5ik7w2fw1NyaIj-ShHcGPLD7KEuiU";
const supabase = createClient(supabaseUrl, supabaseKey);

// Telegram Mini App init
const tg = window.Telegram.WebApp;
tg.ready();

// Geolocation & map init
navigator.geolocation.getCurrentPosition(async (pos) => {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;

  const map = L.map('root').setView([lat, lng], 16);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OSM'
  }).addTo(map);

  // Load nearby places
  const { data: places, error } = await supabase
    .from("places")
    .select("*")
    .limit(10);

  places?.forEach(place => {
    const marker = L.marker([place.lat, place.lng]).addTo(map);
    marker.bindPopup(`<b>${place.name}</b><br>💰 ${place.base_price} Coins`);
  });
});