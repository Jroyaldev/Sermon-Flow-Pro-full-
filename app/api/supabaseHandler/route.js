import { useEffect, useState } from 'react';

export default function MyComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/supabaseHandler');
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };
    
    fetchData();
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div>
      {data.map((item) => (
        <p key={item.id}>{item.name}</p> // Adjust fields based on your data
      ))}
    </div>
  );
}
