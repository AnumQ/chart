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
    // Fetch data for all periods (daily, monthly, weekly)
    fetchData();
  }, [activeButton, stockTitle]);

  const fetchData = async () => {
    try {
      const [dailyData, weeklyData, monthlyData] = await Promise.all([
        fetchDataForPeriod(DAILY_PERIOD),
        fetchDataForPeriod(WEEKLY_PERIOD),
        fetchDataForPeriod(MONTHLY_PERIOD),
      ]);

      // Check if any data fetching resulted in an error
      if (
        dailyData instanceof Error ||
        weeklyData instanceof Error ||
        monthlyData instanceof Error
      ) {
        console.error("Error occurred while fetching data");
      } else {
        // Update the state with the fetched data
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

  // Fetches all periods with stock name
  const fetchAllPeriodsWithStock = async (stock: string) => {
    setStockTitle(stock);
    try {
      const [dailyData, weeklyData, monthlyData] = await Promise.all([
        fetchDataForPeriod(DAILY_PERIOD, stock),
        fetchDataForPeriod(WEEKLY_PERIOD, stock),
        fetchDataForPeriod(MONTHLY_PERIOD, stock),
      ]);

      // Check if any data fetching resulted in an error
      if (
        dailyData instanceof Error ||
        weeklyData instanceof Error ||
        monthlyData instanceof Error
      ) {
        console.error("Error occurred while fetching data");
      } else {
        // Update the state with the fetched data
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

  const fetchDataForPeriod = async (period: string, stock?: string) => {
    try {
      setCardClass(CARD_BLUR);

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
    } finally {
      setCardClass(CARD);
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
