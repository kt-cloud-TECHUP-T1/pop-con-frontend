export const formatRankText = (position?: number | null) => {
  if (position === null || position === undefined) {
    return '-';
  }

  return new Intl.NumberFormat('ko-KR').format(position);
};
