// src/components/FlameLoader.jsx
export default function FlameLoader() {
  return (
    <div className="flex justify-start items-center h-12">
      <img
        src="/transparent.gif"
        alt="Loading flame"
        className="w-8 h-8 animate-pulse"
      />
    </div>
  );
}
