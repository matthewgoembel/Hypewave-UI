export default function NewsPanel() {
  return (
    <div>
      <h2 className="text-xl mb-4">📰 CT Alpha Feed</h2>
      <div className="space-y-4">
        <div className="border-b border-gray-800 pb-2">
          <div className="text-white">@WatcherGuru: BlackRock Bitcoin ETF inflows hit $500M 🚨</div>
          <div className="text-xs text-gray-500">2 minutes ago</div>
        </div>
        <div className="border-b border-gray-800 pb-2">
          <div className="text-white">@nypost: FED eyes rate hold through Q3 🔍</div>
          <div className="text-xs text-gray-500">5 minutes ago</div>
        </div>
      </div>
    </div>
  );
}
