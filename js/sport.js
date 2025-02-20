function loadScript() {
    loadVichyMaps();
    return null;
}

function loadVichyMaps() {
    loadGpxMap('gpx/im_vichy_swim_2023.gpx', 'im_vichy_swim_2023');
    loadGpxMap('gpx/im_vichy_bike_2023.gpx', 'im_vichy_bike_2023');
    loadGpxMap('gpx/im_vichy_run_2023.gpx', 'im_vichy_run_2023');
    loadGpxMap('gpx/mar_ams_2024.gpx', 'mar_ams_2024')
    loadGpxMap('gpx/10k_tes_2024.gpx', '10k_tes_2024')
    loadGpxMap('gpx/eve_lea_2021.gpx', 'eve_lea_2021')
    loadGpxMap('gpx/vcc_lea_2023.gpx', 'vcc_lea_2023')
}

function loadGpxMap(gpxUrl, mapId) {
    // Init map:
    const map = L.map(mapId, {
        zoomControl: true,
        scrollWheelZoom: false
    });
    // Add OSM tile layer:
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    // Add GPX:
    // const gpxRunUrl = 'gpx/ironman_vichy_run.gpx';
    const gpx = new L.GPX(gpxUrl, {
        async: true,
        polyline_options: {
            color: 'red'
        },
        markers: {
            startIcon: 'svg/start.svg',
            endIcon: 'svg/stop.svg',
        },
        marker_options: {
            iconSize: [15, 15],
            iconAnchor: [7.5, 7.5]
        }
    }).on('loaded', (e) => {
        map.fitBounds(e.target.getBounds());
    }).addTo(map);
}