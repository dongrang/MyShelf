import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { API_URL } from "../config";
import type { Item } from "../types";
import { useUiStore } from "../store/useUiStore";

export default function FilteredList() {
  const { status } = useParams<{ status: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const density = useUiStore((s) => s.density);

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

  const gridGap = density === "compact" ? "gap-2" : "gap-5";
  const cardPad = density === "compact" ? "p-2" : "p-4";

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Status: {status}
      </h1>

      <input
        type="text"
        placeholder="Search by title..."
        value={query}
        onChange={(e) => setSearchParams({ q: e.target.value })}
        className="w-full mb-4 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
      />

      {filteredData.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No items match this filter.
        </p>
      ) : (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${gridGap}`}
        >
          {filteredData.map((item) => (
            <Link
              key={item.id}
              to={`/items/${item.id}`}
              className={`block rounded-lg border ${cardPad} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition`}
            >
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.creator} — {item.year}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {item.genre} · {item.status}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
