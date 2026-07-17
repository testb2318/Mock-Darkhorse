import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { getQrLink } from "../../redux/qrSlice";
import { useSelector, useDispatch } from "react-redux";
import { Copy, Download, CheckCircle, QrCode, Wallet } from "lucide-react";

const BEP20QR = () => {
  const dispatch = useDispatch();
  const { qr } = useSelector((state) => state.qr);
  const [size, setSize] = useState(200);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    dispatch(getQrLink());
  }, [dispatch]);

  const handleCopyAddress = async () => {
    if (qr?.BEB20) {
      await navigator.clipboard.writeText(qr.BEB20);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    const svg = document.querySelector(".qr-code-svg svg");
    if (svg) {
      setDownloading(true);
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        const link = document.createElement("a");
        link.download = `bep20-wallet-${qr?.BEB20?.substring(0, 8)}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        setDownloading(false);
      };
      
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
  };

  if (!qr?.BEB20) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-gray-800/30 border border-gray-700">
        <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center mb-3">
          <QrCode className="w-6 h-6 text-gray-500" />
        </div>
        <p className="text-sm text-gray-500">Loading QR code...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-gray-800/30 border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#00f5c3]/10 rounded-lg">
            <Wallet className="w-4 h-4 text-[#00f5c3]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">BEP-20 Wallet</h3>
            <p className="text-[10px] text-gray-500">USDT (BEP-20) Deposit Address</p>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="p-5 flex flex-col items-center">
        <div className="qr-code-svg p-4 bg-white rounded-xl shadow-lg">
          <QRCodeSVG
            value={qr?.BEB20}
            size={size}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Address Section */}
        <div className="mt-4 w-full">
          <div className="text-center mb-3">
            <p className="text-xs text-gray-500 mb-1">Wallet Address</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm font-mono text-[#00f5c3] bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700">
                {formatAddress(qr?.BEB20)}
              </p>
            </div>
            <p className="text-[10px] text-gray-600 mt-2 break-all">
              {qr?.BEB20}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-2 w-full">
          <button
            onClick={handleCopyAddress}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-all duration-300 group"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gray-400 group-hover:text-[#00f5c3] transition-colors" />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  Copy Address
                </span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadQR}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#00f5c3]/10 hover:bg-[#00f5c3]/20 border border-[#00f5c3]/30 rounded-lg transition-all duration-300 group"
          >
            {downloading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#00f5c3] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-[#00f5c3]">Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#00f5c3]" />
                <span className="text-sm text-[#00f5c3] font-medium">
                  Download QR
                </span>
              </>
            )}
          </button>
        </div>

        {/* Warning Note */}
        <div className="mt-4 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 w-full">
          <p className="text-[10px] text-yellow-500/80 text-center">
            ⚠️ Send only USDT (BEP-20) to this address. Sending any other coin may result in permanent loss.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BEP20QR;