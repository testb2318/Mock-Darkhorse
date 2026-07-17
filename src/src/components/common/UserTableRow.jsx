import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillDelete } from 'react-icons/ai';
import { GrView } from 'react-icons/gr';
import { RiLoginCircleFill } from 'react-icons/ri';
import StatusIndicator from './StatusIndecator';
import WalletActions from './WalletActions';

const UserTableRow = ({ 
  user, 
  index, 
  currentPage, 
  itemsPerPage, 
  onHandleCash, 
  onHandleSession, 
  onHandleDelete,
  variant = 'table'
}) => {
  const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(user?.refferal_code || '');
    alert('Copied to clipboard!');
  };

  // ─── Mobile Card Layout ───
  if (variant === 'card') {
    return (
      <div className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/[0.07] transition-all duration-300">
        {/* Header: Serial + Email + Referral */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-slate-500 font-mono">#{serialNumber}</span>
              <button
                onClick={handleCopyReferralCode}
                className="text-[#f0d060] bg-[#F5C518]/20 hover:bg-[#F5C518]/30 px-2 py-[1px] rounded-full text-[10px] transition-all duration-300 shrink-0"
              >
                {user?.refferal_code}
              </button>
            </div>
            <p className="text-sm font-medium text-white truncate">{user?.email}</p>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => onHandleSession(user)}
              className="text-emerald-400 hover:text-emerald-300 transition-colors p-1.5 rounded-lg hover:bg-emerald-500/10"
            >
              <RiLoginCircleFill className="w-4 h-4" />
            </button>
            <Link 
              to={`/admin/check/profile/${user?.id}`}
              className="text-[#F5C518] hover:text-[#f0d060] transition-colors p-1.5 rounded-lg hover:bg-[#F5C518]/10"
            >
              <GrView className="w-4 h-4" />
            </Link>
            {/* <button onClick={() => onHandleDelete(user?.id)}>
              <AiFillDelete className="text-red-600" />
            </button> */}
          </div>
        </div>

        {/* Wallet Row */}
        <div className="mb-3 p-2.5 rounded-lg bg-white/5 border border-white/5">
          <WalletActions
            balance={user?.business}
            onCredit={() => onHandleCash('credit', user)}
            onDebit={() => onHandleCash('debit', user)}
          />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Package</span>
            <p className="text-sm font-semibold text-amber-400">{user?.active_plan}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Direct Income</span>
            <p className="text-sm font-semibold text-emerald-400">{user?.direct_income}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Account</span>
            <StatusIndicator status={user?.status} activeText="Unblocked" inactiveText="Blocked" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500">ROI</span>
            <p className="text-sm font-semibold text-cyan-400">{user?.roi_income}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Package Status</span>
            <StatusIndicator status={user?.is_active} activeText="Activated" inactiveText="Not Activated" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Created</span>
            <p className="text-xs text-slate-400">{new Date(user?.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Desktop Table Row Layout ───
  return (
    <tr className="hover:bg-white/5 transition-all duration-300 group">
      <td className="px-4 py-3 text-center whitespace-nowrap">
        <span className="text-sm text-slate-400 font-mono">#{serialNumber}</span>
      </td>
      
      <td className="px-4 py-3 text-left">
        <div className="justify-center items-center gap-x-4">
          <div className="w-full text-sm font-medium text-white leading-6 truncate">
            {user?.email}
            <button
              onClick={handleCopyReferralCode}
              className="focus:outline-none text-[#f0d060] bg-[#F5C518]/20 hover:bg-[#F5C518]/30 ml-2 px-3 py-[2px] rounded-full text-[10px] transition-all duration-300"
            >
              {user?.refferal_code}
            </button>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <WalletActions
          balance={user?.business}
          onCredit={() => onHandleCash('credit', user)}
          onDebit={() => onHandleCash('debit', user)}
        />
      </td>

      <td className="px-4 py-3 text-center whitespace-nowrap">
        <span className="text-sm font-semibold text-amber-400">{user?.active_plan}</span>
      </td>

      <td className="px-4 py-3 text-center whitespace-nowrap">
        <div className="flex justify-center">
          <StatusIndicator
            status={user?.status}
            activeText="Unblocked"
            inactiveText="Blocked"
          />
        </div>
      </td>

      <td className="px-4 py-3 text-center whitespace-nowrap">
        <div className="flex justify-center">
          <StatusIndicator
            status={user?.is_active}
            activeText="Activated"
            inactiveText="Not Activated"
          />
        </div>
      </td>

      <td className="px-4 py-3 text-center whitespace-nowrap">
        <span className="text-sm font-semibold text-emerald-400">{user?.direct_income}</span>
      </td>

      <td className="px-4 py-3 text-center whitespace-nowrap">
        <span className="text-sm font-semibold text-cyan-400">{user?.roi_income}</span>
      </td>

      <td className="px-4 py-3 text-center whitespace-nowrap">
        <span className="text-xs text-slate-400">
          {new Date(user?.created_at).toLocaleDateString()}
        </span>
      </td>

      <td className="px-4 py-3 text-center whitespace-nowrap">
        <div className="flex items-center justify-center gap-3">
          <button 
            onClick={() => onHandleSession(user)}
            className="text-emerald-400 hover:text-emerald-300 transition-colors p-1 rounded-lg hover:bg-emerald-500/10"
          >
            <RiLoginCircleFill className="w-4 h-4" />
          </button>
          <Link 
            to={`/admin/check/profile/${user?.id}`}
            className="text-[#F5C518] hover:text-[#f0d060] transition-colors p-1 rounded-lg hover:bg-[#F5C518]/10"
          >
            <GrView className="w-4 h-4" />
          </Link>
          {/* <button onClick={() => onHandleDelete(user?.id)}>
            <AiFillDelete className="text-red-600" />
          </button> */}
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;
