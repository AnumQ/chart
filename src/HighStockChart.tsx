import React, { useEffect } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { StockData } from "./Models/StockData";

interface HighStockChartProps {
  data: StockData[];
}
// Using the pre-built stockChart component from Highchart
const HighStockChart: React.FC<HighStockChartProps> = ({ data }) => {
  useEffect(() => {
    createStockChartInContainer(data);
  }, [data]);

  return (
    <div id="stock-chart-container" style={{ height: "500px", width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} constructorType={"stockChart"} />
    </div>
  );
};

export default HighStockChart;

function createStockChartInContainer(data: StockData[]) {
  const formattedData = formatDataForHighstock(data);
  const options: Highcharts.Options = {
    title: {
      text: "Stock Price History",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "Price",
      },
    },
    series: [
      {
        name: "Stock Price",
        data: formattedData,
        type: "candlestick",
      },
    ],
    chart: { backgroundColor: "#f4f4f4" },
  };
  Highcharts.stockChart("stock-chart-container", options);
}

function formatDataForHighstock(data: StockData[]) {
  return data.map((item: StockData) => [
    new Date(item.date).getTime(),
    item.open,
    item.high,
    item.low,
    item.close,
  ]);
}
