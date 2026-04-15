'use client';

import { Icon } from '@/components/Icon/Icon';
import { Button } from '@/components/ui/button';
import { snackbar } from '@/components/ui/snackbar';
import { Typography } from '@/components/ui/typography';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { usePopupDetailQuery } from '../queries/use-popup-detail-query';

export function SaleMap() {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markerRef = useRef<naver.maps.Marker | null>(null);
  const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
  const [isMapLoadFailed, setIsMapLoadFailed] = useState(!clientId);
  const params = useParams<{ popupId: string }>();
  const popupIdNumber = Number(params.popupId);
  const { data: popupData } = usePopupDetailQuery(popupIdNumber);

  const handleCopyAddress = async () => {
    if (!popupData?.location) {
      snackbar.destructive({ title: '복사할 주소가 없습니다.' });
      return;
    }

    try {
      await navigator.clipboard.writeText(popupData.location);
      snackbar.success({ title: '주소가 복사되었습니다.' });
    } catch {
      snackbar.destructive({ title: '주소 복사에 실패했습니다.' });
    }
  };

  useEffect(() => {
    if (!location) return;
    if (!clientId) return;

    const initOrUpdateMap = () => {
      if (!window.naver?.maps?.Service) {
        setIsMapLoadFailed(true);
        return;
      }
      if (!popupData?.location) return;

      naver.maps.Service.geocode(
        { query: popupData?.location },
        (status, response) => {
          if (status !== naver.maps.Service.Status.OK) {
            setIsMapLoadFailed(true);
            return;
          }

          const result = response.v2.addresses?.[0];
          if (!result) {
            setIsMapLoadFailed(true);
            return;
          }

          const lat = Number(result.y);
          const lng = Number(result.x);
          const coords = new naver.maps.LatLng(lat, lng);

          const mapElement = mapElementRef.current;
          if (!mapElement) {
            setIsMapLoadFailed(true);
            return;
          }

          setIsMapLoadFailed(false);

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
        }
      );
    };

    if (window.naver?.maps?.Service) {
      initOrUpdateMap();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-naver-map="true"]'
    );

    if (existingScript) {
      if (window.naver?.maps) {
        window.naver.maps.onJSContentLoaded = initOrUpdateMap;
      } else {
        existingScript.addEventListener('load', () => {
          naver.maps.onJSContentLoaded = initOrUpdateMap;
        });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=geocoder`;
    script.async = true;
    script.dataset.naverMap = 'true';

    script.addEventListener('load', () => {
      naver.maps.onJSContentLoaded = initOrUpdateMap;
    });
    script.addEventListener('error', () => {
      setIsMapLoadFailed(true);
    });

    document.head.appendChild(script);
  }, [clientId, popupData?.location]);

  return (
    <div className="pb-l">
      <div>
        <Typography variant="title-1" weight="bold" className="pb-ms">
          팝업 스토어 위치
        </Typography>
      </div>
      <div className="border-[1px] border-[var(--line-3)] rounded-m">
        <section id="map" className="w-full h-[300px] ">
          {isMapLoadFailed ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-s rounded-m bg-[var(--background-2)] px-ms text-center">
              <Typography variant="body-1" weight="regular">
                지도를 불러오지 못했습니다.
              </Typography>
              <Button
                variant="secondary"
                size="small"
                onClick={() => window.location.reload()}
              >
                새로고침
              </Button>
            </div>
          ) : (
            <div ref={mapElementRef} className="w-full h-full rounded-m" />
          )}
        </section>
        <div className="flex p-ms justify-between items-center">
          <Typography variant="body-1" weight="regular">
            {popupData?.location}
          </Typography>
          <Button
            variant="secondary"
            leftIcon={<Icon name="Copy"></Icon>}
            onClick={handleCopyAddress}
          >
            주소 복사
          </Button>
        </div>
      </div>
    </div>
  );
}
