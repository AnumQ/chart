import React, { useEffect, useState } from "react";
import { StockDataTable } from "./UI/StockDataTable";
import "./App.css";
import axios from "axios";
import { StockData } from "./Models/StockData";
import HighStockChart from "./HighStockChart";
import { buildURL } from "./URLbuilder";


function App() {
  const [data, setData] = useState<StockData[]>([]);

  useEffect(() => {
    fetchData(setData);
  }, []);

  return (
    <div className="App">
      <HighStockChart data={data} />
      <StockDataTable data={data} />
    </div>
  );
}

export default App;

const fetchData = async (
  setData: React.Dispatch<React.SetStateAction<StockData[]>>
) => {
  try {
    const response = await axios.get(buildURL("2010-01-01", "2023-09-15"));

    if (response.status === 200) {
      setData(response.data);
    } else {
      throw new Error("Network response was not 200");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};



// interface ChartOptionsProps {
//   caption?: CaptionOptions;
//   xAxis: {
//     categories: string[];
//   };
//   chart?: ChartOptions;
//   series: {
//     data: number[];
//   }[];
//   plotOptions: {
//     series: {
//       point: {
//         events: {
//           mouseOver(e: { target: { category: string } }): void;
//         };
//       };
//     };
//   };
// }