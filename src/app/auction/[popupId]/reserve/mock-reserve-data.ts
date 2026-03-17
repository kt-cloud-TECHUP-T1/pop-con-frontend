// 예약 페이지 발표/개발용 목업 데이터.
// 실제 API가 붙기 전까지 날짜별 회차 수와 잔여 좌석을 여기서 조정한다.
export const mockReserveData = {
  title: '티켓 결제',
  description:
    '원하는 날짜와 시간을 선택하고 실시간 할인가로 티켓을 구매하세요',
  phaseStatus: 'OPEN',
  auctionCloseAt: '2026-03-18T18:00:00+09:00',
  serverTime: '2026-03-18T17:29:06+09:00',
  schedules: [
    {
      date: '2026-03-18',
      slots: [
        {
          id: '2026-03-18-1',
          label: '1회차',
          time: '11:00 - 11:30',
          remaining: 0,
        },
        {
          id: '2026-03-18-2',
          label: '2회차',
          time: '11:30 - 12:00',
          remaining: 0,
        },
        {
          id: '2026-03-18-3',
          label: '3회차',
          time: '12:00 - 12:30',
          remaining: 0,
        },
        {
          id: '2026-03-18-4',
          label: '4회차',
          time: '12:30 - 13:00',
          remaining: 0,
        },
        {
          id: '2026-03-18-5',
          label: '5회차',
          time: '13:00 - 13:30',
          remaining: 0,
        },
        {
          id: '2026-03-18-6',
          label: '6회차',
          time: '13:30 - 14:00',
          remaining: 1,
        },
        {
          id: '2026-03-18-7',
          label: '7회차',
          time: '14:00 - 14:30',
          remaining: 1,
        },
        {
          id: '2026-03-18-8',
          label: '8회차',
          time: '14:30 - 15:00',
          remaining: 0,
        },
        {
          id: '2026-03-18-9',
          label: '9회차',
          time: '15:00 - 15:30',
          remaining: 0,
        },
        {
          id: '2026-03-18-10',
          label: '10회차',
          time: '15:30 - 16:00',
          remaining: 0,
        },
        {
          id: '2026-03-18-11',
          label: '11회차',
          time: '16:00 - 16:30',
          remaining: 1,
        },
        {
          id: '2026-03-18-12',
          label: '12회차',
          time: '16:30 - 17:00',
          remaining: 2,
        },
        {
          id: '2026-03-18-13',
          label: '13회차',
          time: '17:00 - 17:30',
          remaining: 0,
        },
        {
          id: '2026-03-18-14',
          label: '14회차',
          time: '17:30 - 18:00',
          remaining: 0,
        },
        {
          id: '2026-03-18-15',
          label: '15회차',
          time: '18:00 - 18:30',
          remaining: 0,
        },
        {
          id: '2026-03-18-16',
          label: '16회차',
          time: '18:30 - 19:00',
          remaining: 0,
        },
        {
          id: '2026-03-18-17',
          label: '17회차',
          time: '19:00 - 19:30',
          remaining: 0,
        },
        {
          id: '2026-03-18-18',
          label: '18회차',
          time: '19:30 - 20:00',
          remaining: 0,
        },
        {
          id: '2026-03-18-19',
          label: '19회차',
          time: '20:00 - 20:30',
          remaining: 0,
        },
        {
          id: '2026-03-18-20',
          label: '20회차',
          time: '20:30 - 21:00',
          remaining: 0,
        },
        {
          id: '2026-03-18-21',
          label: '21회차',
          time: '21:00 - 21:30',
          remaining: 0,
        },
        {
          id: '2026-03-18-22',
          label: '22회차',
          time: '21:30 - 22:00',
          remaining: 0,
        },
        {
          id: '2026-03-18-23',
          label: '23회차',
          time: '22:00 - 22:30',
          remaining: 2,
        },
        {
          id: '2026-03-18-24',
          label: '24회차',
          time: '22:30 - 23:00',
          remaining: 5,
        },
      ],
    },
    {
      date: '2026-03-19',
      slots: [
        {
          id: '2026-03-19-1',
          label: '1회차',
          time: '12:00 - 13:00',
          remaining: 8,
        },
        {
          id: '2026-03-19-2',
          label: '2회차',
          time: '14:00 - 15:00',
          remaining: 0,
        },
      ],
    },
    {
      date: '2026-03-20',
      slots: [
        {
          id: '2026-03-20-1',
          label: '1회차',
          time: '11:30 - 12:30',
          remaining: 6,
        },
        {
          id: '2026-03-20-2',
          label: '2회차',
          time: '14:30 - 15:30',
          remaining: 1,
        },
        {
          id: '2026-03-20-3',
          label: '3회차',
          time: '17:00 - 18:00',
          remaining: 5,
        },
      ],
    },
    {
      date: '2026-03-22',
      slots: [
        {
          id: '2026-03-22-1',
          label: '1회차',
          time: '10:30 - 11:30',
          remaining: 9,
        },
      ],
    },
    {
      date: '2026-03-24',
      slots: [
        {
          id: '2026-03-24-1',
          label: '1회차',
          time: '11:00 - 12:00',
          remaining: 7,
        },
        {
          id: '2026-03-24-2',
          label: '2회차',
          time: '13:00 - 14:00',
          remaining: 3,
        },
      ],
    },
    {
      date: '2026-03-25',
      slots: [
        {
          id: '2026-03-25-1',
          label: '1회차',
          time: '12:30 - 13:30',
          remaining: 0,
        },
        {
          id: '2026-03-25-2',
          label: '2회차',
          time: '16:00 - 17:00',
          remaining: 4,
        },
      ],
    },
    {
      date: '2026-03-29',
      slots: [
        {
          id: '2026-03-29-1',
          label: '1회차',
          time: '11:00 - 12:00',
          remaining: 2,
        },
        {
          id: '2026-03-29-2',
          label: '2회차',
          time: '13:30 - 14:30',
          remaining: 6,
        },
        {
          id: '2026-03-29-3',
          label: '3회차',
          time: '16:00 - 17:00',
          remaining: 11,
        },
      ],
    },
  ],
};

export const mockData = {
  auctionId: 1,
  auctionStatus: 'OPEN',
  startPrice: 100000,
  minimumPrice: 30000,
  currentPrice: 96000,
  nextPrice: 95000,
  priceDropUnit: 1000,
  priceDropIntervalSeconds: 10,
  secondsUntilNextDrop: 4,
  openedAt: '2026-03-11T14:48:13',
  closedAt: '2026-03-11T14:58:53',
  serverTime: '2026-03-11T14:49:15',
};
