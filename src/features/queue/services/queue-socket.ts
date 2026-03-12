import { io, type Socket } from 'socket.io-client';
import type { QueueJoinPayload } from '@/features/queue/types/queue';

export const createQueueSocket = (
  socketUrl: string,
  joinPayload: QueueJoinPayload
): Socket => {
  return io(socketUrl, {
    path: process.env.NEXT_PUBLIC_QUEUE_SOCKET_PATH ?? '/socket.io',
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    auth: {
      auctionId: joinPayload.auctionId,
      userId: joinPayload.userId,
    },
  });
};

export const getQueueSocketUrl = (): string | null => {
  return process.env.NEXT_PUBLIC_QUEUE_SOCKET_URL ?? null;
};
