import { Link } from "react-router";

export default function GardenPage() {
  return (
    <div>
      <p>Here comes the garden overview</p>
      <Link
        className="inline-block rounded-md bg-emerald-400 px-4 py-2 hover:bg-emerald-500"
        to="/bed/a3c51a2a-0b07-442f-af31-3b7d88dda10d"
      >
        to Test Bed
      </Link>
    </div>
  );
}
