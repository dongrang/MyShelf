import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { API_URL } from "../config";
import type { Item } from "../types";

export default function Catalog() {
  const [SearchParams, setSearchParams] = useSearchParams();
  const { data, isLoading, isError } = useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/items`);
      if (!response.ok) throw new Error(`Failed to fetch items.`);
      return response.json();
    },
  });

  const query = SearchParams.get("q") ?? "";

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong loading items.</p>;
  if (!data) return null;

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <h1>Catalog</h1>
      <input
        type="text"
        placeholder="Search by title..."
        value={query}
        onChange={(e) => setSearchParams({ q: e.target.value })}
      />

      <div>
        {filteredData.map((item) => (
          <Link key={item.id} to={`/items/${item.id}`}>
            <div>
              <h2>{item.title}</h2>
              <p>
                {item.creator} — {item.year}
              </p>
              <p>
                {item.genre} · {item.status}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
