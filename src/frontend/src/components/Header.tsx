import { Link } from "react-router";

export default function Header() {
  return (
    <header className="bg-emerald-600 text-white py-2 sticky top-0 z-10 shadow-md">
      <div className="flex flex-row justify-between max-w-screen-desktop m-auto px-4">
        <Link to="/" className="font-black text-xl">
          <span>S</span>
          <span className="phone:inline hidden">mart</span>
          <span className="phone:inline hidden">-</span>
          <span>G</span>
          <span className="phone:inline hidden">arden</span>
        </Link>
        <div className="flex flex-row items-center gap-8">
          <Link to="/bed/123">Test Bed</Link>
          <span>Menu</span>
        </div>
      </div>
    </header>
  );
}
