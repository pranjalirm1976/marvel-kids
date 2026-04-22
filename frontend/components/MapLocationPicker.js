"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, CheckCircle, X, Loader2, Navigation } from "lucide-react";

/* ─── Nominatim reverse-geocode helper ─── */
async function reverseGeocode(lat, lng) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=jsonv2&addressdetails=1&zoom=19&namedetails=1&extratags=1&accept-language=en`,
    { headers: { Accept: "application/json" } }
  );
  if (!res.ok) throw new Error("Geocode failed");
  const data = await res.json();
  const a = data.address || {};

  const normalize = (value) => (value ? String(value).trim() : "");
  const dedupe = (parts) => {
    const seen = new Set();
    return parts.filter((part) => {
      const clean = normalize(part);
      if (!clean) return false;
      const key = clean.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const building =
    a.building ||
    a.amenity ||
    a.office ||
    a.commercial ||
    a.shop ||
    a.tourism ||
    data.name ||
    data.namedetails?.name ||
    "";

  const road = a.road || a.pedestrian || a.footway || a.path || a.cycleway || "";
  const area =
    a.neighbourhood ||
    a.suburb ||
    a.residential ||
    a.city_district ||
    a.quarter ||
    a.hamlet ||
    "";

  const city = a.city || a.town || a.village || a.municipality || a.county || "";
  const district = a.state_district || a.county || "";
  const country = a.country || "India";

  const line1 = dedupe([a.house_number, building, road]).join(", ");
  const line2 = dedupe([
    a.neighbourhood,
    a.suburb,
    a.residential,
    a.city_district,
    a.quarter,
    a.hamlet,
    a.city_block,
  ]).join(", ");

  const localityTrail = dedupe([city, district, a.state, a.postcode, country]).join(", ");

  const fullAddress = dedupe([line1, line2, localityTrail]).join(", ");

  const fallbackAddress = data.display_name
    ? data.display_name
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .join(", ")
    : "";

  return {
    address: fullAddress || fallbackAddress || "",
    line1,
    line2,
    fullAddress: fullAddress || fallbackAddress || "",
    landmark: building,
    area,
    district,
    city,
    state: a.state || "",
    pincode: a.postcode || "",
    country,
    display: data.display_name || "",
    latitude: lat,
    longitude: lng,
  };
}

export default function MapLocationPicker({ initialLat, initialLng, onConfirm, onClose }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [addressInfo, setAddressInfo] = useState(null);
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState("");

  const doGeocode = useCallback(async (lat, lng) => {
    setGeocoding(true);
    setError("");
    try {
      const info = await reverseGeocode(lat, lng);
      setAddressInfo(info);
    } catch {
      setError("Could not fetch address for this location. Try dragging the pin.");
    } finally {
      setGeocoding(false);
    }
  }, []);

  useEffect(() => {
    // Dynamically import Leaflet (browser-only)
    let L;
    let cancelled = false;

    (async () => {
      L = (await import("leaflet")).default;

      // Fix default marker icon paths broken by webpack
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (cancelled || !mapRef.current || mapInstanceRef.current) return;

      const lat = initialLat || 19.076;
      const lng = initialLng || 72.8777;

      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 17,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Custom vivid red pin icon
      const pinIcon = L.divIcon({
        className: "",
        html: `<div style="
          width:36px;height:36px;
          background:#ff3d3d;
          border:3px solid #fff;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 4px 16px rgba(0,0,0,0.35);
          position:relative;
        ">
          <div style="
            width:10px;height:10px;
            background:#fff;
            border-radius:50%;
            position:absolute;
            top:50%;left:50%;
            transform:translate(-50%,-50%);
          "></div>
        </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      });

      const marker = L.marker([lat, lng], { icon: pinIcon, draggable: true }).addTo(map);
      markerRef.current = marker;
      mapInstanceRef.current = map;

      // Reverse geocode initial position
      doGeocode(lat, lng);

      // On drag end → reverse geocode new position
      marker.on("dragend", () => {
        const { lat: newLat, lng: newLng } = marker.getLatLng();
        doGeocode(newLat, newLng);
      });

      // Click on map → move marker + geocode
      map.on("click", (e) => {
        marker.setLatLng(e.latlng);
        doGeocode(e.latlng.lat, e.latlng.lng);
      });
    })();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initialLat, initialLng, doGeocode]);

  const handleConfirm = () => {
    if (!addressInfo) return;
    onConfirm(addressInfo);
  };

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />

      {/* Modal Overlay */}
      <div
        className="fixed inset-0 z-[9999] flex flex-col bg-[#0d0d0d]/80 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="relative flex flex-col m-auto w-full max-w-2xl h-[90vh] bg-white shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between bg-[#0d0d0d] px-5 py-4 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <Navigation size={16} className="text-[#ffd60a]" />
              <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-white">
                Confirm Your Delivery Location
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Instruction bar */}
          <div className="bg-[#ffd60a]/10 border-b border-[#ffd60a]/30 px-5 py-2.5 flex-shrink-0">
            <p className="text-[10px] font-bold text-[#0d0d0d] uppercase tracking-wider">
              📍 Drag the pin or tap on the map to set your exact delivery location
            </p>
          </div>

          {/* Map */}
          <div ref={mapRef} className="flex-1 w-full" style={{ minHeight: 0 }} />

          {/* Address Preview Panel */}
          <div className="flex-shrink-0 border-t border-gray-100 bg-white p-4">
            {geocoding ? (
              <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                <Loader2 size={14} className="animate-spin text-[#ffd60a]" />
                Fetching address for this pin location…
              </div>
            ) : error ? (
              <p className="text-[11px] text-[#ff3d3d] font-semibold">{error}</p>
            ) : addressInfo ? (
              <div className="space-y-1 mb-1">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-[#ff3d3d] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#0d0d0d] leading-snug">
                      {addressInfo.fullAddress || addressInfo.address || "Location detected"}
                    </p>
                    {(addressInfo.landmark || addressInfo.area) && (
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {[addressInfo.landmark, addressInfo.area]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {[addressInfo.city, addressInfo.district, addressInfo.state, addressInfo.pincode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-gray-400">Detecting address…</p>
            )}

            <button
              onClick={handleConfirm}
              disabled={!addressInfo || geocoding}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-[#ffd60a] text-[#0d0d0d] py-3.5 text-[11px] font-extrabold uppercase tracking-widest hover:bg-[#e6c009] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle size={14} />
              Confirm this Location
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
