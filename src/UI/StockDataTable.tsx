import { StockData, StockDataProps } from "../Models/StockData";
const renderStockData = (data: StockData[]) => {
  if (data.length === 0) {
    return <p>No data available</p>;
  }

  console.log(data);

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Open</th>
          <th>High</th>
          <th>Low</th>
          <th>Close</th>
          <th>Adjusted Close</th>
          <th>Volume</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry, index) => (
          <tr key={index}>
            <td>{entry.date}</td>
            <td>{entry.open}</td>
            <td>{entry.high}</td>
            <td>{entry.low}</td>
            <td>{entry.close}</td>
            <td>{entry.adjusted_close}</td>
            <td>{entry.volume}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const StockDataTable: React.FC<StockDataProps> = ({
  data,
}: {
  data: StockData[];
}) => {
  if (!data) return <>Loading ...</>;
  return <div>{renderStockData(data)}</div>;
};
