import { FaArrowAltCircleUp, FaArrowCircleDown } from 'react-icons/fa';
import ActionButton from './ActionButton';

const WalletActions = ({ balance, onCredit, onDebit }) => {
  return (
    <div className="flex justify-between items-center gap-2">
      <ActionButton
        onClick={onCredit}
        icon={FaArrowAltCircleUp}
        className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/20"
      />
      <div className="text-white font-semibold text-sm">${balance}</div>
      <ActionButton
        onClick={onDebit}
        icon={FaArrowCircleDown}
        className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/20"
      />
    </div>
  );
};

export default WalletActions;