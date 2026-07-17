import React, { useEffect, useState } from "react";
import WagmiCryptoComponent from "../../components/shared/WagmiCryptoComponent";
import { useDispatch, useSelector } from "react-redux";
import { getQrLink } from "../../redux/qrSlice";
import axios from "axios";

const Deposit = () => {
  const dispatch = useDispatch();
  const { qr } = useSelector((state) => state.qr);
  // const adminAddress = qr?.BEB20;
  const adminAddress = qr?.BEB20 || "";

  // ✅ 1. States
  const [tokenPrice, setTokenPrice] = useState(null);
  const [tokenSymbol, setTokenSymbol] = useState("");

  // ✅ 2. Fetch Function
  const fetchTokens = async () => {
    try {
      const res = await axios.get("https://api.Mock.ceo/api/v1/tokens");
      const tokens = res.data.data || [];
      const activeToken = tokens.find(token => token.is_active === 1);
      if (activeToken) {
        setTokenPrice(parseFloat(activeToken.current_price));
        setTokenSymbol(activeToken.symbol);
      } else {
        setTokenPrice(1);
        setTokenSymbol("TKN");
      }
    } catch (error) {
      setTokenPrice(1);
      setTokenSymbol("TKN");
    }
  };

  // ✅ 3. useEffect
  useEffect(() => {
    dispatch(getQrLink());
    fetchTokens(); // ← add kiya
  }, []);

  return (
    <div className="flex flex-row justify-center   p-2">
      <WagmiCryptoComponent
        toAddress={adminAddress}
        onTransactionComplete={(data) => {
          console.log("Withdrawal completed:", data);
        }}
        tokenPrice={tokenPrice}   // ✅ pass kiya
        tokenSymbol={tokenSymbol} // ✅ pass kiya
      />
    </div>
  );
};

export default Deposit;