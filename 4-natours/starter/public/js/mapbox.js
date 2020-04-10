/* eslint-disable */

export const displayMap = locations => {
  console.log('Hello from client side :D');
  mapboxgl.accessToken = 'pk.eyJ1IjoibW90aTAzNzUiLCJhIjoiY2s4dHp6dTFmMDNrbTNoazJpcjlrZTAyciJ9.F_JinBj8cFfdWhBsaIkaIw';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/moti0375/ck8u08s9w07iu1irrmec8nls7',
    scrollZoom: false
  });

  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach(loc => {
    //Crete marker
    const el = document.createElement('div');
    el.className = 'marker';

    //Add Marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //Add Popup

    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 150,
      bottom: 150,
      right: 100,
      left: 100
    }
  });
};
