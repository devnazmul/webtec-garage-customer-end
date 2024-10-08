export function calculateLatLongBounds({ lat, lon, radiusInKm }) {
  const earthRadiusInKm = 6371; // Radius of the Earth in kilometers

  // Convert the radius from kilometers to radians
  const radiusInRadians = radiusInKm / earthRadiusInKm;

  // Calculate the latitude bounds
  const minLat = parseFloat(lat) - radiusInRadians * (180 / Math.PI);
  const maxLat = parseFloat(lat) + radiusInRadians * (180 / Math.PI);

  // Calculate the longitude bounds
  const minLon =
    parseFloat(lon) -
    (radiusInRadians * (180 / Math.PI)) / Math.cos((lat * Math.PI) / 180);
  const maxLon =
    parseFloat(lon) +
    (radiusInRadians * (180 / Math.PI)) / Math.cos((lat * Math.PI) / 180);

  return {
    minLat,
    maxLat,
    minLon,
    maxLon,
  };
}
