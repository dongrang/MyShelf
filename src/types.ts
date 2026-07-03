export type Item = {
    id: number,
    title: string,
    creator: string,
    year: number,
    genre: string,
    status: "want" | "active" | "done" | "dropped"
    rating: number | null;
    note: string | null;
}
    