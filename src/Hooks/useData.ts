import { useState } from "react";
import { DataState, StockData } from "../Interfaces/StockData";
import {
  CARD,
  CARD_BLUR,
  DAILY_PERIOD,
  DEFAULT_STOCK_TITLE,
  E105_MSG,
  E106_MSG,
  E108_CODE,
  E108_MSG,
  END_DATE,
  MONTHLY_PERIOD,
  START_DATE,
  WEEKLY_PERIOD,
} from "../Helpers/Constants";
import { buildURL } from "../Helpers/URLbuilder";
import { AppError as Error } from "../AppError";
import { ApiService } from "../Services/ApiService";

const useData = () => {
  const apiService = new ApiService();

  const initialState = {
    d: [],
    w: [],
    m: [],
  };

  const [data, setData] = useState<DataState>(initialState);
  const [isLoading, setLoading] = useState(false);

  /*  Fetches stock data from api
   Default stock is used if stock is not specified */
  const fetchData = async (apiToken: string, stock?: string) => {
    setLoading(true);
    try {
      const [dailyData, weeklyData, monthlyData] = await Promise.all([
        fetchPeriod(apiToken, DAILY_PERIOD, stock),
        fetchPeriod(apiToken, WEEKLY_PERIOD, stock),
        fetchPeriod(apiToken, MONTHLY_PERIOD, stock),
      ]);
      if (dailyData && weeklyData && monthlyData) {
        setData({
          d: dailyData,
          w: weeklyData,
          m: monthlyData,
        });
      } else {
        handleFetchDataError(dailyData, weeklyData, monthlyData);
      }
      setLoading(false);
    } catch (error) {
      throw error;
    }
  };

  const fetchChartDataForStock = async (stock: string) => {
    try {
      await fetchData(stock);
    } catch (error) {
      console.error(E106_MSG, error);
    }
  };

  const fetchPeriod = async (
    apiToken: string,
    period: string,
    stock?: string
  ): Promise<StockData[] | undefined> => {
    let stockName = stock ?? DEFAULT_STOCK_TITLE;
    const url = buildURL(apiToken, START_DATE, END_DATE, stockName, period);

    try {
      const data = await apiService.get<StockData[]>(url);
      if (isArrayOfStockData(data)) {
        return data;
      } else {
        throw new Error(E108_MSG, E108_CODE);
      }
    } catch (error) {
      throw error;
    }
  };

  return {
    data,
    setData,
    isLoading,
    fetchData,
    fetchAllPeriodsWithStock: fetchChartDataForStock,
  };
};

export default useData;

function handleFetchDataError(
  dailyData: StockData[] | undefined,
  weeklyData: StockData[] | undefined,
  monthlyData: StockData[] | undefined
) {
  console.error(
    `${E105_MSG} ->  dailyData: ${dailyData}, weeklyData: ${weeklyData}, monthlyData: ${monthlyData}`
  );
}

function isArrayOfStockData(data: any): data is StockData[] {
  if (!Array.isArray(data)) {
    return false;
  }

  // Check if every item in the array is of type StockData
  return data.every((item) => {
    return (
      (typeof item.date === "number" || typeof item.date === "string") &&
      typeof item.open === "number" &&
      typeof item.high === "number" &&
      typeof item.low === "number" &&
      typeof item.close === "number" &&
      typeof item.adjusted_close === "number" &&
      typeof item.volume === "number"
    );
  });
}
