document.addEventListener("DOMContentLoaded", function() {
    // Initialize map
    const map = L.map("map", {
        center: [49.4521, 11.0767], // Nuremberg, Germany
        zoom: 13,
        zoomControl: false, // We'll add custom zoom control
        gestureHandling: true // Enable gesture handling for mobile
    });

    // Add zoom control to top left
    L.control.zoom({
        position: "topleft"
    }).addTo(map);

    // Add scale bar to bottom left
    L.control.scale({
        position: "bottomleft",
        imperial: false
    }).addTo(map);

    // Base layers
    const baseLayers = {
        "OpenStreetMap": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
            maxZoom: 19
        }),
        "OpenTopoMap": L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
            attribution: "Map data: &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, <a href=\"http://viewfinderpanoramas.org\">SRTM</a> | Map style: &copy; <a href=\"https://opentopomap.org\">OpenTopoMap</a> (<a href=\"https://creativecommons.org/licenses/by-sa/3.0/\">CC-BY-SA</a>)",
            maxZoom: 17
        }),
        "Satellite": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
            attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
            maxZoom: 19
        }),
        "Mapbox Streets": L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXlva3VubGUiLCJhIjoiY21hc2R2NDkyMGxuazJtb2dodzQ0MjVnNCJ9.VM90agNdAw6s0-wC3df74Q", {
            attribution: "© <a href=\"https://www.mapbox.com/about/maps/\">Mapbox</a> © <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
            maxZoom: 19
        }),
        "Mapbox Satellite": L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXlva3VubGUiLCJhIjoiY21hc2R2NDkyMGxuazJtb2dodzQ0MjVnNCJ9.VM90agNdAw6s0-wC3df74Q", {
            attribution: "© <a href=\"https://www.mapbox.com/about/maps/\">Mapbox</a> © <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
            maxZoom: 19
        }),
        "Mapbox Navigation": L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/navigation-day-v1/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXlva3VubGUiLCJhIjoiY21hc2R2NDkyMGxuazJtb2dodzQ0MjVnNCJ9.VM90agNdAw6s0-wC3df74Q", {
            attribution: "© <a href=\"https://www.mapbox.com/about/maps/\">Mapbox</a> © <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
            maxZoom: 19
        }),
        "Mapbox Outdoors": L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXlva3VubGUiLCJhIjoiY21hc2R2NDkyMGxuazJtb2dodzQ0MjVnNCJ9.VM90agNdAw6s0-wC3df74Q", {
            attribution: "© <a href=\"https://www.mapbox.com/about/maps/\">Mapbox</a> © <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
            maxZoom: 19
        })
    };

    // Basemap thumbnail URLs
    const basemapThumbnails = {
        "OpenStreetMap": "https://a.tile.openstreetmap.org/7/66/43.png",
        "OpenTopoMap": "https://a.tile.opentopomap.org/7/66/43.png",
        "Satellite": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/7/43/66",
        "Mapbox Streets": "https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/0,0,1,0,0/150x80?access_token=pk.eyJ1IjoiYXlva3VubGUiLCJhIjoiY21hc2R2NDkyMGxuazJtb2dodzQ0MjVnNCJ9.VM90agNdAw6s0-wC3df74Q",
        "Mapbox Satellite": "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/0,0,1,0,0/150x80?access_token=pk.eyJ1IjoiYXlva3VubGUiLCJhIjoiY21hc2R2NDkyMGxuazJtb2dodzQ0MjVnNCJ9.VM90agNdAw6s0-wC3df74Q",
        "Mapbox Navigation": "https://api.mapbox.com/styles/v1/mapbox/navigation-day-v1/static/0,0,1,0,0/150x80?access_token=pk.eyJ1IjoiYXlva3VubGUiLCJhIjoiY21hc2R2NDkyMGxuazJtb2dodzQ0MjVnNCJ9.VM90agNdAw6s0-wC3df74Q",
        "Mapbox Outdoors": "https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/0,0,1,0,0/150x80?access_token=pk.eyJ1IjoiYXlva3VubGUiLCJhIjoiY21hc2R2NDkyMGxuazJtb2dodzQ0MjVnNCJ9.VM90agNdAw6s0-wC3df74Q"
    };

    // Add default base layer
    baseLayers["OpenStreetMap"].addTo(map);

    // Create a layer group for user-added layers
    const userLayers = L.layerGroup().addTo(map);

    // Initialize draw control
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
        position: "topleft",
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
    map.addControl(drawControl);

    // Initialize measure control
    const measureControl = new L.Control.Measure({
        position: "topleft",
        primaryLengthUnit: "meters",
        secondaryLengthUnit: "kilometers",
        primaryAreaUnit: "sqmeters",
        secondaryAreaUnit: "hectares",
        activeColor: "#005f73",
        completedColor: "#003844"
    });
    map.addControl(measureControl);

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
            print: "Print",
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
            "360media": "360° Media",
            view360: "View 360°",
            close: "Close",
            mediaType: {
                image: "Image",
                video: "Video"
            },
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
            print: "Drucken",
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
            "360media": "360° Medien",
            view360: "360° ansehen",
            close: "Schließen",
            mediaType: {
                image: "Bild",
                video: "Video"
            },
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

    // Sample POI data for each category
    const categoryPOIs = {
        food: [
            { name: "Hofbräuhaus", lat: 48.1378, lng: 11.5799, description: "Famous beer hall", 
              media: { type: "image", url: "https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/sphere.jpg" } },
            { name: "Viktualienmarkt", lat: 48.1351, lng: 11.5762, description: "Daily food market and square" },
            { name: "Augustiner Bräustuben", lat: 48.1391, lng: 11.5463, description: "Traditional Bavarian restaurant",
              media: { type: "video", url: "https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/example.mp4", preview: "https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/example-preview.jpg" } },
            { name: "Tantris", lat: 48.1723, lng: 11.5763, description: "Michelin-starred restaurant" }
        ],
        culture: [
            { name: "Deutsches Museum", lat: 48.1299, lng: 11.5833, description: "Science and technology museum",
              media: { type: "image", url: "https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/sphere.jpg" } },
            { name: "Pinakothek der Moderne", lat: 48.1467, lng: 11.5736, description: "Modern art museum" },
            { name: "Bayerische Staatsoper", lat: 48.1397, lng: 11.5799, description: "Bavarian State Opera" },
            { name: "Gasteig", lat: 48.1325, lng: 11.5929, description: "Cultural center",
              media: { type: "image", url: "https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/sphere.jpg" } }
        ],
        shopping: [
            { name: "Kaufingerstraße", lat: 48.1373, lng: 11.5753, description: "Main shopping street",
              media: { type: "image", url: "https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/sphere.jpg" } },
            { name: "Fünf Höfe", lat: 48.1392, lng: 11.5747, description: "Shopping arcade" },
            { name: "Olympia-Einkaufszentrum", lat: 48.1831, lng: 11.5306, description: "Large shopping mall" }
        ],
        tourism: [
            { name: "Marienplatz", lat: 48.1373, lng: 11.5754, description: "Central square",
              media: { type: "video", url: "https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/example.mp4", preview: "https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/example-preview.jpg" } },
            { name: "Frauenkirche", lat: 48.1386, lng: 11.5736, description: "Cathedral of Our Lady" },
            { name: "Englischer Garten", lat: 48.1642, lng: 11.6057, description: "Large public park",
              media: { type: "image", url: "https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/sphere.jpg" } },
            { name: "Nymphenburg Palace", lat: 48.1583, lng: 11.5033, description: "Baroque palace" }
        ],
        hotels: [
            { name: "Hotel Bayerischer Hof", lat: 48.1406, lng: 11.5748, description: "5-star luxury hotel",
              media: { type: "image", url: "https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/sphere.jpg" } },
            { name: "Mandarin Oriental", lat: 48.1388, lng: 11.5772, description: "5-star hotel" },
            { name: "Hotel Vier Jahreszeiten Kempinski", lat: 48.1397, lng: 11.5797, description: "Historic luxury hotel" }
        ],
        sports: [
            { name: "Allianz Arena", lat: 48.2188, lng: 11.6247, description: "Football stadium",
              media: { type: "video", url: "https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/example.mp4", preview: "https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/example-preview.jpg" } },
            { name: "Olympiapark", lat: 48.1731, lng: 11.5503, description: "Olympic Park" },
            { name: "Eisbachwelle", lat: 48.1437, lng: 11.5908, description: "River surfing spot" }
        ],
        services: [
            { name: "Hauptbahnhof", lat: 48.1402, lng: 11.5598, description: "Main train station",
              media: { type: "image", url: "https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/sphere.jpg" } },
            { name: "Stadtsparkasse München", lat: 48.1373, lng: 11.5743, description: "Bank" },
            { name: "Deutsche Post", lat: 48.1392, lng: 11.5681, description: "Post office" }
        ],
        craft: [
            { name: "BMW Group Plant", lat: 48.1777, lng: 11.5562, description: "Car manufacturing plant",
              media: { type: "image", url: "https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/sphere.jpg" } },
            { name: "Paulaner Brewery", lat: 48.1242, lng: 11.5952, description: "Beer brewery" },
            { name: "Munich Maker Space", lat: 48.1198, lng: 11.5330, description: "Community workshop" }
        ],
        administration: [
            { name: "Neues Rathaus", lat: 48.1373, lng: 11.5761, description: "New Town Hall",
              media: { type: "image", url: "https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/sphere.jpg" } },
            { name: "Bayerischer Landtag", lat: 48.1429, lng: 11.5845, description: "Bavarian State Parliament" },
            { name: "US Consulate", lat: 48.1513, lng: 11.5918, description: "US Consulate General" }
        ],
        healthcare: [
            { name: "Klinikum der Universität München", lat: 48.1103, lng: 11.4708, description: "University Hospital",
              media: { type: "image", url: "https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/sphere.jpg" } },
            { name: "Deutsches Herzzentrum München", lat: 48.1733, lng: 11.5399, description: "German Heart Center" },
            { name: "Apotheke am Marienplatz", lat: 48.1371, lng: 11.5758, description: "Pharmacy" }
        ],
        transportation: [
            { name: "Munich Airport", lat: 48.3537, lng: 11.7860, description: "International airport",
              media: { type: "video", url: "https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/example.mp4", preview: "https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/example-preview.jpg" } },
            { name: "Hauptbahnhof", lat: 48.1402, lng: 11.5598, description: "Main train station" },
            { name: "Karlsplatz (Stachus)", lat: 48.1398, lng: 11.5656, description: "Transport hub" },
            { name: "ZOB Munich", lat: 48.1422, lng: 11.5531, description: "Central bus station" }
        ],
        hiking: [
            { name: "Isar Trails", lat: 48.1517, lng: 11.6016, description: "River hiking paths",
              media: { type: "image", url: "https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/sphere.jpg" } },
            { name: "Perlacher Forest", lat: 48.0883, lng: 11.6317, description: "Forest hiking area" },
            { name: "Olympiaberg", lat: 48.1694, lng: 11.5513, description: "Hill with hiking trails" }
        ],
        "360media": [
            { name: "Castle 360 Video Tour", lat: 49.4579, lng: 11.0752, description: "Immersive castle experience", 
                media: {
                type: "video",
                url: "https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/example.mp4",
                preview: "https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/example-preview.jpg"}
            },
            { name: "City Panorama", lat: 49.4516, lng: 11.0767, description: "Interactive 360° view",
                media: {
                type: "image",
                url: "https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/sphere.jpg"
                }
            }
        ],
        info: [
            { name: "Tourist Information", lat: 48.1373, lng: 11.5760, description: "Official tourist information center" },
            { name: "City Map", lat: 48.1380, lng: 11.5750, description: "Interactive city map" }
        ],
        "extra-info": [
            { name: "Historical Facts", lat: 48.1375, lng: 11.5755, description: "Historical information about the city" },
            { name: "Cultural Events", lat: 48.1385, lng: 11.5745, description: "Upcoming cultural events" }
        ]
    };
    
    // Define custom icons for each category
    const categoryIcons = {
        food: L.divIcon({
            className: "custom-div-icon",
            html: 
                `<div style="background-color:#e63946; width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center; box-shadow:0 2px 5px rgba(0,0,0,0.3);">
                    <i class="fas fa-utensils" style="color:white; font-size:16px;"></i>
                </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        }),
        culture: L.divIcon({
            className: "custom-div-icon",
            html: 
                `<div style="background-color:#457b9d; width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center; box-shadow:0 2px 5px rgba(0,0,0,0.3);">
                    <i class="fas fa-theater-masks" style="color:white; font-size:16px;"></i>
                </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        }),
        shopping: L.divIcon({
            className: "custom-div-icon",
            html: 
                `<div style="background-color:#1d3557; width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center; box-shadow:0 2px 5px rgba(0,0,0,0.3);">
                    <i class="fas fa-shopping-bag" style="color:white; font-size:16px;"></i>
                </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        }),
        tourism: L.divIcon({
            className: "custom-div-icon",
            html: 
                `<div style="background-color:#2a9d8f; width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center; box-shadow:0 2px 5px rgba(0,0,0,0.3);">
                    <i class="fas fa-landmark" style="color:white; font-size:16px;"></i>
                </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        }),
        hotels: L.divIcon({
            className: "custom-div-icon",
            html: 
                `<div style="background-color:#f4a261; width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center; box-shadow:0 2px 5px rgba(0,0,0,0.3);">
                    <i class="fas fa-hotel" style="color:white; font-size:16px;"></i>
                </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        }),
        sports: L.divIcon({
            className: "custom-div-icon",
            html: 
                `<div style="background-color:#8ac926; width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center; box-shadow:0 2px 5px rgba(0,0,0,0.3);">
                    <i class="fas fa-running" style="color:white; font-size:16px;"></i>
                </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        }),
        services: L.divIcon({
            className: "custom-div-icon",
            html: 
                `<div style="background-color:#6a4c93; width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center; box-shadow:0 2px 5px rgba(0,0,0,0.3);">
                    <i class="fas fa-concierge-bell" style="color:white; font-size:16px;"></i>
                </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        }),
        craft: L.divIcon({
            className: "custom-div-icon",
            html: 
                `<div style="background-color:#ff70a6; width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center; box-shadow:0 2px 5px rgba(0,0,0,0.3);">
                    <i class="fas fa-industry" style="color:white; font-size:16px;"></i>
                </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        }),
        administration: L.divIcon({
            className: "custom-div-icon",
            html: 
                `<div style="background-color:#4cc9f0; width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center; box-shadow:0 2px 5px rgba(0,0,0,0.3);">
                    <i class="fas fa-city" style="color:white; font-size:16px;"></i>
                </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        }),
        healthcare: L.divIcon({
            className: "custom-div-icon",
            html: 
                `<div style="background-color:#f72585; width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center; box-shadow:0 2px 5px rgba(0,0,0,0.3);">
                    <i class="fas fa-hospital" style="color:white; font-size:16px;"></i>
                </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        }),
        transportation: L.divIcon({
            className: "custom-div-icon",
            html: 
                `<div style="background-color:#3a86ff; width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center; box-shadow:0 2px 5px rgba(0,0,0,0.3);">
                    <i class="fas fa-bus" style="color:white; font-size:16px;"></i>
                </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        }),
        hiking: L.divIcon({
            className: "custom-div-icon",
            html: 
                `<div style="background-color:#38b000; width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center; box-shadow:0 2px 5px rgba(0,0,0,0.3);">
                    <i class="fas fa-hiking" style="color:white; font-size:16px;"></i>
                </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        }),
        "360media": L.divIcon({
            className: "custom-div-icon",
            html: 
                `<div style="background-color:#8e44ad; width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center; box-shadow:0 2px 5px rgba(0,0,0,0.3);">
                    <i class="fas fa-vr-cardboard" style="color:white; font-size:16px;"></i>
                </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        }),
        info: L.divIcon({
            className: "custom-div-icon",
            html: 
                `<div style="background-color:#fb8500; width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center; box-shadow:0 2px 5px rgba(0,0,0,0.3);">
                    <i class="fas fa-info-circle" style="color:white; font-size:16px;"></i>
                </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        }),
        "extra-info": L.divIcon({
            className: "custom-div-icon",
            html: 
                `<div style="background-color:#ffb703; width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center; box-shadow:0 2px 5px rgba(0,0,0,0.3);">
                    <i class="fas fa-ellipsis-h" style="color:white; font-size:16px;"></i>
                </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    };

    // Create layer groups for each category
    const categoryLayers = {};
    for (const category in categoryPOIs) {
        categoryLayers[category] = L.layerGroup();
    }

    // Create markers for each POI and add to appropriate layer group
    for (const category in categoryPOIs) {
        categoryPOIs[category].forEach(poi => {
            let popupContent = `<strong>${poi.name}</strong><br>${poi.description}`;
            
            // Add 360 view button if media is available
            if (poi.media) {
                popupContent += `<br><button class="view-media-btn" data-media-type="${poi.media.type}" 
                    data-media-url="${poi.media.url}" ${poi.media.preview ? `data-media-preview="${poi.media.preview}"` : ""}>
                    <i class="fas fa-vr-cardboard"></i> View 360°</button>`;
            }
            
            const marker = L.marker([poi.lat, poi.lng], {icon: categoryIcons[category]})
                .bindPopup(popupContent);
            
            categoryLayers[category].addLayer(marker);
        });
    }

    // Handle category clicks
    document.querySelectorAll(".category-item").forEach(item => {
        item.addEventListener("click", function() {
            const category = this.getAttribute("data-category");
            
            // Remove active class from all categories
            document.querySelectorAll(".category-item").forEach(cat => {
                cat.classList.remove("active");
            });
            
            // Add active class to clicked category
            this.classList.add("active");
            
            // Remove all category layers from map
            for (const cat in categoryLayers) {
                map.removeLayer(categoryLayers[cat]);
            }
            
            // Add selected category layer to map
            if (categoryLayers[category]) {
                map.addLayer(categoryLayers[category]);
                
                // Create bounds for the markers in this category
                if (categoryPOIs[category] && categoryPOIs[category].length > 0) {
                    const bounds = L.latLngBounds(categoryPOIs[category].map(poi => [poi.lat, poi.lng]));
                    map.fitBounds(bounds, { padding: [50, 50] });
                }
            }
            
            // Special handling for info and extra-info categories
            if (category === "info") {
                openInfoModal();
            } else if (category === "extra-info") {
                openExtraInfoModal();
            }
        });
    });

    // Initialize PhotoSphere Viewer
    let viewer = null;

    // Function to open 360 media viewer
    function open360Viewer(mediaType, mediaUrl, previewUrl) {
        const container = document.getElementById("photosphere-viewer-container");
        container.style.display = "block";
        
        if (viewer) {
            viewer.destroy();
        }
        
        if (mediaType === "image") {
            viewer = new PhotoSphereViewer.Viewer({
                container: container,
                panorama: mediaUrl,
                navbar: [
                    "autorotate", "zoom", "fullscreen"
                ],
                plugins: []
            });
        } else if (mediaType === "video") {
            viewer = new PhotoSphereViewer.Viewer({
                container: container,
                defaultLat: 0,
                defaultLong: 0,
                defaultZoomLvl: 50,
                navbar: [
                    "autorotate", "zoom", "fullscreen"
                ],
                plugins: [
                    [PhotoSphereViewer.VideoPlugin, {
                        video: mediaUrl,
                        poster: previewUrl || "",
                        autoplay: true,
                        controls: true
                    }]
                ]
            });
        }
    }

    // Close 360 viewer
    document.getElementById("close-360-viewer").addEventListener("click", function() {
        document.getElementById("photosphere-viewer-container").style.display = "none";
        if (viewer) {
            viewer.destroy();
            viewer = null;
        }
    });

    // Handle 360 view button clicks in popups
    map.on("popupopen", function(e) {
        const viewMediaBtn = e.popup._contentNode.querySelector(".view-media-btn");
        if (viewMediaBtn) {
            viewMediaBtn.addEventListener("click", function() {
                const mediaType = this.getAttribute("data-media-type");
                const mediaUrl = this.getAttribute("data-media-url");
                const previewUrl = this.getAttribute("data-media-preview");
                open360Viewer(mediaType, mediaUrl, previewUrl);
            });
        }
    });

    // Search functionality
    document.getElementById("search-button").addEventListener("click", function() {
        performSearch();
    });

    document.getElementById("search-input").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            performSearch();
        }
    });



    function performSearch() {
        const searchTerm = document.getElementById("search-input").value.toLowerCase().trim();
        if (!searchTerm) return;

        // Clear previous search results
        map.eachLayer(function(layer) {
            if (layer._searchResult) {
                map.removeLayer(layer);
            }
        });

        const searchResults = [];

        // Search through all POIs
        for (const category in categoryPOIs) {
            categoryPOIs[category].forEach(poi => {
                // Check if search term is in name, description, or category
                if (
                    poi.name.toLowerCase().includes(searchTerm) ||
                    poi.description.toLowerCase().includes(searchTerm) ||
                    category.toLowerCase().includes(searchTerm)
                ) {
                    searchResults.push({
                        category: category,
                        poi: poi
                    });
                }
            });
        }

        if (searchResults.length > 0) {
            // Create bounds for search results
            const bounds = L.latLngBounds(searchResults.map(result => [result.poi.lat, result.poi.lng]));
            
            // Add markers for search results
            searchResults.forEach(result => {
                let popupContent = `<strong>${result.poi.name}</strong><br>${result.poi.description}`;
                
                // Add 360 view button if media is available
                if (result.poi.media) {
                    popupContent += `<br><button class="view-media-btn" data-media-type="${result.poi.media.type}" 
                        data-media-url="${result.poi.media.url}" ${result.poi.media.preview ? `data-media-preview="${result.poi.media.preview}"` : ""}>
                        <i class="fas fa-vr-cardboard"></i> View 360°</button>`;
                }
                
                const marker = L.marker([result.poi.lat, result.poi.lng], {
                    icon: categoryIcons[result.category]
                })
                .bindPopup(popupContent);
                
                marker._searchResult = true;
                marker.addTo(map);
            });
            
            // Fit map to search results
            map.fitBounds(bounds, { padding: [50, 50] });
            
            // Show notification
            showNotification(`Found ${searchResults.length} results for "${searchTerm}"`);
        } else {
            showNotification(`No results found for "${searchTerm}"`);
        }
    }

    // Show notification
    function showNotification(message, duration = 3000) {
        const notification = document.getElementById("notification");
        notification.textContent = message;
        notification.style.display = "block";
        
        setTimeout(() => {
            notification.style.display = "none";
        }, duration);
    }

    // Handle draw events
    map.on(L.Draw.Event.CREATED, function(event) {
        const layer = event.layer;
        drawnItems.addLayer(layer);
    });

    // Mobile menu toggle
    if (document.getElementById("mobile-menu-toggle")) {
        document.getElementById("mobile-menu-toggle").addEventListener("click", function() {
            const sidebar = document.getElementById("sidebar");
            if (sidebar.classList.contains("open")) {
                sidebar.classList.remove("open");
            } else {
                sidebar.classList.add("open");
            }
        });
    }

    // Menu panel toggle
    document.getElementById("menu-button").addEventListener("click", function() {
        const menuPanel = document.getElementById("menu-panel");
        menuPanel.classList.add("open");
    });

    document.getElementById("close-menu-panel").addEventListener("click", function() {
        document.getElementById("menu-panel").classList.remove("open");
    });

    // Manage Layers functionality
    document.getElementById("manage-layers-link").addEventListener("click", function(e) {
        e.preventDefault();
        toggleLayerManagement();
    });

   
    function toggleLayerManagement() {
        const layerManagement = document.getElementById("layer-management-tools");
        const menuPanel = document.getElementById("menu-panel");
        
        if (layerManagement.style.display === "none" || layerManagement.style.display === "") {
            layerManagement.style.display = "block";
            menuPanel.classList.remove("open");
        } else {
            layerManagement.style.display = "none";
        }
    }

    // GeoJSON file input handler
    document.getElementById("geojson-input").addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const geojson = JSON.parse(e.target.result);
                    const layer = L.geoJSON(geojson, {
                        style: {
                            color: "#005f73",
                            weight: 3,
                            opacity: 0.7
                        },
                        onEachFeature: function(feature, layer) {
                            if (feature.properties) {
                                let popupContent = "<div class=\"custom-popup\">";
                                for (const key in feature.properties) {
                                    popupContent += `<strong>${key}:</strong> ${feature.properties[key]}<br>`;
                                }
                                popupContent += "</div>";
                                layer.bindPopup(popupContent);
                            }
                        }
                    }).addTo(userLayers);
                    
                    // Fit map to the GeoJSON layer
                    map.fitBounds(layer.getBounds());
                    showNotification(`GeoJSON file "${file.name}" loaded successfully`);
                } catch (error) {
                    showNotification(`Error loading GeoJSON: ${error.message}`);
                }
            };
            reader.readAsText(file);
        }
    });

    // Shapefile input handler
    document.getElementById("shapefile-input").addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            showNotification("Loading Shapefile...");
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    shp(e.target.result).then(function(geojson) {
                        const layer = L.geoJSON(geojson, {
                            style: {
                                color: "#005f73",
                                weight: 3,
                                opacity: 0.7
                            },
                            onEachFeature: function(feature, layer) {
                                if (feature.properties) {
                                    let popupContent = "<div class=\"custom-popup\">";
                                    for (const key in feature.properties) {
                                        popupContent += `<strong>${key}:</strong> ${feature.properties[key]}<br>`;
                                    }
                                    popupContent += "</div>";
                                    layer.bindPopup(popupContent);
                                }
                            }
                        }).addTo(userLayers);
                        
                        // Fit map to the GeoJSON layer
                        map.fitBounds(layer.getBounds());
                        showNotification(`Shapefile "${file.name}" loaded successfully`);
                    }).catch(function(error) {
                        showNotification(`Error loading Shapefile: ${error.message}`);
                    });
                } catch (error) {
                    showNotification(`Error loading Shapefile: ${error.message}`);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    });

    // WMS Layer handler
    document.getElementById("add-wms-layer").addEventListener("click", function() {
        const wmsUrl = document.getElementById("wms-url-input").value.trim();
        const wmsLayer = document.getElementById("wms-layer-input").value.trim();
        
        if (wmsUrl && wmsLayer) {
            try {
                const wmsLayerObj = L.tileLayer.wms(wmsUrl, {
                    layers: wmsLayer,
                    format: "image/png",
                    transparent: true
                }).addTo(userLayers);
                
                showNotification(`WMS Layer "${wmsLayer}" added successfully`);
            } catch (error) {
                showNotification(`Error adding WMS Layer: ${error.message}`);
            }
        } else {
            showNotification("Please enter both WMS URL and Layer Name");
        }
    });

    // Info and Extra Info modals
    function openInfoModal() {
        document.getElementById("info-modal").style.display = "block";
    }
    
    function openExtraInfoModal() {
        document.getElementById("extra-info-modal").style.display = "block";
    }
    
    // Close modal buttons
    document.getElementById("close-info-modal").addEventListener("click", function() {
        document.getElementById("info-modal").style.display = "none";
    });
    
    document.getElementById("close-extra-info-modal").addEventListener("click", function() {
        document.getElementById("extra-info-modal").style.display = "none";
    });
    
    // Tab functionality in info modal
    document.querySelectorAll(".tab-link").forEach(function(tab) {
        tab.addEventListener("click", function() {
            const tabId = this.getAttribute("data-tab");
            
            // Hide all tab contents
            document.querySelectorAll(".tab-content").forEach(function(content) {
                content.style.display = "none";
            });
            
            // Remove active class from all tabs
            document.querySelectorAll(".tab-link").forEach(function(tab) {
                tab.classList.remove("active");
            });
            
            // Show the selected tab content and mark tab as active
            document.getElementById(`${tabId}-tab`).style.display = "block";
            this.classList.add("active");
        });
    });

    // Media Gallery Modal
    document.getElementById("main-menu-list").addEventListener("click", function(e) {
        const target = e.target.closest("a");
        if (!target) return;
        
        if (target.querySelector("#media-gallery-text")) {
            e.preventDefault();
            openMediaGalleryModal();
        } else if (target.querySelector("#upload-data-text")) {
            e.preventDefault();
            openUploadGeodataModal();
        }
    });

    // Function to open Media Gallery Modal
    function openMediaGalleryModal() {
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.id = "media-gallery-modal";
        modal.style.display = "block";
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button" id="close-media-gallery-modal">&times;</span>
                <h2>Media Gallery</h2>
                
                <div class="gallery-controls">
                    <button class="button" id="upload-media-button"><i class="fas fa-upload"></i> Upload New Media</button>
                    <div class="gallery-filter">
                        <label for="gallery-filter-input">Filter:</label>
                        <select id="gallery-filter-input">
                            <option value="all">All Media</option>
                            <option value="image">Images Only</option>
                            <option value="video">Videos Only</option>
                            <option value="map">Map-linked Only</option>
                        </select>
                    </div>
                </div>
                
                <div class="media-gallery-grid" id="media-gallery-grid">
                    <!-- Sample media items -->
                    <div class="media-item">
                        <img src="https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/sphere-small.jpg" class="media-item-image">
                        <div class="media-item-info">
                            <h4 class="media-item-title">City Panorama</h4>
                            <p class="media-item-meta">360° Image</p>
                        </div>
                        <div class="media-item-actions">
                            <button class="media-action-btn view-btn">View</button>
                            <button class="media-action-btn locate-btn">Locate</button>
                            <button class="media-action-btn delete-btn">Delete</button>
                        </div>
                    </div>
                    <div class="media-item">
                        <img src="https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/assets/example-preview.jpg" class="media-item-image">
                        <div class="media-item-info">
                            <h4 class="media-item-title">Castle Tour</h4>
                            <p class="media-item-meta">360° Video</p>
                        </div>
                        <div class="media-item-actions">
                            <button class="media-action-btn view-btn">View</button>
                            <button class="media-action-btn locate-btn">Locate</button>
                            <button class="media-action-btn delete-btn">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close button functionality
        document.getElementById("close-media-gallery-modal").addEventListener("click", function() {
            document.body.removeChild(modal);
        });
        
        // Upload media button functionality
        document.getElementById("upload-media-button").addEventListener("click", function() {
            document.body.removeChild(modal);
            openUploadMediaModal();
        });
    }

    // Function to open Upload Media Modal (matching reference image)
    function openUploadMediaModal() {
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.id = "upload-media-modal";
        modal.style.display = "block";
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button" id="close-upload-media-modal">&times;</span>
                <h2>Upload Image or Video</h2>
                
                <div class="form-group">
                    <label>Select File:</label>
                    <input type="file" id="media-file-input" accept=".jpg,.jpeg,.png,.mp4">
                    <small>Images (JPG, PNG - max 5MB), Videos (MP4 - max 20MB).</small>
                </div>
                
                <div class="form-group">
                    <label>Title/Caption (optional):</label>
                    <input type="text" id="media-title-input" placeholder="Enter title or caption">
                </div>
                
                <div class="form-group">
                    <label>Associate with:</label>
                    <div class="radio-group">
                        <label>
                            <input type="radio" name="media-association" value="gallery" checked>
                            General Gallery Only
                        </label>
                        <label>
                            <input type="radio" name="media-association" value="new-point">
                            Link to a New Map Point
                        </label>
                        <label>
                            <input type="radio" name="media-association" value="existing-feature">
                            Link to an Existing Map Feature (Select on map)
                        </label>
                    </div>
                </div>
                
                <div class="button-group">
                    <button class="button" id="upload-media-submit-button">Upload</button>
                    <button class="button cancel-button" id="cancel-media-upload">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close button functionality
        document.getElementById("close-upload-media-modal").addEventListener("click", function() {
            document.body.removeChild(modal);
        });
        
        // Cancel button functionality
        document.getElementById("cancel-media-upload").addEventListener("click", function() {
            document.body.removeChild(modal);
            openMediaGalleryModal();
        });
        
        // Upload button functionality
        document.getElementById("upload-media-submit-button").addEventListener("click", function() {
            // Simulate upload
            showNotification("Media upload functionality would be implemented here");
            document.body.removeChild(modal);
            openMediaGalleryModal();
        });
    }

    // Function to open Upload Geodata Modal
    function openUploadGeodataModal() {
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.id = "upload-geodata-modal";
        modal.style.display = "block";
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button" id="close-upload-geodata-modal">&times;</span>
                <h2>Upload Geodata</h2>
                
                <div class="form-group">
                    <label for="geodata-file-input">Select File:</label>
                    <input type="file" id="geodata-file-input" accept=".geojson,.json,.kml,.gpx,.zip">
                    <small>Supported formats: GeoJSON (.geojson, .json), KML (.kml), GPX (.gpx), Shapefile (.zip)</small>
                </div>
                
                <div class="form-group">
                    <label for="geodata-name-input">Layer Name (optional):</label>
                    <input type="text" id="geodata-name-input" placeholder="Enter a name for this layer">
                </div>
                
                <div class="form-group">
                    <label>Layer Style:</label>
                    <div class="style-options">
                        <div class="color-picker-container">
                            <label for="geodata-color-input">Color:</label>
                            <input type="color" id="geodata-color-input" value="#005f73">
                        </div>
                        <div class="opacity-slider-container">
                            <label for="geodata-opacity-input">Opacity:</label>
                            <input type="range" id="geodata-opacity-input" min="0" max="1" step="0.1" value="0.7">
                        </div>
                    </div>
                </div>
                
                <div class="button-group">
                    <button class="button" id="upload-geodata-button">Upload</button>
                    <button class="button cancel-button" id="cancel-geodata-upload">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close button functionality
        document.getElementById("close-upload-geodata-modal").addEventListener("click", function() {
            document.body.removeChild(modal);
        });
        
        // Cancel button functionality
        document.getElementById("cancel-geodata-upload").addEventListener("click", function() {
            document.body.removeChild(modal);
        });
        
        // Upload button functionality
        document.getElementById("upload-geodata-button").addEventListener("click", function() {
            // Simulate upload
            showNotification("Geodata upload functionality would be implemented here");
            document.body.removeChild(modal);
        });
    }

    // Initialize basemap toggle
    document.getElementById("baselayer-toggle-button").addEventListener("click", function() {
        const baselayerControl = document.querySelector(".custom-baselayer-control");
        if (baselayerControl.style.display === "block") {
            baselayerControl.style.display = "none";
        } else {
            baselayerControl.style.display = "block";
        }
    });

    // Create basemap grid with real thumbnails
    const basemapGrid = document.getElementById("basemap-grid");
    for (const name in baseLayers) {
        const option = document.createElement("div");
        option.className = "basemap-option";
        if (name === "OpenStreetMap") {
            option.classList.add("active");
        }
        
        option.innerHTML = `
            <img src="${basemapThumbnails[name]}" alt="${name}">
            <span>${name}</span>
        `;
        
        option.addEventListener("click", function() {
            // Remove active class from all options
            document.querySelectorAll(".basemap-option").forEach(opt => {
                opt.classList.remove("active");
            });
            
            // Add active class to clicked option
            this.classList.add("active");
            
            // Remove all base layers
            for (const layerName in baseLayers) {
                map.removeLayer(baseLayers[layerName]);
            }
            
            // Add selected base layer
            map.addLayer(baseLayers[name]);
            
            // Hide basemap control
            document.querySelector(".custom-baselayer-control").style.display = "none";
        });
        
        basemapGrid.appendChild(option);
    }

    // Handle window resize for responsive design
    window.addEventListener("resize", function() {
        // Check if we need to adjust for mobile view
        if (window.innerWidth <= 768) {
            // If sidebar is open on mobile, close it
            const sidebar = document.getElementById("sidebar");
            if (sidebar && !sidebar.classList.contains("open")) {
                sidebar.classList.remove("open");
            }
        }
    });

    // Trigger resize event to set initial state
    window.dispatchEvent(new Event("resize"));


    // Toggle sidebar and overlay
    document.getElementById('mobile-menu-toggle').addEventListener('click', function() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('map-overlay');
        
        sidebar.classList.toggle('hidden');
        overlay.classList.toggle('active');
    });

    document.getElementById('mobile-menu-toggle').addEventListener('click', function() {
        const mainSidebar = document.getElementById('sidebar');
        const menuPanel = document.querySelector('.menu-panel-class');
        
        if (window.innerWidth <= 768) {
            // Mobile behavior
            mainSidebar.classList.toggle('open');
            menuPanel.classList.toggle('open');
        } else {
            // Desktop behavior
            menuPanel.classList.toggle('open');
        }
    });
            



});
