import { useEffect, useRef } from "react";

const SCRIPT_ID = "coingecko-widget-script";

export default function CoinGeckoWidget({
  currency = "usd",
  darkMode = true,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    // load script only once
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.src =
        "https://widgets.coingecko.com/gecko-coin-market-ticker-list-widget.js";
      script.async = true;
      script.id = SCRIPT_ID;
      document.body.appendChild(script);
    }

    // re-render widget when props change
    if (containerRef.current) {
      containerRef.current.innerHTML = `
        <gecko-coin-market-ticker-list-widget
          locale="en"
          dark-mode="${darkMode}"
          transparent-background="true"
          outlined="true"
          initial-currency="${currency}">
        </gecko-coin-market-ticker-list-widget>
      `;
    }
  }, [currency, darkMode]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%" }}
      className="bg-transparent"
    />
  );
}

// import { useEffect } from "react";

// export default function CoinGeckoWidget() {
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src =
//       "https://widgets.coingecko.com/gecko-coin-market-ticker-list-widget.js";
//     script.async = true;

//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   return (
//     <div className="w-full min-h-[500px] flex flex-col items-center justify-center">
//       <gecko-coin-market-ticker-list-widget
//         locale="en"
//         dark-mode="true"
//         transparent-background="true"
//         outlined="true"
//         initial-currency="usd"
//         coin-id="bitcoin"
//       ></gecko-coin-market-ticker-list-widget>
//     </div>
//   );
// }




