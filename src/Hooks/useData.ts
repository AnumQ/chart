import { useEffect, useState } from "react";
import { DataState } from "../Interfaces/StockData";
import {
  CARD,
  CARD_BLUR,
  DAILY_PERIOD,
  DEFAULT_STOCK_TITLE,
  DEMO_API_TOKEN,
  END_DATE,
  LIVE_API_TOKEN,
  MONTHLY_PERIOD,
  NAV_ITEM_DEMO,
  NAV_ITEM_LIVE,
  START_DATE,
  WEEKLY_PERIOD,
} from "../Helpers/Constants";
import axios from "axios";
import { buildURL } from "../Helpers/URLbuilder";

export const useData = () => {
  const [stockTitle, setStockTitle] = useState(DEFAULT_STOCK_TITLE);
  const [activeButton, setActiveButton] = useState<string>(NAV_ITEM_DEMO);
  const [data, setData] = useState<DataState>(initialState);
  const [cardClass, setCardClass] = useState(CARD);

  useEffect(() => {
    fetchData();
  }, [activeButton, stockTitle]); // TODO: fix the requirement of stockTitle, should not be used like this

  /*  Fetches stock data from api
  Uses default stock if no stock is specified */
  const fetchData = async (stock?: string) => {
    try {
      setCardClass(CARD_BLUR);
      const [dailyData, weeklyData, monthlyData] = await Promise.all([
        fetchDataForPeriod(DAILY_PERIOD, stock),
        fetchDataForPeriod(WEEKLY_PERIOD, stock),
        fetchDataForPeriod(MONTHLY_PERIOD, stock),
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
    setStockTitle(stock);
    try {
      await fetchData(stock);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataForPeriod = async (period: string, stock?: string) => {
    try {
      const apiToken = fetchApiToken(activeButton);
      const response = await axios.get(
        buildURL(apiToken, START_DATE, END_DATE, stock || stockTitle, period)
      );
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
    stockTitle,
    setStockTitle,
    activeButton,
    setActiveButton,
    fetchAllPeriodsWithStock,
  };
};

function fetchApiToken(activeButton: string) {
  const apiTokens: Record<string, string> = {
    [NAV_ITEM_DEMO]: DEMO_API_TOKEN,
    [NAV_ITEM_LIVE]: LIVE_API_TOKEN,
  };

  return apiTokens[activeButton] || DEMO_API_TOKEN;
}

const initialState = {
  d: [],
  w: [],
  m: [],
};
