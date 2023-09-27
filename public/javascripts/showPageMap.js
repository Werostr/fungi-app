mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: fungus.geometry.coordinates,
  zoom: 5,
});

new mapboxgl.Marker()
  .setLngLat(fungus.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${fungus.variety}</h3>
    <p>${fungus.city}</p>`
    )
  )
  .addTo(map);
