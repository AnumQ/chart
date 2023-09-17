import React, { useEffect, useState } from "react";
import "./App.css";
import { StockDataTable } from "./UI/ListStockData";
import axios from "axios";
import { StockData } from "./Models/StockData";

function App() {
  const [data, setData] = useState<StockData[] | null>(null);

  async function fetchData() {
    try {
      const response = await axios.get(
        "https://eodhd.com/api/eod/MCD.US?api_token=demo&period=d&fmt=json"
      );

      if (response.status !== 200) {
        throw new Error("Network response was not 200");
      }
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      {data ? <StockDataTable data={data} /> : <p>Fetching data ...</p>}
    </div>
  );
}

export default App;
