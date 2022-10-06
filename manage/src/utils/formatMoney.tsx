export const toVND = (number: number): string => {
  return number.toLocaleString('vi', { style: 'currency', currency: 'VND' });
};
