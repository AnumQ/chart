import { useState } from "react";
import { DataState, StockData } from "../Interfaces/StockData";
import {
  CARD,
  CARD_BLUR,
  DAILY_PERIOD,
  DEFAULT_STOCK_TITLE,
  END_DATE,
  MONTHLY_PERIOD,
  START_DATE,
  WEEKLY_PERIOD,
} from "../Helpers/Constants";
import { buildURL } from "../Helpers/URLbuilder";
import { ApiService } from "../Services/ApiService";

export const useData = () => {
  const apiService = new ApiService();

  const [data, setData] = useState<DataState>(initialState);
  const [cardClass, setCardClass] = useState(CARD);

  /*  Fetches stock data from api
   Default stock is used if stock is not specified */
  const fetchData = async (apiToken: string, stock?: string) => {
    setCardClass(CARD_BLUR);

    const [dailyData, weeklyData, monthlyData] = await Promise.all([
      fetchDataForPeriod(apiToken, DAILY_PERIOD, stock),
      fetchDataForPeriod(apiToken, WEEKLY_PERIOD, stock),
      fetchDataForPeriod(apiToken, MONTHLY_PERIOD, stock),
    ]);
    if (dailyData && weeklyData && monthlyData) {
      setData({
        d: dailyData,
        w: weeklyData,
        m: monthlyData,
      });
    } else {
      console.error("Unable to fetch data");
    }
  };

  const fetchAllPeriodsWithStock = async (stock: string) => {
    try {
      await fetchData(stock);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataForPeriod = async (
    apiToken: string,
    period: string,
    stock?: string
  ): Promise<StockData[] | undefined> => {
    let stockName = stock ?? DEFAULT_STOCK_TITLE;
    const url = buildURL(apiToken, START_DATE, END_DATE, stockName, period);

    const data = await apiService.get<StockData[] | undefined>(url);
    const stockData = data as StockData[];
    if (stockData) {
      return stockData as StockData[];
    } else {
      alert("Data type is not a list of StockData");
      return;
    }
  };

  return {
    data,
    setData,
    cardClass,
    setCardClass,
    fetchData,
    fetchAllPeriodsWithStock,
  };
};

const initialState = {
  d: [],
  w: [],
  m: [],
};
