import React, { useEffect } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { StockData } from "../Interfaces/StockData";

interface HighStockChartProps {
  data: StockData[];
  chartId: string;
  stock: string;
  period: string;
}
const HighStockChart: React.FC<HighStockChartProps> = ({
  data,
  chartId,
  stock,
  period,
}) => {
  useEffect(() => {
    const options = createChartOptions(data, stock, period);
    Highcharts.stockChart(chartId, options);
  }, [data, chartId]);

  return (
    <div id={chartId} className="chart-container">
      <HighchartsReact highcharts={Highcharts} constructorType={"stockChart"} />
    </div>
  );
};

export default HighStockChart;

function createChartOptions(data: StockData[], stock: string, period: string) {
  const formattedData = formatDataForHighstock(data);
  return getChartOptions(formattedData, stock, period);
}

/* Set Chart Options */
function getChartOptions(
  formattedData: number[][],
  stock: string,
  period: string
): Highcharts.Options {
  return {
    title: {
      text: `${stock} Price History (${period})`,
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
  };
}

/* Format data for High Stock */
function formatDataForHighstock(data: StockData[]) {
  return data.map((item: StockData) => [
    new Date(item.date).getTime(),
    item.open,
    item.high,
    item.low,
    item.close,
  ]);
}
