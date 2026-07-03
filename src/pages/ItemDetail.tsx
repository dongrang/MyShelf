import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { API_URL } from "../config";
import type { Item } from "../types";
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

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong loading items.</p>;
  if (!data) return <p>Not found.</p>;

  return (
    <div>
      <h1>{data.title}</h1>
      <div className="flex gap-2">
        <p>
          {data.creator}, {data.year}
        </p>
        <p>{data.genre}</p>
        <p>Status:{data.status}</p>
        <p>Rating: {data.rating ? `, ${data.rating}` : "No rating yet."}</p>
        <p>Note:{data.note ? data.note : "No notes yet."}</p>
      </div>
    </div>
  );
}
