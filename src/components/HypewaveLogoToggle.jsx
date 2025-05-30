export default function HypewaveLogoToggle({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="fixed top-1/2 left-0 transform -translate-y-1/2 cursor-pointer"
    >
      <img
        src="/transparent.gif"
        alt="Hypewave Logo"
        className="w-12 h-12 hover:animate-pulse"
      />
    </div>
  );
}
