import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../config";
import type { Item } from "../types";

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

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong loading items.</p>;
  if (!data) return <p>Not found.</p>;

  return (
    <div className="p-2">
      <h1>{data.title}</h1>
      <div className="flex flex-col gap-2">
        <p>
          {data.creator}, {data.year}
        </p>
        <p>{data.genre}</p>

        {/* status */}
        <p>Status: {data.status}</p>
        <div>
          {(["want", "active", "done", "dropped"] as const).map((s) => (
            <button
              type="button"
              className="mx-2"
              key={s}
              onClick={() => statusMutation.mutate(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {/* rating */}
        <div>
          <p>Rating: {data.rating ? `${data.rating}` : "No rating yet."}</p>
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              type="button"
              className="mx-2"
              key={s}
              onClick={() => ratingMutation.mutate(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {/* note */}
        <div>
          Note:
          <div>
            <textarea
              className="bg-gray-200"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => noteMutation.mutate(noteText)}
            disabled={noteText === (data.note ?? "")}
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
