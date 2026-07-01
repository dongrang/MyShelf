import { useParams } from "react-router-dom";
export default function FilteredList() {
  const { status } = useParams<{ status: string }>();
  return (
    <div>
      <h1>Filtered List</h1>
      <p>Filtered list is status: {status}</p>
    </div>
  );
}
