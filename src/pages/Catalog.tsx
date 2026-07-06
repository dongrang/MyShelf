import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { API_URL } from "../config";
import type { Item } from "../types";
import { useUiStore } from "../store/useUiStore";
import { useState } from "react";
export default function Catalog() {
  const [SearchParams, setSearchParams] = useSearchParams();
  // setting ui
  const density = useUiStore((s) => s.density);
  const gridGap = density === "compact" ? "gap-2" : "gap-5";
  const cardPad = density === "compact" ? "p-2" : "p-4";
  // states for showing the form to add a game to the catalog
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    creator: "",
    year: 2020,
    genre: "",
    status: "want" as Item["status"],
    rating: null as number | null,
    note: null as string | null,
  });

  // stuff for adding items
  const queryClient = useQueryClient();
  const addMutation = useMutation({
    // omit: the new item has every item field except id
    mutationFn: async (newItem: Omit<Item, "id">) => {
      const response = await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) throw new Error(`Failed to add item.`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      setShowForm(false);
      setForm({
        title: "",
        creator: "",
        year: 2020,
        genre: "",
        status: "want",
        rating: null,
        note: null,
      });
    },
  });
  const handleAdd = () => {
    addMutation.mutate(form);
  };

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
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Catalog
        </h1>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded border bg-blue-500 text-white border-blue-600 hover:bg-blue-600 transition"
        >
          {showForm ? "Cancel" : "Add Game"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 flex flex-col gap-3">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white"
          />
          <input
            type="text"
            placeholder="Creator"
            value={form.creator}
            onChange={(e) => setForm({ ...form, creator: e.target.value })}
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white"
          />
          <input
            type="number"
            placeholder="Year"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white"
          />
          <input
            type="text"
            placeholder="Genre"
            value={form.genre}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white"
          />
          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as Item["status"] })
            }
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white"
          >
            <option value="want">want</option>
            <option value="active">active</option>
            <option value="done">done</option>
            <option value="dropped">dropped</option>
          </select>
          <select
            value={form.rating ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                rating: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white"
          >
            <option value="">No rating</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <textarea
            placeholder="Note (optional)"
            value={form.note ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                note: e.target.value === "" ? null : e.target.value,
              })
            }
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white"
            rows={3}
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={
              form.title === "" || form.creator === "" || form.genre === ""
            }
            className="px-4 py-2 rounded border bg-green-600 text-white border-green-700 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Save Game
          </button>
        </div>
      )}

      <input
        type="text"
        placeholder="Search by title..."
        value={query}
        onChange={(e) => setSearchParams({ q: e.target.value })}
        className="w-full mb-4 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
      />

      {filteredData.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No items match your search.
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
