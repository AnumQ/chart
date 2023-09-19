export interface StockData {
  date: number | string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjusted_close: number;
  volume: number;
}

export interface StockDataProps {
  data: StockData[];
}

export interface DataState {
  [key: string]: StockData[];
  d: StockData[];
  w: StockData[];
  m: StockData[];
}
