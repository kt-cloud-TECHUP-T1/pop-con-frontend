'use client';

import { useEffect, useRef } from 'react';

interface SaleMapProps {
  location: string;
}

export function SaleMap({ location }: SaleMapProps) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markerRef = useRef<naver.maps.Marker | null>(null);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
    if (!clientId) return;

    const initOrUpdateMap = () => {
      if (!window.naver?.maps?.Service) return;

      naver.maps.Service.geocode({ query: location }, (status, response) => {
        if (status !== naver.maps.Service.Status.OK) return;

        const result = response.v2.addresses?.[0];
        if (!result) return;

        const lat = Number(result.y);
        const lng = Number(result.x);
        const coords = new naver.maps.LatLng(lat, lng);

        const mapElement = mapElementRef.current;
        if (!mapElement) return;

        if (!mapRef.current) {
          mapRef.current = new naver.maps.Map(mapElement, {
            center: coords,
            zoom: 16,
          });

          markerRef.current = new naver.maps.Marker({
            position: coords,
            map: mapRef.current,
          });

          return;
        }

        mapRef.current.setCenter(coords);
        markerRef.current?.setPosition(coords);
      });
    };

    if (window.naver?.maps?.Service) {
      initOrUpdateMap();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-naver-map="true"]'
    );

    if (existingScript) {
      window.naver.maps.onJSContentLoaded = initOrUpdateMap;
      return;
    }

    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=geocoder`;
    script.async = true;
    script.dataset.naverMap = 'true';

    script.addEventListener('load', () => {
      naver.maps.onJSContentLoaded = initOrUpdateMap;
    });

    document.head.appendChild(script);
  }, [location]);

  return (
    <section id="map" className="w-full h-[400px] scroll-mt-24">
      <div ref={mapElementRef} className="w-full h-full" />
    </section>
  );
}
