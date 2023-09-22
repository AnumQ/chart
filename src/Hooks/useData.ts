import { useState } from "react";
import { DataState } from "../Interfaces/StockData";
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
import axios from "axios";
import { buildURL } from "../Helpers/URLbuilder";

export const useData = () => {
  const [data, setData] = useState<DataState>(initialState);
  const [cardClass, setCardClass] = useState(CARD);

  /*  Fetches stock data from api
  Uses default stock if no stock is specified */
  const fetchData = async (apiToken: string, stock?: string) => {
    setCardClass(CARD_BLUR);

    try {
      const [dailyData, weeklyData, monthlyData] = await Promise.all([
        fetchDataForPeriod(apiToken, DAILY_PERIOD, stock),
        fetchDataForPeriod(apiToken, WEEKLY_PERIOD, stock),
        fetchDataForPeriod(apiToken, MONTHLY_PERIOD, stock),
      ]);
      if (
        dailyData instanceof Error ||
        weeklyData instanceof Error ||
        monthlyData instanceof Error
      ) {
        throw new Error("Error occurred while fetching data");
      } else {
        setData({
          d: dailyData,
          w: weeklyData,
          m: monthlyData,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setCardClass(CARD);
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
  ) => {
    try {
      let stockName = stock ?? DEFAULT_STOCK_TITLE;
      const url = buildURL(apiToken, START_DATE, END_DATE, stockName, period);
      const response = await axios.get(url);
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Network response was not 200");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return error;
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
