export default function SignalsPanel() {
  return (
    <div>
      <h2 className="text-xl mb-4">📊 Auto Trade Setups</h2>
      <div className="space-y-3">
        <div className="p-3 bg-[#1a1a1a] rounded border border-gray-700">
          <div className="text-white font-medium">BTCUSDT — Liquidity Sweep</div>
          <div className="text-xs text-gray-400">15m chart · 3 mins ago</div>
        </div>
        <div className="p-3 bg-[#1a1a1a] rounded border border-gray-700">
          <div className="text-white font-medium">ETH — FVG Breakout</div>
          <div className="text-xs text-gray-400">1h chart · 10 mins ago</div>
        </div>
      </div>
    </div>
  );
}