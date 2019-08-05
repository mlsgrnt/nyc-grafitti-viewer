mapboxgl.accessToken =
  'pk.eyJ1IjoiYmx5ZHJvIiwiYSI6ImNpbmZ1NDV2ejE1YWd1OGx3ZzBsbTA5bzAifQ.Oej2gm0MXcl6s5cJZ9ckng';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/satellite-streets-v11',
  center: [-74, 40.7],
  zoom: 10
});

const loadData = async () => {
  // Download latest grafitti
  const raw = await fetch(
    "https://data.cityofnewyork.us/resource/fhrw-4uyv.geojson?$where=descriptor in('Graffiti') AND status not in ('Closed', 'Pending')&$order=created_date DESC&$limit=100"
  );
  const geojson = await raw.json();

  geojson.features.forEach(function(marker) {
    if (!marker.geometry) return;

    // create a HTML element for each feature
    var el = document.createElement('div');
    el.className = 'marker';

    const {
      incident_address,
      location_type,
      resolution_description,
      created_date,
      complaint_type,
      park_facility_name
    } = marker.properties;
    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el)
      .setLngLat(marker.geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(
            `
            <a href=${`https://www.google.com/maps/dir/?api=1&destination=${
              marker.geometry.coordinates[1]
            },${marker.geometry.coordinates[0]}`}>
              <h3>${incident_address}</h3>
              <h4>${location_type ? location_type : ''}</h4>
            </a>
            <h5>${
              park_facility_name != 'Unspecified'
                ? park_facility_name
                : complaint_type
            }</h5>
            <p>Reported on ${created_date}</p>
            <p>${resolution_description}</p>
            `
          )
      )
      .addTo(map);
  });
};
loadData();
