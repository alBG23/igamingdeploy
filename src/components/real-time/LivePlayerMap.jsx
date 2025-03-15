import React, { useEffect, useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function LivePlayerMap({ data = [], isLoading = false, height = 400 }) {
  const mapRef = useRef(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  
  useEffect(() => {
    // Load Google Maps script if it doesn't exist
    if (!window.google && !document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=DEMO_KEY&libraries=visualization`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else if (window.google && !mapInitialized) {
      initializeMap();
    }
  }, []);
  
  useEffect(() => {
    if (mapInitialized && data.length > 0) {
      updateMapData(data);
    }
  }, [data, mapInitialized]);
  
  const initializeMap = () => {
    if (!mapRef.current || mapInitialized) return;
    
    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 30, lng: 0 },
        zoom: 2,
        styles: [
          {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [{ "visibility": "off" }]
          },
          {
            "featureType": "poi",
            "stylers": [{ "visibility": "off" }]
          },
          {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [{ "visibility": "off" }]
          },
          {
            "featureType": "transit",
            "stylers": [{ "visibility": "off" }]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#e9e9e9" }]
          }
        ]
      });
      
      const heatmap = new window.google.maps.visualization.HeatmapLayer({
        data: [],
        map: map,
        radius: 20,
        opacity: 0.7
      });
      
      mapRef.current.map = map;
      mapRef.current.heatmap = heatmap;
      
      setMapInitialized(true);
      
      if (data.length > 0) {
        updateMapData(data);
      }
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };
  
  const updateMapData = (locations) => {
    if (!mapRef.current || !mapRef.current.map || !mapRef.current.heatmap) return;
    
    try {
      // Create markers and heatmap points
      const heatmapData = [];
      const markers = [];
      const bounds = new window.google.maps.LatLngBounds();
      
      // Clear previous markers
      if (mapRef.current.markers) {
        mapRef.current.markers.forEach(marker => marker.setMap(null));
      }
      
      locations.forEach(location => {
        const position = new window.google.maps.LatLng(
          location.coordinates[1], 
          location.coordinates[0]
        );
        
        // Add weighted point for heatmap
        heatmapData.push({
          location: position,
          weight: location.players / 5 // Normalize weight
        });
        
        // Create marker
        const marker = new window.google.maps.Marker({
          position: position,
          map: mapRef.current.map,
          title: `${location.country}: ${location.players} players`,
          label: {
            text: location.players.toString(),
            color: 'white',
            fontSize: '10px'
          },
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#4f46e5',
            fillOpacity: 0.9,
            strokeWeight: 1,
            strokeColor: '#ffffff'
          }
        });
        
        // Add click listener to marker
        marker.addListener('click', () => {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 5px;">
                <h3 style="margin: 0 0 5px; font-size: 14px;">${location.country}</h3>
                <p style="margin: 0; font-size: 12px;">
                  Active Players: <strong>${location.players}</strong><br/>
                  ${location.depositRate ? `Deposit Rate: <strong>$${location.depositRate}/min</strong>` : ''}
                </p>
              </div>
            `
          });
          infoWindow.open(mapRef.current.map, marker);
        });
        
        markers.push(marker);
        bounds.extend(position);
      });
      
      // Save markers for later cleanup
      mapRef.current.markers = markers;
      
      // Update heatmap data
      mapRef.current.heatmap.setData(heatmapData);
      
      // Adjust map bounds if we have locations
      if (locations.length > 0) {
        mapRef.current.map.fitBounds(bounds);
      }
    } catch (error) {
      console.error("Error updating map data:", error);
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Live Player Distribution</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
              {data.reduce((sum, loc) => sum + loc.players, 0)} Active Players
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {data.length} Regions
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="px-6 pb-6">
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : (
          <div ref={mapRef} style={{ height: `${height}px`, width: '100%' }}>
            {!window.google && (
              <div className="h-full w-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">Loading map...</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}