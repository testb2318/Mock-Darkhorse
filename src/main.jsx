import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { config, queryClient } from "./utils/wagmi.config.js";
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById("root")).render(
  <StrictMode>

    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
