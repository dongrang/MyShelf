import { useParams } from "react-router-dom";
export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <h1>Item Details</h1>
      <p>Item detail is for id: {id}</p>
    </div>
  );
}
