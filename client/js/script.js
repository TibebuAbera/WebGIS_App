document.addEventListener("DOMContentLoaded", function() {
    // Initialize map
    const map = L.map('map', {
        center: [48.89241, 11.18033], // Nuremberg, Germany
        zoom: 14,
        zoomControl: false // We'll add custom zoom control
    });

    // Add zoom control to top left
    L.control.zoom({
        position: 'topleft'
    }).addTo(map);

    // BaseMap layers
    const baseLayers = {
        "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }),
        "OpenTopoMap": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
            maxZoom: 17
        }),
        "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 19
        }),
        "Mapbox Streets": L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXlva3VubGUiLCJhIjoiY21hc2R2NDkyMGxuazJtb2dodzQ0MjVnNCJ9.VM90agNdAw6s0-wC3df74Q', {
            attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
        }),
        "Mapbox Satellite": L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXlva3VubGUiLCJhIjoiY21hc2R2NDkyMGxuazJtb2dodzQ0MjVnNCJ9.VM90agNdAw6s0-wC3df74Q', {
            attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
        }),
        "Mapbox Navigation": L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/navigation-day-v1/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXlva3VubGUiLCJhIjoiY21hc2R2NDkyMGxuazJtb2dodzQ0MjVnNCJ9.VM90agNdAw6s0-wC3df74Q', {
            attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
        }),
        "Mapbox Outdoors": L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXlva3VubGUiLCJhIjoiY21hc2R2NDkyMGxuazJtb2dodzQ0MjVnNCJ9.VM90agNdAw6s0-wC3df74Q', {
            attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
        })
    };

    // Add default base layer
    baseLayers["OpenStreetMap"].addTo(map);

    // Create a layer group for user-added layers
    const userLayers = L.layerGroup().addTo(map);

    // Initialize draw control
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems
        },
        draw: {
            polygon: true,
            polyline: true,
            rectangle: true,
            circle: true,
            marker: true,
            circlemarker: false
        }
    });

    // Initialize measure control
    const measureControl = new L.Control.Measure({
        position: 'topleft',
        primaryLengthUnit: 'meters',
        secondaryLengthUnit: 'kilometers',
        primaryAreaUnit: 'sqmeters',
        secondaryAreaUnit: 'hectares',
        activeColor: '#005f73',
        completedColor: '#003844'
    });

    // Sample POI data for each category
    const categoryPOIs = {
        food: [
            { name: "Hofbräuhaus", lat: 48.1378, lng: 11.5799, description: "Famous beer hall" },
            { name: "Viktualienmarkt", lat: 48.1351, lng: 11.5762, description: "Daily food market and square" },
            { name: "Augustiner Bräustuben", lat: 48.1391, lng: 11.5463, description: "Traditional Bavarian restaurant" },
            { name: "Tantris", lat: 48.1723, lng: 11.5763, description: "Michelin-starred restaurant" }
        ],
        culture: [
            { name: "Deutsches Museum", lat: 48.1299, lng: 11.5833, description: "Science and technology museum" },
            { name: "Pinakothek der Moderne", lat: 48.1467, lng: 11.5736, description: "Modern art museum" },
            { name: "Bayerische Staatsoper", lat: 48.1397, lng: 11.5799, description: "Bavarian State Opera" },
            { name: "Gasteig", lat: 48.1325, lng: 11.5929, description: "Cultural center" }
        ],
        shopping: [
            { name: "Kaufingerstraße", lat: 48.1373, lng: 11.5753, description: "Main shopping street" },
            { name: "Fünf Höfe", lat: 48.1392, lng: 11.5747, description: "Shopping arcade" },
            { name: "Olympia-Einkaufszentrum", lat: 48.1831, lng: 11.5306, description: "Large shopping mall" }
        ],
        tourism: [
            { name: "Marienplatz", lat: 48.1373, lng: 11.5754, description: "Central square" },
            { name: "Frauenkirche", lat: 48.1386, lng: 11.5736, description: "Cathedral of Our Lady" },
            { name: "Englischer Garten", lat: 48.1642, lng: 11.6057, description: "Large public park" },
            { name: "Nymphenburg Palace", lat: 48.1583, lng: 11.5033, description: "Baroque palace" }
        ],
        hotels: [
            { name: "Hotel Bayerischer Hof", lat: 48.1406, lng: 11.5748, description: "5-star luxury hotel" },
            { name: "Mandarin Oriental", lat: 48.1388, lng: 11.5772, description: "5-star hotel" },
            { name: "Hotel Vier Jahreszeiten Kempinski", lat: 48.1397, lng: 11.5797, description: "Historic luxury hotel" }
        ],
        sports: [
            { name: "Allianz Arena", lat: 48.2188, lng: 11.6247, description: "Football stadium" },
            { name: "Olympiapark", lat: 48.1731, lng: 11.5503, description: "Olympic Park" },
            { name: "Eisbachwelle", lat: 48.1437, lng: 11.5908, description: "River surfing spot" }
        ],
        services: [
            { name: "Hauptbahnhof", lat: 48.1402, lng: 11.5598, description: "Main train station" },
            { name: "Stadtsparkasse München", lat: 48.1373, lng: 11.5743, description: "Bank" },
            { name: "Deutsche Post", lat: 48.1392, lng: 11.5681, description: "Post office" }
        ],
        craft: [
            { name: "BMW Group Plant", lat: 48.1777, lng: 11.5562, description: "Car manufacturing plant" },
            { name: "Paulaner Brewery", lat: 48.1242, lng: 11.5952, description: "Beer brewery" },
            { name: "Munich Maker Space", lat: 48.1198, lng: 11.5330, description: "Community workshop" }
        ],
        administration: [
            { name: "Neues Rathaus", lat: 48.1373, lng: 11.5761, description: "New Town Hall" },
            { name: "Bayerischer Landtag", lat: 48.1429, lng: 11.5845, description: "Bavarian State Parliament" },
            { name: "US Consulate", lat: 48.1513, lng: 11.5918, description: "US Consulate General" }
        ],
        healthcare: [
            { name: "Klinikum der Universität München", lat: 48.1103, lng: 11.4708, description: "University Hospital" },
            { name: "Deutsches Herzzentrum München", lat: 48.1733, lng: 11.5399, description: "German Heart Center" },
            { name: "Apotheke am Marienplatz", lat: 48.1371, lng: 11.5758, description: "Pharmacy" }
        ],
        transportation: [
            { name: "Munich Airport", lat: 48.3537, lng: 11.7860, description: "International airport" },
            { name: "Hauptbahnhof", lat: 48.1402, lng: 11.5598, description: "Main train station" },
            { name: "Karlsplatz (Stachus)", lat: 48.1398, lng: 11.5656, description: "Transport hub" },
            { name: "ZOB Munich", lat: 48.1422, lng: 11.5531, description: "Central bus station" }
        ],
        hiking: [
            { name: "Isar Trails", lat: 48.1517, lng: 11.6016, description: "River hiking paths" },
            { name: "Perlacher Forest", lat: 48.0883, lng: 11.6317, description: "Forest hiking area" },
            { name: "Olympiaberg", lat: 48.1694, lng: 11.5513, description: "Hill with hiking trails" }
        ]
    };

    // Create layer groups for each category
    const categoryLayers = {};
    for (const category in categoryPOIs) {
        categoryLayers[category] = L.layerGroup();
    }

    // Create markers for each POI and add to appropriate layer group
    for (const category in categoryPOIs) {
        categoryPOIs[category].forEach(poi => {
            const marker = L.marker([poi.lat, poi.lng])
                .bindPopup(`<strong>${poi.name}</strong><br>${poi.description}`);
            categoryLayers[category].addLayer(marker);
        });
    }
    
    // Custom translations
    const translations = {
        en: {
            search: "Search locations...",
            myLayers: "My Uploaded Layers",
            loadGeoJSON: "Load GeoJSON (Client-side):",
            loadShapefile: "Load Shapefile (.zip, Client-side):",
            wmsURL: "WMS URL:",
            wmsLayer: "WMS Layer Name:",
            addWMSLayer: "Add WMS Layer",
            uploadGeodata: "Upload Geodata",
            mediaGallery: "Media Gallery",
            uploadMedia: "Upload Media",
            draw: "Draw",
            print: 'Print',
            measure: "Measure",
            share: "Share",
            info: "Info",
            menu: "Menu",
            extraInfo: "Extra Info",
            viewMap: "View Map",
            manageLayers: "Manage Layers",
            settings: "Settings",
            help: "Help",
            aboutThisMap: "About This Map",
            about: "About",
            dataSources: "Data Sources",
            aboutThisApplication: "About This Application",
            aboutTabContent: "This is a web mapping application that allows users to view and interact with geographic data. Users can upload their own data, add layers from external sources, and perform various spatial operations.",
            dataSourcesTabTitle: "Data Sources",
            helpTabTitle: "Help",
            helpTabContent: "For assistance using this application, please refer to the documentation or contact support.",
            additionalInformation: "Additional Information",
            extraInfoModalContent: "This section contains additional information about the application and its features.",
            shareMap: "Share Map",
            mapURL: "Map URL:",
            shareURLHelp: "Copy this URL to share the current map view.",
            shareOptions: "Share Options:",
            copyURL: "Copy URL",
            email: "Email",
            loading: "Loading...",
            view360: "View 360°",
            close: "Close",
            // Category names
            food: "Food",
            culture: "Culture & Entertainment",
            shopping: "Shopping",
            tourism: "Tourism",
            hotels: "Hotels",
            sports: "Sports & Leisure",
            services: "Services",
            craft: "Craft & Industry",
            administration: "Administration",
            healthcare: "Healthcare & Emergency",
            transportation: "Transportation",
            hiking: "Hiking & Trails",
            "extra-info": "Extra Info"
        },
        de: {
            search: "Standorte suchen...",
            myLayers: "Meine hochgeladenen Ebenen",
            loadGeoJSON: "GeoJSON laden (Client-seitig):",
            loadShapefile: "Shapefile laden (.zip, Client-seitig):",
            wmsURL: "WMS-URL:",
            wmsLayer: "WMS-Ebenenname:",
            addWMSLayer: "WMS-Ebene hinzufügen",
            uploadGeodata: "Geodaten hochladen",
            mediaGallery: "Mediengalerie",
            uploadMedia: "Medien hochladen",
            draw: "Zeichnen",
            measure: "Messen",
            print: 'Drucken',
            share: "Teilen",
            info: "Info",
            menu: "Menü",
            extraInfo: "Zusätzliche Info",
            viewMap: "Karte anzeigen",
            manageLayers: "Ebenen verwalten",
            settings: "Einstellungen",
            help: "Hilfe",
            aboutThisMap: "Über diese Karte",
            about: "Über",
            dataSources: "Datenquellen",
            aboutThisApplication: "Über diese Anwendung",
            aboutTabContent: "Dies ist eine Webkartierungsanwendung, mit der Benutzer geografische Daten anzeigen und mit ihnen interagieren können. Benutzer können ihre eigenen Daten hochladen, Ebenen aus externen Quellen hinzufügen und verschiedene räumliche Operationen durchführen.",
            dataSourcesTabTitle: "Datenquellen",
            helpTabTitle: "Hilfe",
            helpTabContent: "Für Hilfe bei der Verwendung dieser Anwendung, konsultieren Sie bitte die Dokumentation oder kontaktieren Sie den Support.",
            additionalInformation: "Zusätzliche Informationen",
            extraInfoModalContent: "Dieser Abschnitt enthält zusätzliche Informationen über die Anwendung und ihre Funktionen.",
            shareMap: "Karte teilen",
            mapURL: "Karten-URL:",
            shareURLHelp: "Kopieren Sie diese URL, um die aktuelle Kartenansicht zu teilen.",
            shareOptions: "Teiloptionen:",
            copyURL: "URL kopieren",
            email: "E-Mail",
            loading: "Wird geladen...",
            view360: "360° ansehen",
            close: "Schließen",
            // Category names in German
            food: "Essen",
            culture: "Kultur & Unterhaltung",
            shopping: "Einkaufen",
            tourism: "Tourismus",
            hotels: "Hotels",
            sports: "Sport & Freizeit",
            services: "Dienstleistungen",
            craft: "Handwerk & Industrie",
            administration: "Verwaltung",
            healthcare: "Gesundheit & Notfall",
            transportation: "Transport",
            hiking: "Wandern & Wege",
            "extra-info": "Zusätzliche Info"
        }
    };

    // Current language (default: English)
    let currentLang = 'en';

    // Function to update UI text based on selected language
    function updateUILanguage() {
        const t = translations[currentLang];
        
        // Update search placeholder
        document.getElementById('search-box').placeholder = t.search;
        
        // Update category names
        document.querySelectorAll('#category-list li').forEach(item => {
            const category = item.getAttribute('data-category');
            if (t[category]) {
                item.querySelector('span').textContent = t[category];
            }
        });
        
        // Update layer management text if visible
        if (document.getElementById('layer-management-tools').style.display !== 'none') {
            document.getElementById('my-layers-header').textContent = t.myLayers;
            document.getElementById('geojson-input-label').textContent = t.loadGeoJSON;
            document.getElementById('shapefile-input-label').textContent = t.loadShapefile;
            document.getElementById('wms-url-label').textContent = t.wmsURL;
            document.getElementById('wms-layer-label').textContent = t.wmsLayer;
            document.getElementById('add-wms-layer').textContent = t.addWMSLayer;
        }
        
        // Update menu panel
        document.getElementById('menu-header').textContent = t.menu;
        document.getElementById('view-map-text').textContent = t.viewMap;
        document.getElementById('manage-layers-text').textContent = t.manageLayers;
        document.getElementById('media-gallery-text').textContent = t.mediaGallery;
        document.getElementById('upload-data-text').textContent = t.uploadGeodata;
        document.getElementById('settings-text').textContent = t.settings;
        document.getElementById('help-text').textContent = t.help;
        
        // Update modals
        document.getElementById('info-modal-title').textContent = t.aboutThisMap;
        document.getElementById('about-tab-title').textContent = t.aboutThisApplication;
        document.getElementById('about-tab-content').textContent = t.aboutTabContent;
        document.getElementById('data-sources-tab-title').textContent = t.dataSourcesTabTitle;
        document.getElementById('help-tab-title').textContent = t.helpTabTitle;
        document.getElementById('help-tab-content').textContent = t.helpTabContent;
        document.getElementById('extra-info-modal-title').textContent = t.additionalInformation;
        document.getElementById('extra-info-modal-content').textContent = t.extraInfoModalContent;
        document.getElementById('share-modal-title').textContent = t.shareMap;
        document.getElementById('share-url-label').textContent = t.mapURL;
        document.getElementById('share-url-help').textContent = t.shareURLHelp;
        document.getElementById('share-options-label').textContent = t.shareOptions;
        document.getElementById('copy-url-button').textContent = t.copyURL;
        document.getElementById('share-email-button').textContent = t.email;
        
        // Update loading text
        document.getElementById('loading-text').textContent = t.loading;
    }

    // Language switcher
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            if (lang !== currentLang) {
                currentLang = lang;
                
                // Update active button
                document.querySelectorAll('.lang-btn').forEach(b => {
                    b.classList.remove('active');
                });
                this.classList.add('active');
                
                // Update UI text
                updateUILanguage();
            }
        });
    });

    // Initialize UI with default language
    updateUILanguage();

    //-----------------------------------------------------------
    // item click handler for search results
    //-----------------------------------------------------------
    const searchBox = document.getElementById('search-box');
    const autocompleteList = document.getElementById('autocomplete-list');
    const searchButton = document.getElementById('search-button');

    // Show suggestions when user types
    searchBox.addEventListener('input', async function () {
        const query = this.value;
        // Stop executing this block if the input is empty
        if (!query) {
            autocompleteList.innerHTML = '';
            return;
        }
        try {
            const res = await fetch(`http://localhost:3000/api/search?table=pois&query=${query}`);
            const data = await res.json();
            
            autocompleteList.innerHTML = '';
            // creates a div for each response and navigates to the location when clicked
            data.forEach(item => {
                const div = document.createElement('div');
                div.textContent = item.name;
                div.addEventListener('click', () => {
                    searchBox.value = item.name;
                    autocompleteList.innerHTML = '';
                    flyToLocation(item);
                });
                autocompleteList.appendChild(div);
            });
        } catch (err) {
            console.error('Autocomplete fetch failed:', err);
        }
    });

    // Fly to result (on map)
    function flyToLocation(item) {
        const { lat, lng } = item;
        map.setView([lat, lng], 18); // Adjust zoom
        L.popup()
            .setLatLng([lat, lng])
            .setContent(`<b>${item.name}</b>`)
            .openOn(map);
    }

    // Zoom to found Pois when the 'search button' is clicked
    searchButton.addEventListener('click', async () => {
        const value = searchBox.value;
        if (!value) return;
        try {
            const res = await fetch(`http://localhost:3000/api/search?table=pois&query=${value}`);
            const results = await res.json();
            if (results.length > 0) {
                flyToLocation(results[0]);
            }
        } catch (err) {
            console.error('Search button error:', err);
        }
    });


    //-----------------------------------------------------------
    // item click handler for categories in sidebar
    //-----------------------------------------------------------
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Food category
            if (category === 'food') {
                fetchData(category);
            }
            // Culture category
            if (category === 'culture') {
                fetchData(category);
            }
            // Shopping category
            if (category === 'shopping') {
                fetchData(category);
            }
            // Tourism category
            if (category === 'tourism') {
                fetchData(category);
            }
            // Hotels category
            if (category === 'hotels') {
                fetchData(category);
            }
            // Sports category
            if (category === 'sports') {
                fetchData(category);
            }
            // Services category
            if (category === 'services') {
                fetchData(category);
            }
            // Craft category
            if (category === 'crafts') {
                fetchData(category);
            }
            // Administration category
            if (category === 'administration') {
                fetchData(category);
            }
            // Healthcare category
            if (category === 'healthcare') {
                fetchData(category);
            }
            // Transportation category
            if (category === 'transportation') {
                fetchData(category);
            }
            // Hiking category
            if (category === 'hiking') {
                fetchData(category);
            }
            // extra-info category
            if (category === 'extra-info') {
                const extraInfoModal = document.getElementById('extra-info-modal');
                extraInfoModal.style.display = 'block';
                return;
            }            
            // info category
            if (category === 'info') {
                document.getElementById('info-modal').style.display = 'block';
                return;
            }
            
            // Toggle active state for other categories
            this.classList.toggle('active');
            
            // Toggle the category layer on the map
            if (this.classList.contains('active')) {
                // Add the layer to the map if it's not already there
                if (categoryLayers[category] && !map.hasLayer(categoryLayers[category])) {
                    map.addLayer(categoryLayers[category]);

                    // If this is the first activation, fit bounds to show all markers
                    if (categoryLayers[category].getLayers().length > 0) {
                        map.fitBounds(categoryLayers[category].getBounds(), {
                            padding: [50, 50],
                            maxZoom: 15
                        });
                    }
                }
            } else {
                // Remove the layer from the map
                if (categoryLayers[category] && map.hasLayer(categoryLayers[category])) {
                    map.removeLayer(categoryLayers[category]);
                }
            }
            
            // Show notification
            const notification = document.getElementById('notification');
            notification.textContent = `Category ${category} ${this.classList.contains('active') ? 'activated' : 'deactivated'}`;
            notification.style.display = 'block';
            
            // Hide notification after 3 seconds
            setTimeout(function() {
                notification.style.display = 'none';
            }, 3000);
        })
    })
    // Fetch data from server
    function fetchData(category) {
        fetch(`http://localhost:3000/api/${category}`)
            .then(res => res.json())
            .then(data => {
                console.log(data); 
                            
                //loaded data from server
                const poiLayer = L.geoJSON(data, {
                    onEachFeature: function (feature, layer) {
                        layer.bindPopup(`<b>${feature.properties.name}</b>`);
                    }
                });
                // Create cluster group
                const markers = L.markerClusterGroup();
                // Add the layer to the map
                markers.addLayer(poiLayer);
                map.addLayer(markers);

                // Zoom to bounds
                if (data.features.length > 0) {
                    map.fitBounds(markers.getBounds()); //map.fitBounds(poiLayer.getBounds());
                }
            })
            .catch(err => {
                console.error("Failed to load POIs:", err);
                alert(err);
            });
    }  

    // Menu button - Show/hide menu panel
    document.getElementById('menu-button').addEventListener('click', function() {
        const menuPanel = document.getElementById('menu-panel');
        menuPanel.classList.toggle('open');
    });

    // Close menu panel
    document.getElementById('close-menu-panel').addEventListener('click', function() {
        document.getElementById('menu-panel').classList.remove('open');
    });

    // Close Extra Info modal
    document.getElementById('close-extra-info-modal').addEventListener('click', function() {
        document.getElementById('extra-info-modal').style.display = 'none';
    });

    // Map control buttons
    document.getElementById('layers-button').addEventListener('click', function() {
        const baselayerControl = document.querySelector('.custom-baselayer-control');
        if (baselayerControl.style.display === 'block') {
            baselayerControl.style.display = 'none';
        } else {
            baselayerControl.style.display = 'block';
            
            // Create basemap options if not already created
            if (!baselayerControl.querySelector('.basemap-option')) {
                const basemapGrid = document.getElementById('basemap-grid');
                
                // Clear existing content
                basemapGrid.innerHTML = '';
                
                // Add options for each base layer
                for (const layerName in baseLayers) {
                    const option = document.createElement('div');
                    option.className = 'basemap-option';
                    if (map.hasLayer(baseLayers[layerName])) {
                        option.classList.add('active');
                    }
                    
                    const thumbnail = document.createElement('img');
                    thumbnail.src = getBasemapThumbnail(layerName);
                    thumbnail.alt = layerName;
                    
                    const label = document.createElement('span');
                    label.textContent = layerName;
                    
                    option.appendChild(thumbnail);
                    option.appendChild(label);
                    
                    // Add click handler
                    option.addEventListener('click', function() {
                        // Remove all base layers
                        for (const name in baseLayers) {
                            map.removeLayer(baseLayers[name]);
                        }
                        
                        // Add selected base layer
                        map.addLayer(baseLayers[layerName]);
                        
                        // Update active state
                        document.querySelectorAll('.basemap-option').forEach(opt => {
                            opt.classList.remove('active');
                        });
                        this.classList.add('active');
                    });
                    
                    basemapGrid.appendChild(option);
                }
            }
        }
    });

    // Locate button
    document.getElementById('locate-button').addEventListener('click', function() {
        if (navigator.geolocation) {
            // Show loading indicator
            document.getElementById('loading-indicator').style.display = 'flex';
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    // Hide loading indicator
                    document.getElementById('loading-indicator').style.display = 'none';
                    
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    // Center map on user's location
                    map.setView([lat, lng], 15);
                    
                    // Add a marker
                    L.marker([lat, lng]).addTo(map)
                        .bindPopup('Your location')
                        .openPopup();
                    
                    // Show notification
                    const notification = document.getElementById('notification');
                    notification.textContent = 'Location found!';
                    notification.style.display = 'block';
                    
                    // Hide notification after 3 seconds
                    setTimeout(function() {
                        notification.style.display = 'none';
                    }, 3000);
                },
                function(error) {
                    // Hide loading indicator
                    document.getElementById('loading-indicator').style.display = 'none';
                    
                    // Show error notification
                    const notification = document.getElementById('notification');
                    notification.textContent = 'Error getting location: ' + error.message;
                    notification.style.display = 'block';
                    
                    // Hide notification after 3 seconds
                    setTimeout(function() {
                        notification.style.display = 'none';
                    }, 3000);
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    });

    // Refresh button
    document.getElementById('refresh-button').addEventListener('click', function() {
        location.reload();
    });

    // Overview button
    document.getElementById('overview-button').addEventListener('click', function() {
        map.setView([48.1351, 11.5820], 13);
    });

    // Toggle basemap button
    document.getElementById('baselayer-toggle-button').addEventListener('click', function() {
        const baselayerControl = document.querySelector('.custom-baselayer-control');
        if (baselayerControl.style.display === 'block') {
            baselayerControl.style.display = 'none';
        } else {
            baselayerControl.style.display = 'block';
            
            // Create basemap options if not already created
            if (!baselayerControl.querySelector('.basemap-option')) {
                const basemapGrid = document.getElementById('basemap-grid');
                
                // Clear existing content
                basemapGrid.innerHTML = '';
                
                // Add options for each base layer
                for (const layerName in baseLayers) {
                    const option = document.createElement('div');
                    option.className = 'basemap-option';
                    if (map.hasLayer(baseLayers[layerName])) {
                        option.classList.add('active');
                    }
                    
                    const thumbnail = document.createElement('img');
                    thumbnail.src = getBasemapThumbnail(layerName);
                    thumbnail.alt = layerName;
                    
                    const label = document.createElement('span');
                    label.textContent = layerName;
                    
                    option.appendChild(thumbnail);
                    option.appendChild(label);
                    
                    // Add click handler
                    option.addEventListener('click', function() {
                        // Remove all base layers
                        for (const name in baseLayers) {
                            map.removeLayer(baseLayers[name]);
                        }
                        
                        // Add selected base layer
                        map.addLayer(baseLayers[layerName]);
                        
                        // Update active state
                        document.querySelectorAll('.basemap-option').forEach(opt => {
                            opt.classList.remove('active');
                        });
                        this.classList.add('active');
                    });
                    
                    basemapGrid.appendChild(option);
                }
            }
        }
    });

    // Close info modal
    document.getElementById('close-info-modal').addEventListener('click', function() {
        document.getElementById('info-modal').style.display = 'none';
    });

    // Tab links in info modal
    document.querySelectorAll('.tab-link').forEach(link => {
        link.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Hide all tab content
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.style.display = 'none';
            });
            
            // Show selected tab content
            document.getElementById(tabName + '-tab').style.display = 'block';
            
            // Update active tab
            document.querySelectorAll('.tab-link').forEach(l => {
                l.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Manage layers link in menu
    document.getElementById('manage-layers-link').addEventListener('click', function() {
        document.getElementById('menu-panel').classList.remove('open');
        document.getElementById('layer-management-tools').style.display = 'block';
    });

    // GeoJSON file input
    document.getElementById('geojson-input').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const geojson = JSON.parse(e.target.result);
                    const layer = L.geoJSON(geojson).addTo(map);
                    userLayers.addLayer(layer);
                    
                    // Fit map to layer bounds
                    map.fitBounds(layer.getBounds());
                    
                    // Show notification
                    const notification = document.getElementById('notification');
                    notification.textContent = 'GeoJSON loaded successfully!';
                    notification.style.display = 'block';
                    
                    // Hide notification after 3 seconds
                    setTimeout(function() {
                        notification.style.display = 'none';
                    }, 3000);
                } catch (error) {
                    alert('Error parsing GeoJSON: ' + error.message);
                }
            };
            reader.readAsText(file);
        }
    });

    // Shapefile input
    document.getElementById('shapefile-input').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Show loading indicator
            document.getElementById('loading-indicator').style.display = 'flex';
            
            // Use shp.js to parse the shapefile
            shp(file).then(function(geojson) {
                // Hide loading indicator
                document.getElementById('loading-indicator').style.display = 'none';
                
                const layer = L.geoJSON(geojson).addTo(map);
                userLayers.addLayer(layer);
                
                // Fit map to layer bounds
                map.fitBounds(layer.getBounds());
                
                // Show notification
                const notification = document.getElementById('notification');
                notification.textContent = 'Shapefile loaded successfully!';
                notification.style.display = 'block';
                
                // Hide notification after 3 seconds
                setTimeout(function() {
                    notification.style.display = 'none';
                }, 3000);
            }).catch(function(error) {
                // Hide loading indicator
                document.getElementById('loading-indicator').style.display = 'none';
                
                alert('Error loading shapefile: ' + error.message);
            });
        }
    });

    // Add WMS layer button
    document.getElementById('add-wms-layer').addEventListener('click', function() {
        const url = document.getElementById('wms-url-input').value;
        const layerName = document.getElementById('wms-layer-input').value;
        
        if (url && layerName) {
            try {
                const wmsLayer = L.tileLayer.wms(url, {
                    layers: layerName,
                    format: 'image/png',
                    transparent: true
                }).addTo(map);
                
                userLayers.addLayer(wmsLayer);
                
                // Show notification
                const notification = document.getElementById('notification');
                notification.textContent = 'WMS layer added successfully!';
                notification.style.display = 'block';
                
                // Hide notification after 3 seconds
                setTimeout(function() {
                    notification.style.display = 'none';
                }, 3000);
            } catch (error) {
                alert('Error adding WMS layer: ' + error.message);
            }
        } else {
            alert('Please enter both WMS URL and layer name.');
        }
    });

    // Function to get thumbnail for basemap
    function getBasemapThumbnail(layerName) {
        const thumbnails = {
            "OpenStreetMap": "https://a.tile.openstreetmap.org/7/66/43.png", 
            "OpenTopoMap": "https://a.tile.opentopomap.org/7/66/43.png",
            "Satellite": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/7/43/66",
            "Mapbox Streets": `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/11.0767,49.4521,7,0/100x80?access_token=pk.eyJ1IjoiYXlva3VubGUiLCJhIjoiY21hc2R2NDkyMGxuazJtb2dodzQ0MjVnNCJ9.VM90agNdAw6s0-wC3df74Q`,
            "Mapbox Satellite": `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/11.0767,49.4521,7,0/100x80?access_token=pk.eyJ1IjoiYXlva3VubGUiLCJhIjoiY21hc2R2NDkyMGxuazJtb2dodzQ0MjVnNCJ9.VM90agNdAw6s0-wC3df74Q`,
            "Mapbox Navigation": `https://api.mapbox.com/styles/v1/mapbox/navigation-day-v1/static/11.0767,49.4521,7,0/100x80?access_token=pk.eyJ1IjoiYXlva3VubGUiLCJhIjoiY21hc2R2NDkyMGxuazJtb2dodzQ0MjVnNCJ9.VM90agNdAw6s0-wC3df74Q`,
            "Mapbox Outdoors": `https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/11.0767,49.4521,7,0/100x80?access_token=pk.eyJ1IjoiYXlva3VubGUiLCJhIjoiY21hc2R2NDkyMGxuazJtb2dodzQ0MjVnNCJ9.VM90agNdAw6s0-wC3df74Q`,
            "MapTiler Streets": "https://api.maptiler.com/maps/streets/static/11.0767,49.4521,7/100x80.png?key=UtB2j3DcFpaVF6ptzIDl",
            "MapTiler Satellite": "https://api.maptiler.com/maps/hybrid/static/11.0767,49.4521,7/100x80.jpg?key=UtB2j3DcFpaVF6ptzIDl"
        };
        
        return thumbnails[layerName] || "https://via.placeholder.com/100x80?text=" + encodeURIComponent(layerName);
    }

    // Close 360 viewer
    document.getElementById('close-360-viewer').addEventListener('click', function() {
        document.getElementById('photosphere-viewer-container').style.display = 'none';
        cleanupViewer();
    });

    // Photo Sphere Viewer Integration
    function initPhotoSphereViewer(panoramaUrl) {
        const container = document.getElementById('photosphere-viewer-container');
        container.style.display = 'block';
        
        // Initialize the viewer
        const viewer = new PhotoSphereViewer.Viewer({
            container: container,
            panorama: panoramaUrl,
            navbar: [
                'autorotate',
                'zoom',
                'fullscreen'
            ],
            plugins: [
                [PhotoSphereViewer.VirtualTourPlugin, {
                    positionMode: PhotoSphereViewer.VirtualTourPlugin.MODE_GPS
                }]
            ]
        });
        
        // Store viewer reference for cleanup
        container.viewer = viewer;
    }

    // Cleanup function for photo sphere viewer
    function cleanupViewer() {
        const container = document.getElementById('photosphere-viewer-container');
        if (container.viewer) {
            container.viewer.destroy();
            container.viewer = null;
        }
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
                
                // If it's the 360 viewer modal, clean up
                if (modal.id === 'photosphere-viewer-container') {
                    cleanupViewer();
                }
            }
        });
    });

    // Add draw control to map
    map.addControl(drawControl);

    // Add measure control to map
    map.addControl(measureControl);

    // Handle draw events
    map.on(L.Draw.Event.CREATED, function(event) {
        const layer = event.layer;
        drawnItems.addLayer(layer);
        
        // Show notification
        const notification = document.getElementById('notification');
        notification.textContent = 'Shape drawn successfully!';
        notification.style.display = 'block';
        
        // Hide notification after 3 seconds
        setTimeout(function() {
            notification.style.display = 'none';
        }, 3000);
    });

    // Print tool
    document.getElementById('print-tool-btn').addEventListener('click', function() {
        // Initialize the print control if it doesn't exist
        if (!window.printControl) {
            window.printControl = L.easyPrint({
                title: 'Print Map',
                position: 'bottomleft',
                sizeModes: ['Current', 'A4Landscape', 'A4Portrait'],
                filename: 'map-export',
                exportOnly: false,
                hideControlContainer: true
            }).addTo(map);
        }
        
        // Trigger the print dialog
        window.printControl.printMap('CurrentSize', 'map-export');
    });
});
