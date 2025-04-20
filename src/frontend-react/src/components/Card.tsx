export default function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white shadow-md rounded-lg p-4">{children}</div>;
}
