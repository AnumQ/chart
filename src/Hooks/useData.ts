import { useState } from "react";
import { DataState, StockData } from "../Interfaces/StockData";
import {
  CARD,
  CARD_BLUR,
  DAILY_PERIOD,
  DEFAULT_STOCK_TITLE,
  E104_MSG,
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
import { ApiService } from "../Services/ApiService";
import { AppError as Error } from "../AppError";

const useData = () => {
  const apiService = new ApiService();

  const initialState = {
    d: [],
    w: [],
    m: [],
  };

  const [data, setData] = useState<DataState>(initialState);
  const [cardClass, setCardClass] = useState(CARD);

  /*  Fetches stock data from api
   Default stock is used if stock is not specified */
  const fetchData = async (apiToken: string, stock?: string) => {
    setCardClass(CARD_BLUR);

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
    setCardClass(CARD);
  };

  const fetchAllPeriodsWithStock = async (stock: string) => {
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
      const data = await apiService.get<StockData[] | undefined>(url);

      if (isArrayOfStockData(data)) {
        return data;
      } else {
        throw new Error(E108_MSG, E108_CODE);
      }
    } catch (error) {
      if (error instanceof Error) handleFetchPeriodError(error, period);
      return undefined;
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

function handleFetchPeriodError(error: Error, period: string) {
  console.error(`${E104_MSG} ${period}. Details: ${error.toString()}`);
}

function isArrayOfStockData(data: any): data is StockData[] {
  if (!Array.isArray(data)) {
    return false;
  }

  // Check if every element in the array is of type StockData
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
