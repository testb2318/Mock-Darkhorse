import { Wallet } from "lucide-react";

const Wallets = ({ wallets }) => {
  if (!wallets || wallets.length === 0) {
    return (
      <div className="p-4 bg-white shadow rounded-lg text-gray-500 text-sm">
        No wallets found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {wallets.map((wallet, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between p-4 bg-white rounded-xl shadow"
        >
          <div className="flex items-center space-x-3">
            <Wallet className="h-6 w-6 text-blue-500" />
            <div>
              <p className="font-semibold text-gray-700">{wallet.type}</p>
              <p className="text-sm text-gray-500">{wallet.currency}</p>
            </div>
          </div>
          <p className="font-bold text-gray-800">
            {wallet.balance} {wallet.currency}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Wallets;
