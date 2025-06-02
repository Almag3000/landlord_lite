import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

// Supabase init
const supabaseUrl = "https://your-project.supabase.co";
const supabaseKey = "your-anon-key";
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