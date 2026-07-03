import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { API_URL } from "../config";
import type { Item } from "../types";

export default function FilteredList() {
  const { status } = useParams<{ status: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isLoading, isError } = useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/items`);
      if (!response.ok) throw new Error(`Error fetching filtered list.`);
      return response.json();
    },
  });

  const query = searchParams.get("q") ?? "";

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong loading items.</p>;
  if (!data) return null;
  const filteredData = data.filter(
    (item) =>
      item.status === status &&
      item.title.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <h1>Filtered list is status: {status}</h1>
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
