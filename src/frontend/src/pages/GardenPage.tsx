import { Link } from "react-router";

export default function GardenPage() {
  return (
    <div>
      <p>Here comes the garden overview</p>
      <Link
        className="bg-emerald-400 hover:bg-emerald-500 rounded-md px-4 py-2 inline-block"
        to="/beet/123"
      >
        to Test Beet
      </Link>
    </div>
  );
}
