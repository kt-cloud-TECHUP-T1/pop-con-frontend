'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import {
  createQueueSocket,
  getQueueSocketUrl,
} from '@/features/queue/services/queue-socket';
import type {
  QueueConnectionStatus,
  QueueSnapshot,
} from '@/features/queue/types/queue';

interface UseQueueRealtimeParams {
  auctionId: string;
  userId: string;
  enabled?: boolean;
}

export const useQueueRealtime = ({
  auctionId,
  userId,
  enabled = true,
}: UseQueueRealtimeParams) => {
  // 화면에서 바로 사용할 최소 상태:
  // - snapshot: 서버가 내려준 현재 대기열 정보
  // - connectionStatus: 소켓 연결 상태
  const [snapshot, setSnapshot] = useState<QueueSnapshot | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<QueueConnectionStatus>('idle');
  const socketRef = useRef<Socket | null>(null);

  // 소켓 리스너 정리 + 연결 해제 공통 함수
  const cleanup = useCallback(() => {
    const currentSocket = socketRef.current;
    if (currentSocket) {
      currentSocket.removeAllListeners();
      currentSocket.disconnect();
      socketRef.current = null;
    }
  }, []);

  // 소켓 생성 및 기본 이벤트(connect/disconnect/error) 바인딩
  const connect = useCallback(() => {
    if (!enabled) {
      return;
    }

    setConnectionStatus('connecting');

    const socketUrl = getQueueSocketUrl();
    if (!socketUrl) {
      setConnectionStatus('error');
      return;
    }

    const joinPayload = { auctionId, userId };
    const socket = createQueueSocket(socketUrl, joinPayload);
    socketRef.current = socket;

    // 연결 성공 시 서버에 대기열 참가 이벤트 전달
    socket.on('connect', () => {
      setConnectionStatus('connected');
      socket.emit('queue:join', joinPayload);
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    socket.on('connect_error', () => {
      setConnectionStatus('error');
    });

    // 서버의 첫 대기열 스냅샷 수신
    socket.on('queue:joined', (event: QueueSnapshot) => {
      setSnapshot(event);
    });

    // 서버가 내려주는 변경사항(순번/대기인원/상태)을 누적 반영
    socket.on('queue:update', (event: Partial<QueueSnapshot>) => {
      setSnapshot((prev) => {
        if (!prev) {
          return null;
        }

        return {
          ...prev,
          ...event,
        };
      });
    });

    socket.on('queue:ready', (event) => {
      setSnapshot((prev) => {
        if (!prev) {
          return null;
        }

        return {
          ...prev,
          ...event,
          status: 'ready',
        };
      });
    });

    socket.on('queue:expired', (event) => {
      setSnapshot((prev) => {
        if (!prev) {
          return null;
        }

        return {
          ...prev,
          ...event,
          status: 'expired',
        };
      });
    });
  }, [auctionId, enabled, userId]);

  // 수동 재연결: 기존 소켓 정리 후 다시 connect
  const reconnect = useCallback(() => {
    cleanup();
    connect();
  }, [cleanup, connect]);

  // 대기열 이탈: 서버에 leave 알리고 로컬 상태 초기화
  const leaveQueue = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('queue:leave', {
        auctionId,
        userId,
      });
    }

    cleanup();
    setSnapshot(null);
    setConnectionStatus('idle');
  }, [auctionId, cleanup, userId]);

  // 훅 마운트 시 자동 연결, 언마운트 시 정리
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      connect();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      cleanup();
    };
  }, [cleanup, connect]);

  return {
    snapshot,
    connectionStatus,
    reconnect,
    leaveQueue,
  };
};
