import React, { useState, useEffect } from "react";

const PaymentQRCode = ({ paymentData }) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState("");
  const [copied, setCopied] = useState(false);
  const [size] = useState(250);

  // Extract payment details
  const {
    pay_address = "",
    pay_amount = 0,
    pay_currency = "",
    price_amount = 0,
    network = "",
  } = paymentData || {};

  // Calculate total amount (price_amount + 0.5 fee)
  const totalAmount = price_amount + 0.5;

  // Generate QR code using a simple QR code generation approach
  const generateQR = async (text) => {
    try {
      // Create a simple QR code using canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = size;
      canvas.height = size;

      // Fill white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);

      // For now, we'll create a simple visual representation
      // In a real implementation, you'd use a QR code library
      ctx.fillStyle = "#000000";
      ctx.font = "12px monospace";
      ctx.textAlign = "center";

      // Draw address info
      const lines = [
        "Payment QR Code",
        "",
        `Network: ${network}`,
        `Amount: ${pay_amount} ${pay_currency.toUpperCase()}`,
        "",
        "Address:",
        pay_address.substring(0, 20) + "...",
        pay_address.substring(20, 42),
        "",
        "Scan with wallet app",
      ];

      lines.forEach((line, index) => {
        ctx.fillText(line, size / 2, 30 + index * 18);
      });

      return canvas.toDataURL();
    } catch (error) {
      console.error("Error generating QR code:", error);
      return "";
    }
  };

  // Create proper payment URI for MetaMask with amount auto-fill
  const createPaymentURI = () => {
    if (!pay_address || !totalAmount) {
      return pay_address;
    }

    // For USDT on BSC, we need to create a token transfer URI
    // USDT on BSC contract address: 0x55d398326f99059fF775485246999027B3197955
    const usdtContractBSC = "0x55d398326f99059fF775485246999027B3197955";

    if (
      network.toLowerCase() === "bsc" &&
      pay_currency.toLowerCase().includes("usdt")
    ) {
      // For USDT transfers, we need to use ERC-20 token transfer format
      // Amount in smallest unit (USDT has 18 decimals on BSC)
      const amountInWei = Math.floor(totalAmount * Math.pow(10, 18)).toString();

      // Create EIP-681 format for token transfer
      return `ethereum:${usdtContractBSC}@56/transfer?address=${pay_address}&uint256=${amountInWei}`;
    }

    // For native tokens (BNB, ETH), use standard format
    if (network.toLowerCase() === "bsc") {
      const amountInWei = Math.floor(totalAmount * Math.pow(10, 18)).toString();
      return `ethereum:${pay_address}@56?value=${amountInWei}`;
    }

    // Fallback for other networks
    const amountInWei = Math.floor(totalAmount * Math.pow(10, 18)).toString();
    return `ethereum:${pay_address}?value=${amountInWei}`;
  };

  // Generate QR code when component mounts or data changes
  useEffect(() => {
    if (pay_address && totalAmount > 0) {
      const paymentURI = createPaymentURI();
      generateQRCodeWithAPI(paymentURI);
    }
  }, [pay_address, totalAmount, network, pay_currency]);

  // Use QR Server API to generate actual QR code
  const generateQRCodeWithAPI = (data) => {
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
      data
    )}&bgcolor=ffffff&color=000000&margin=10&format=png`;
    setQrCodeDataURL(qrApiUrl);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pay_address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = pay_address;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadQR = () => {
    if (qrCodeDataURL) {
      const link = document.createElement("a");
      link.download = `payment-${pay_address.substring(0, 8)}.png`;
      link.href = qrCodeDataURL;
      link.click();
    }
  };

  const openInMetaMask = () => {
    const paymentURI = createPaymentURI();

    // For USDT transfers on BSC, create a different deep link
    if (
      network.toLowerCase() === "bsc" &&
      pay_currency.toLowerCase().includes("usdt")
    ) {
      // MetaMask deep link for token transfers
      window.open(
        `https://metamask.app.link/send/0x55d398326f99059fF775485246999027B3197955@56/transfer?address=${pay_address}&uint256=${Math.floor(
          totalAmount * Math.pow(10, 18)
        )}`,
        "_blank"
      );
    } else {
      // For native tokens
      window.open(
        `https://metamask.app.link/send/${pay_address}@56?value=${totalAmount}`,
        "_blank"
      );
    }
  };

  if (!pay_address) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p>No payment data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Payment Info Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Payment Required
        </h3>
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">
            Network: <span className="font-semibold">{network}</span>
          </p>

          {/* Amount Breakdown */}
          <div className="space-y-1 mb-3">
            <div className="flex justify-between text-sm">
              <span>Amount:</span>
              <span>${price_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Network Fee:</span>
              <span>$0.50</span>
            </div>
            <hr className="border-blue-200 my-2" />
            <div className="flex justify-between font-bold text-lg text-blue-600">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Amount will auto-fill when scanned with wallet
          </p>
        </div>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          {qrCodeDataURL ? (
            <img
              src={qrCodeDataURL}
              alt="Payment QR Code"
              className="block"
              style={{ width: size, height: size }}
            />
          ) : (
            <div
              className="bg-gray-100 flex items-center justify-center"
              style={{ width: size, height: size }}
            >
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Generating QR...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Address Display */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-xs text-gray-500 mb-1">Payment Address:</p>
        <p className="font-mono text-sm break-all text-gray-800">
          {pay_address}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={openInMetaMask}
          className="w-full py-3 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors duration-200 shadow-sm flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.46 6.48l-1.73-3L12 1 3.27 3.48l-1.73 3L12 9.5l10.46-3.02zM12 11l-8.73-2.52v8.04c0 .83.67 1.5 1.5 1.5h14.46c.83 0 1.5-.67 1.5-1.5V8.48L12 11z" />
          </svg>
          Open in MetaMask
        </button>

        <div className="flex gap-2">
          <button
            onClick={downloadQR}
            className="flex-1 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm flex items-center justify-center"
            disabled={!qrCodeDataURL}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download
          </button>

          <button
            onClick={handleCopy}
            className="flex-1 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm flex items-center justify-center"
          >
            {copied ? (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Instructions:</strong> Scan this QR code with your MetaMask
          mobile app. The payment amount (${totalAmount.toFixed(2)}) will
          automatically be filled in. Just confirm the transaction.
        </p>
      </div>
    </div>
  );
};
export default PaymentQRCode;
