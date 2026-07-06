import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../config";
import type { Item } from "../types";
import { useUiStore } from "../store/useUiStore";

async function patchItem(id: string, updates: Partial<Item>) {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error(`Error patching item.`);
  return response.json();
}

export default function ItemDetail() {
  const density = useUiStore((s) => s.density);
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useQuery<Item | null>({
    queryKey: ["items", id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/items/${id}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`Error fetching item details.`);
      return response.json();
    },
  });
  const queryClient = useQueryClient();

  // shared success handler for all three mutations
  const handleSuccess = (updatedItem: Item) => {
    queryClient.setQueryData(["items", id], updatedItem);
    queryClient.invalidateQueries({ queryKey: ["items"], exact: true });
  };

  const statusMutation = useMutation({
    mutationFn: (newStatus: Item["status"]) =>
      patchItem(id!, { status: newStatus }),
    onSuccess: handleSuccess,
  });

  const noteMutation = useMutation({
    mutationFn: (newNote: string) => patchItem(id!, { note: newNote }),
    onSuccess: handleSuccess,
  });

  const ratingMutation = useMutation({
    mutationFn: (newRating: number) => patchItem(id!, { rating: newRating }),
    onSuccess: handleSuccess,
  });

  const [noteText, setNoteText] = useState("");
  useEffect(() => {
    if (data) setNoteText(data.note ?? "");
  }, [data?.id]);

  const btnClass = (selected: boolean) =>
    `px-3 py-1 rounded border transition ${
      selected
        ? "bg-blue-500 text-white border-blue-600"
        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`;

  const gap = density === "compact" ? "gap-2" : "gap-4";

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong loading items.</p>;
  if (!data) return <p>Not found.</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
        {data.title}
      </h1>

      <div className={`flex flex-col ${gap}`}>
        <p className="text-gray-600 dark:text-gray-400">
          {data.creator}, {data.year}
        </p>
        <p className="text-gray-600 dark:text-gray-400">{data.genre}</p>

        {/* status */}
        <div>
          <p className="mb-1 font-medium text-gray-900 dark:text-white">
            Status: {data.status}
          </p>
          <div className="flex flex-wrap gap-2">
            {(["want", "active", "done", "dropped"] as const).map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => statusMutation.mutate(s)}
                className={btnClass(data.status === s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* rating */}
        <div>
          <p className="mb-1 font-medium text-gray-900 dark:text-white">
            Rating: {data.rating ? data.rating : "No rating yet."}
          </p>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => ratingMutation.mutate(s)}
                className={btnClass(data.rating === s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* note */}
        <div>
          <p className="mb-1 font-medium text-gray-900 dark:text-white">Note</p>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
            rows={4}
          />
          <button
            type="button"
            onClick={() => noteMutation.mutate(noteText)}
            disabled={noteText === (data.note ?? "")}
            className="mt-2 px-4 py-1 rounded border bg-blue-500 text-white border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
