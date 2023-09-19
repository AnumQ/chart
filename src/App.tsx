import React, { useEffect, useState } from "react";
import axios from "axios";
import { StockDataTable } from "./UI/StockDataTable";
import HighStockChart from "./Components/HighStockChart";
import { buildURL } from "./Helpers/URLbuilder";
import Navigation from "./Components/Navigation";
import {
  DEFAULT_STOCK_TITLE,
  NAV_ITEM_DEMO,
  CARD_BLUR,
  START_DATE,
  END_DATE,
  CARD,
  DEMO_API_TOKEN,
  NAV_ITEM_LIVE,
  LIVE_API_TOKEN,
  DAILY_PERIOD,
  WEEKLY_PERIOD,
  MONTHLY_PERIOD,
} from "./Helpers/Constants";
import { DataState, StockData } from "./Interfaces/StockData";

function App() {
  const [data, setData] = useState<DataState>(initialState);
  const [stockTitle, setStockTitle] = useState(DEFAULT_STOCK_TITLE);
  const [search, setSearch] = useState<string>("");
  const [activeButton, setActiveButton] = useState<string>(NAV_ITEM_DEMO);
  const [cardClass, setCardClass] = useState(CARD);

  useEffect(() => {
    fetchDataForPeriod(DAILY_PERIOD);
    fetchDataForPeriod(WEEKLY_PERIOD);
    fetchDataForPeriod(MONTHLY_PERIOD);
  }, [activeButton]);

  useEffect(() => {
    if (search.length > 0) {
      fetchAllPeriods(search);
      setStockTitle(search);
    }
  }, [search]);

  const fetchAllPeriods = (stock: string) => {
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

  const renderChart = (period: string, index: number) => {
    return (
      <div className={cardClass} key={index}>
        <HighStockChart
          data={data[period] as StockData[]}
          chartId={`stock-chart-${index + 1}`}
          stock={stockTitle}
          period={periodLabels[period] || ""}
        />
      </div>
    );
  };

  return (
    <div className="container">
      <header>
        <Navigation
          activeButton={activeButton}
          setActiveButton={setActiveButton}
          setSearch={setSearch}
        />
      </header>
      <div className="card-container">
        {/* Render charts for all periods */}
        {[DAILY_PERIOD, WEEKLY_PERIOD, MONTHLY_PERIOD, MONTHLY_PERIOD].map(
          renderChart
        )}
        {/* Display data in a table */}
        {/* <div className="card table">
          <StockDataTable data={data.d.slice(1, 10)} />
        </div> */}
      </div>
      <footer>
        <i className="fa-sharp fa-solid fa-copyright logo"></i>
        <p>Copyright 2023 </p>
      </footer>
    </div>
  );
}

function fetchApiToken(activeButton: string) {
  const apiTokens: Record<string, string> = {
    [NAV_ITEM_DEMO]: DEMO_API_TOKEN,
    [NAV_ITEM_LIVE]: LIVE_API_TOKEN,
  };

  return apiTokens[activeButton] || DEMO_API_TOKEN;
}

export default App;

interface PeriodLabel {
  [key: string]: string;
}
const periodLabels = {
  [MONTHLY_PERIOD]: "Monthly",
  [DAILY_PERIOD]: "Daily",
  [WEEKLY_PERIOD]: "Weekly",
} as PeriodLabel;

const initialState = {
  d: [],
  w: [],
  m: [],
};
