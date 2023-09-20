import { useEffect, useState } from "react";
import HighStockChart from "./Components/HighStockChart";
import Navigation from "./Components/Navigation";
import {
  DAILY_PERIOD,
  WEEKLY_PERIOD,
  MONTHLY_PERIOD,
} from "./Helpers/Constants";
import { StockData } from "./Interfaces/StockData";
import { useData } from "./Hooks/useData";

function App() {
  const {
    data,
    cardClass,
    stockTitle,
    activeButton,
    setActiveButton,
    fetchAllPeriodsWithStock,
  } = useData();

  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    if (search.length > 0) {
      fetchAllPeriodsWithStock(search);
    }
  }, [search]);

  // Renders stock chart for a specific period
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
        {[DAILY_PERIOD, WEEKLY_PERIOD, MONTHLY_PERIOD].map(renderChart)}
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

export default App;

interface PeriodLabel {
  [key: string]: string;
}
const periodLabels = {
  [MONTHLY_PERIOD]: "Monthly",
  [DAILY_PERIOD]: "Daily",
  [WEEKLY_PERIOD]: "Weekly",
} as PeriodLabel;
