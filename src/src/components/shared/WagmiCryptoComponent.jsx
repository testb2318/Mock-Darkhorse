import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import { addDeposite } from "../../redux/depositeSlice";
import { parseUnits, formatUnits } from "viem";
import {
  Wallet,
  Send,
  Download,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Copy,
  ExternalLink,
  X,
  CreditCard,
} from "lucide-react";
import { updateWithdrawal } from "../../redux/withdrawalSlice";

// Generates a wavy-rectangle path (0-1 objectBoundingBox coordinates) used to
// clip the card containers into a scalloped / wave-form border shape.
function buildWavyRectPath({ wavesX = 12, wavesY = 7, amp = 0.014 } = {}) {
  const segX = 1 / wavesX;
  const segY = 1 / wavesY;
  let d = "M0,0 ";
  for (let i = 0; i < wavesX; i++) {
    const x1 = (i + 1) * segX;
    const midX = x1 - segX / 2;
    const y = i % 2 === 0 ? -amp : amp;
    d += `Q${midX},${y} ${x1},0 `;
  }
  for (let i = 0; i < wavesY; i++) {
    const y1 = (i + 1) * segY;
    const midY = y1 - segY / 2;
    const x = i % 2 === 0 ? 1 + amp : 1 - amp;
    d += `Q${x},${midY} 1,${y1} `;
  }
  for (let i = 0; i < wavesX; i++) {
    const x1 = 1 - (i + 1) * segX;
    const midX = x1 + segX / 2;
    const y = i % 2 === 0 ? 1 + amp : 1 - amp;
    d += `Q${midX},${y} ${x1},1 `;
  }
  for (let i = 0; i < wavesY; i++) {
    const y1 = 1 - (i + 1) * segY;
    const midY = y1 + segY / 2;
    const x = i % 2 === 0 ? -amp : amp;
    d += `Q${x},${midY} 0,${y1} `;
  }
  d += "Z";
  return d;
}

const WAVE_CLIP_D = buildWavyRectPath({ wavesX: 12, wavesY: 7, amp: 0.014 });

// Rendered once; both card containers reference this shared clip-path by id.
const WaveClipDefs = () => (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
    <defs>
      <clipPath id="waveCardClip" clipPathUnits="objectBoundingBox">
        <path d={WAVE_CLIP_D} />
      </clipPath>
    </defs>
  </svg>
);

const USDT_ABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
];

const USDT_CONTRACTS = {
  1: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  56: "0x55d398326f99059fF775485246999027B3197955",
  137: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
};

const TransactionForm = ({
  address,
  balance,
  toAddress,
  usdtAddress,
  amount,
  setAmount,
  mode,
  isWritePending,
  isConfirming,
  error,
  success,
  hash,
  copyToClipboard,
  handleTransaction,
  getExplorerUrl,
}) => {
  return (
    <div className="space-y-5 sm:space-y-6 w-full">
      {/* Pay from Wallet tabs */}
      <div className="flex gap-2">
        <button
          className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-[13px] font-medium text-yellow-50 shadow-[0_0_10px_rgba(212,175,55,0.35)] border border-yellow-500/50 w-full justify-center sm:w-auto flex-shrink-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(212,175,55,0.2) 0%, rgba(180,83,9,0.2) 100%)",
            backdropFilter: "blur(4px)",
          }}
        >
          <CreditCard size={14} className="text-yellow-400 flex-shrink-0" />
          <span className="truncate">Pay from Wallet</span>
        </button>
      </div>

      {/* Connected Wallet Info */}
      <div className="p-3 sm:p-4 rounded-lg bg-black/40 border border-yellow-900/50 relative overflow-hidden w-full">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
        <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-yellow-500/70 truncate">
            Connected Wallet
          </span>
          <button
            onClick={() => copyToClipboard(address)}
            className="transition-colors hover:text-yellow-300 text-yellow-500 p-1 flex-shrink-0"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="text-[11px] sm:text-[12px] font-mono break-all text-yellow-100 pr-1 leading-relaxed">{address}</p>
        {balance && (
          <p className="text-[11px] sm:text-[12px] mt-2 font-medium text-[#c98a3f] truncate">
            Balance: {parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)}{" "}
            {balance.symbol}
          </p>
        )}
      </div>

      {/* Recipient Address */}
      {toAddress && (
        <div className="p-3 sm:p-4 rounded-lg bg-black/40 border border-yellow-900/50 relative overflow-hidden w-full">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#b45309]/60 to-transparent"></div>
          <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-yellow-500/70 truncate">
              Recipient Address (To)
            </span>
            <button
              onClick={() => copyToClipboard(toAddress)}
              className="transition-colors hover:text-yellow-300 text-yellow-500 p-1 flex-shrink-0"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-[11px] sm:text-[12px] font-mono break-all text-yellow-100 pr-1 leading-relaxed">{toAddress}</p>
        </div>
      )}

      {/* Network Warning */}
      {!usdtAddress && (
        <div className="rounded-lg p-3 sm:p-4 bg-red-950/40 border border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span className="text-[11px] sm:text-xs font-medium tracking-wide leading-normal">
              USDT not supported on this network. Please switch to Ethereum, BSC, or Polygon.
            </span>
          </div>
        </div>
      )}

      {/* Currency */}
      <div className="w-full">
        <label className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-1.5 sm:mb-2 text-yellow-500/70">
          Currency
        </label>
        <div className="flex items-center justify-between w-full px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-lg text-xs sm:text-[13px] font-medium bg-black/50 border border-yellow-800/50 text-yellow-50">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(212,175,55,1)] flex-shrink-0" />
            <span className="truncate">USDT BEP-20</span>
          </div>
          <span className="text-[10px] sm:text-xs text-yellow-600 flex-shrink-0 ml-2">▼</span>
        </div>
      </div>

      {/* Amount Input */}
      <div className="w-full">
        <label className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-1.5 sm:mb-2 text-yellow-500/70">
          Amount (USDT)
        </label>
        <input
          type="number"
          disabled={mode === "withdrawal"}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-lg outline-none disabled:opacity-60 disabled:cursor-not-allowed text-xs sm:text-[13px] transition-all bg-black/50 border border-yellow-800/50 text-yellow-50 placeholder-yellow-800 focus:border-yellow-400 focus:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
          placeholder="0.00"
          step="0.01"
          min="0"
        />
        {mode === "withdrawal" && (
          <p className="text-[9px] sm:text-[10px] font-medium mt-1.5 text-[#c98a3f]/80 uppercase tracking-widest break-words">
            Amount is pre-set for withdrawal
          </p>
        )}
      </div>

      {/* Transaction Button */}
      <button
        onClick={handleTransaction}
        disabled={isWritePending || isConfirming || !amount || parseFloat(amount) <= 0}
        className="group relative w-full py-3.5 sm:py-4 rounded-lg font-bold text-xs sm:text-[13px] uppercase tracking-widest text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 overflow-hidden bg-black/60 border border-yellow-500/50 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(180,83,9,0.35)]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-[#b45309]/20 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative flex items-center justify-center gap-2 z-10 text-yellow-50 w-full px-2">
          {isWritePending || isConfirming ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-yellow-400 flex-shrink-0" />
              <span className="truncate">{isWritePending ? "Confirming..." : "Processing..."}</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4 text-yellow-400 flex-shrink-0" />
              <span className="truncate">Send {amount || "0"} USDT</span>
            </>
          )}
        </div>
      </button>

      <p className="text-center text-[9px] sm:text-[10px] text-yellow-500/60 uppercase tracking-widest leading-normal px-2">
        Accruals credited <strong className="text-[#c98a3f]">daily</strong>. Withdraw profit anytime.
      </p>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-lg bg-red-950/40 border border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)] w-full">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span className="text-[11px] sm:text-xs font-medium leading-normal break-words">{error}</span>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-lg bg-yellow-950/40 border border-yellow-400/50 text-yellow-300 shadow-[0_0_15px_rgba(212,175,55,0.2)] w-full">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span className="text-[11px] sm:text-xs font-medium leading-normal break-words">{success}</span>
        </div>
      )}

      {/* Transaction Hash */}
      {hash && (
        <div className="p-3 sm:p-4 rounded-lg bg-black/40 border border-[#b45309]/40 relative overflow-hidden w-full">
          <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#c98a3f]/80 truncate">
              Transaction Hash
            </span>
            <a
              href={getExplorerUrl(hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#e0a458] text-[#b45309] p-1 flex-shrink-0"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <p className="text-[10px] sm:text-[11px] font-mono break-all text-[#e0a458]/90 normal-case leading-relaxed">{hash}</p>
        </div>
      )}
    </div>
  );
};

const WithdrawalModal = ({ onClose, formProps }) => (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 transition-all"
    style={{ background: "rgba(5, 8, 15, 0.9)", backdropFilter: "blur(12px)" }}
  >
    {/* Swapped standard vh for dvh to prevent iOS Safari bottom-bar clipping */}
    {/* Outer layer supplies the gold "stroke" of the wave border; inner layer is offset by padding and re-clipped to the same wave shape */}
    <div
      className="relative shadow-[0_0_40px_rgba(212,175,55,0.15)] w-full max-w-md"
      style={{
        clipPath: "url(#waveCardClip)",
        background: "linear-gradient(135deg, rgba(234,179,8,0.6), rgba(180,83,9,0.6))",
        padding: "3px",
      }}
    >
      <div
        className="relative bg-[#070b14] p-5 sm:p-7 max-h-[90dvh] overflow-y-auto flex flex-col"
        style={{ clipPath: "url(#waveCardClip)" }}
      >

        {/* Decorative HUD Corners */}
        <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 border-yellow-400/80 rounded-tl-xl pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-r-2 border-yellow-400/80 rounded-tr-xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-l-2 border-yellow-400/80 rounded-bl-xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 border-yellow-400/80 rounded-br-xl pointer-events-none"></div>

        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-yellow-900/40 flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <Send className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-[#b45309] drop-shadow-[0_0_8px_rgba(180,83,9,0.7)] flex-shrink-0" />
            <h2 className="font-serif text-[16px] sm:text-[18px] font-bold uppercase tracking-widest bg-gradient-to-r from-yellow-400 to-[#c98a3f] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(212,175,55,0.3)] truncate">
              Withdrawal
            </h2>
          </div>
          <button
            onClick={onClose}
            className="transition-all hover:text-yellow-300 hover:scale-110 text-yellow-600 p-2 -mr-2 flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
           <TransactionForm {...formProps} />
        </div>
      </div>
    </div>
  </div>
);

const WagmiCryptoComponent = ({
  mode = "deposit",
  onTransactionComplete,
  toAddress = "",
  className = "",
  val = 0,
  user,
}) => {
  const dispatch = useDispatch();
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { auth } = useSelector((state) => state.auth);

  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);

  const amountInitialized = useRef(false);
  useEffect(() => {
    if (mode === "withdrawal" && val > 0 && !amountInitialized.current) {
      setAmount(val.toString());
      amountInitialized.current = true;
    }
  }, [mode, val]);

  const usdtAddress = USDT_CONTRACTS[chainId];

  const { data: balance } = useBalance({
    address: address,
    token: usdtAddress,
    enabled: isConnected && !!usdtAddress,
  });

  const { data: decimals } = useReadContract({
    address: usdtAddress,
    abi: USDT_ABI,
    functionName: "decimals",
    enabled: !!usdtAddress,
  });

  const {
    data: hash,
    writeContract,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash });

  const amountRef = useRef(amount);
  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  const txProcessed = useRef(new Set());

  useEffect(() => {
    if (isConfirmed && hash && !txProcessed.current.has(hash)) {
      txProcessed.current.add(hash);
      const confirmedAmount = amountRef.current;
      setSuccess(`${mode === "deposit" ? "Deposit" : "Withdrawal"} successful!`);
      setError("");

      if (mode === "deposit") {
        dispatch(
          addDeposite({ hash, amount: confirmedAmount, user_id: auth?.id, status: "complete" })
        );
        setAmount("");
        setTimeout(() => window.location.reload(), 3000);
      } else if (mode === "withdrawal" && user) {
        dispatch(
          updateWithdrawal({
            id: user?.id,
            status: "complete",
            amount: user?.amount + user?.deduction,
            user_id: user?.user_id,
            txHash: hash,
            type: user?.type,
          })
        );
        setTimeout(() => setShowModal(false), 3000);
      }

      if (onTransactionComplete) {
        onTransactionComplete({ hash, amount: confirmedAmount, toAddress, fromAddress: address, mode });
      }
    }
  }, [isConfirmed, hash]);

  useEffect(() => {
    if (writeError) setError(writeError.message || "Transaction failed");
    if (receiptError) setError(receiptError.message || "Transaction confirmation failed");
  }, [writeError, receiptError]);

  const handleTransaction = async () => {
    if (!amount || !toAddress) {
      setError("Please fill in all required fields");
      return;
    }
    if (!isConnected) {
      setError("Please connect your wallet");
      return;
    }
    if (!usdtAddress) {
      setError("USDT not supported on this network");
      return;
    }
    setError("");
    setSuccess("");
    try {
      const amountInWei = parseUnits(amount, decimals || 6);
      writeContract({
        address: usdtAddress,
        abi: USDT_ABI,
        functionName: "transfer",
        args: [toAddress, amountInWei],
      });
    } catch (err) {
      setError(err.message || "Transaction failed");
    }
  };

  const copyToClipboard = (text) => navigator.clipboard.writeText(text);

  const getExplorerUrl = (txHash) => {
    const explorers = {
      1: "https://etherscan.io/tx/",
      56: "https://bscscan.com/tx/",
      137: "https://polygonscan.com/tx/",
    };
    return explorers[chainId] ? `${explorers[chainId]}${txHash}` : "#";
  };

  const formProps = {
    address,
    balance,
    toAddress,
    usdtAddress,
    amount,
    setAmount,
    mode,
    isWritePending,
    isConfirming,
    error,
    success,
    hash,
    copyToClipboard,
    handleTransaction,
    getExplorerUrl,
  };

  if (mode === "withdrawal" && !showModal) {
    return (
      <div className={`w-full max-w-md mx-auto ${className}`}>
        {!isConnected ? (
          <div className="flex flex-col gap-2.5 sm:gap-3 w-full">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => connect({ connector })}
                disabled={isPending}
                className="w-full py-3.5 sm:py-4 px-2 rounded-lg font-bold text-xs uppercase tracking-widest text-yellow-50 transition-all hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] active:scale-[0.98] disabled:opacity-50 border border-yellow-700/50 bg-black/60 relative overflow-hidden group flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-[#b45309]/10 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10 truncate">
                  {isPending ? "Connecting..." : `Connect ${connector.name}`}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 w-full">
            <div className="flex items-center justify-between gap-2 p-3 rounded-lg border border-yellow-900/50 bg-black/40">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(212,175,55,1)] animate-pulse flex-shrink-0"></div>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-medium text-yellow-100 truncate">
                  Wallet connected
                </span>
              </div>
              <button
                onClick={() => disconnect()}
                className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:text-red-300 text-red-500 transition-colors p-1 flex-shrink-0"
              >
                Disconnect
              </button>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="w-full py-3.5 sm:py-4 px-2 rounded-lg font-bold text-xs sm:text-[13px] uppercase tracking-widest text-white transition-all active:scale-[0.98] border border-[#b45309]/50 bg-black/60 shadow-[0_0_20px_rgba(180,83,9,0.15)] hover:shadow-[0_0_30px_rgba(180,83,9,0.3)] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#b45309]/20 to-yellow-500/20 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10 truncate">Process Payment</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <WaveClipDefs />
      <div
        className={`relative my-2 w-full max-w-xl mx-auto shadow-[0_0_40px_rgba(255,207,48,0.06)] ${className}`}
        style={{
          clipPath: "url(#waveCardClip)",
          background: "linear-gradient(135deg, rgba(234,179,8,0.55), rgba(180,83,9,0.55))",
          padding: "3px",
        }}
      >
      <div
        className="relative bg-black/40 p-4 sm:p-6 md:p-8 overflow-hidden flex flex-col"
        style={{ clipPath: "url(#waveCardClip)" }}
      >
        {/* Decorative HUD Corners */}
        <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 border-yellow-400/50 rounded-tl-xl pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-r-2 border-yellow-400/50 rounded-tr-xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-l-2 border-yellow-400/50 rounded-bl-xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 border-yellow-400/50 rounded-br-xl pointer-events-none"></div>

        {/* Ambient Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(circle at center, #D4AF37 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>

        <div className="relative z-10 flex items-center justify-between gap-3 mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-yellow-600/30">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <Download className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(212,175,55,0.8)] flex-shrink-0" />
            <h2 className="font-serif text-[16px] sm:text-[18px] font-bold uppercase tracking-widest bg-gradient-to-r from-yellow-400 to-yellow-100 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(212,175,55,0.3)] truncate">
              Deposit Funds
            </h2>
          </div>
          {isConnected && (
            <button
              onClick={() => disconnect()}
              className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors border border-red-900/50 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded bg-red-950/20 flex-shrink-0"
            >
              Disconnect
            </button>
          )}
        </div>

        {!isConnected ? (
          <div className="relative z-10 text-center w-full max-w-xs sm:max-w-sm mx-auto py-4 sm:py-8 flex-1 flex flex-col justify-center">
            
            <motion.div 
              className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8 flex items-center justify-center cursor-pointer flex-shrink-0"
              whileHover="hover"
            >
              <motion.div 
                className="absolute inset-0 rounded-2xl border border-yellow-500/20 shadow-[0_0_30px_rgba(212,175,55,0.1)]"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              />
              <motion.div 
                className="absolute inset-0 rounded-2xl border border-[#b45309]/20 shadow-[0_0_30px_rgba(180,83,9,0.1)]"
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
              />
              <motion.div
                variants={{
                  hover: { scale: 1.1, filter: "drop-shadow(0 0 20px rgba(212,175,55,0.9))" }
                }}
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="relative z-10"
              >
                <Wallet
                  className="h-11 w-11 sm:h-14 sm:w-14 text-yellow-400 drop-shadow-[0_0_12px_rgba(212,175,55,0.7)]"
                  strokeWidth={1}
                />
              </motion.div>
            </motion.div>

            <p className="font-medium mb-6 sm:mb-8 text-sm sm:text-[15px] text-yellow-100 drop-shadow-[0_0_5px_rgba(212,175,55,0.4)] tracking-wide px-2 break-words">
              Connect your wallet to continue
            </p>

            <div className="space-y-3 sm:space-y-4 w-full">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => connect({ connector })}
                  disabled={isPending}
                  className="group relative w-full py-3.5 sm:py-4 px-2 rounded-lg font-bold text-xs sm:text-[13px] uppercase tracking-widest text-yellow-50 transition-all active:scale-[0.98] disabled:opacity-50 overflow-hidden bg-black/60 border border-yellow-500/50 shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(180,83,9,0.25)] hover:border-[#b45309]/50 flex items-center justify-center gap-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-[#b45309]/10 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] truncate">
                    {isPending ? "Connecting..." : `Connect ${connector.name}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative z-10 w-full flex-1">
            <TransactionForm {...formProps} />
          </div>
        )}
      </div>
      </div>

      {mode === "withdrawal" && showModal && (
        <WithdrawalModal onClose={() => setShowModal(false)} formProps={formProps} />
      )}
    </>
  );
};

export default WagmiCryptoComponent;