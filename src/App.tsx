import { useEffect, useState } from "react";
import HighStockChart from "./Components/HighStockChart";
import Navigation from "./Components/Navigation";
import {
  DAILY_PERIOD,
  WEEKLY_PERIOD,
  MONTHLY_PERIOD,
  DEFAULT_STOCK_TITLE,
  NAV_ITEM_DEMO,
  DEMO_API_TOKEN,
  LIVE_API_TOKEN,
} from "./Helpers/Constants";
import { StockData } from "./Interfaces/StockData";
import { useData } from "./Hooks/useData";

function App() {
  const { data, cardClass, fetchData, fetchAllPeriodsWithStock } = useData();

  const [search, setSearch] = useState<string | null>(null);
  const [isLive, toggleLive] = useState(false);
  const [activeButton, setActiveButton] = useState<string>(NAV_ITEM_DEMO);

  useEffect(() => {
    if (search && search.length > 0) {
      // Fetch stock data for all periods
      fetchAllPeriodsWithStock(search); // TODO: split
    }
  }, [search]); // TODO: fix it

  useEffect(() => {
    const apiToken = isLive ? LIVE_API_TOKEN : DEMO_API_TOKEN;
    fetchData(apiToken);
  }, [isLive]);

  // Renders stock chart for a specific period
  const renderChart = (period: string, index: number) => {
    return (
      <div className={cardClass} key={index}>
        <HighStockChart
          data={data[period] as StockData[]}
          chartId={`stock-chart-${index + 1}`}
          stock={search ?? DEFAULT_STOCK_TITLE}
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
          isLive={isLive}
          toggleLive={toggleLive}
        />
      </header>
      <div className="card-container">
        {/* Render charts for all periods */}
        {[DAILY_PERIOD, WEEKLY_PERIOD, MONTHLY_PERIOD].map(renderChart)}
      </div>
      <footer>
        <i className="fa-sharp fa-solid fa-copyright logo"></i>
        <p>Copyright 2023 </p>
      </footer>
    </div>
  );
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
