import axios from "axios";
import { useState, useEffect } from "react";

function useDataFetching(apiEndpoint: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorType>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(apiEndpoint);

        if (response.status === 200) {
          const result = response.data;
          setData(result);
        } else {
          throw new Error("Network response was not 200");
        }
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError("Unknown error occured");
        }
        setLoading(false);
      }
    }

    fetchData();
  }, [apiEndpoint]);

  return { data, loading, error };
}

export default useDataFetching;

type ErrorType = Error | null | string;
