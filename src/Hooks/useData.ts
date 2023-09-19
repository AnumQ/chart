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
    fetchAllPeriods();
  }, [activeButton]);

  const fetchAllPeriods = () => {
    [DAILY_PERIOD, WEEKLY_PERIOD, MONTHLY_PERIOD].forEach((period) => {
      fetchDataForPeriod(period);
    });
  };

  const fetchAllPeriodsWithStock = (stock: string) => {
    setStockTitle(stock);
    [DAILY_PERIOD, WEEKLY_PERIOD, MONTHLY_PERIOD].forEach((period) => {
      fetchDataForPeriod(period, stock);
    });
  };

  const fetchDataForPeriod = async (period: string, stock?: string) => {
    try {
      setCardClass(CARD_BLUR);

      const apiToken = fetchApiToken(activeButton);
      const response = await axios.get(
        buildURL(apiToken, START_DATE, END_DATE, stock || stockTitle, period)
      );

      if (response.status === 200) {
        setData((prevState) => ({
          ...prevState,
          [period]: response.data,
        }));
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
