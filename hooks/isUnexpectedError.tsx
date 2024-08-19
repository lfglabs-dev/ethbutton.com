import { useEffect, useState } from "react";

export default function isUnexpectedError() {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const checkApiAndWebSocket = async () => {
      setHasError(false);
      try {
        // Check if API is alive
        const apiResponse = await fetch(
          process.env.NEXT_PUBLIC_ETH_BUTTON_API as string
        );
        if (!apiResponse.ok) {
          throw new Error("API is down");
        }

        const ws = new WebSocket(
          process.env.NEXT_PUBLIC_WEBSOCKET_URL as string
        );

        ws.onopen = () => {
          console.log("WebSocket connected");
          ws.close(); // Close the connection since it's just a check
        };

        ws.onerror = () => {
          throw new Error("WebSocket connection failed");
        };

        ws.onclose = () => {
          console.log("WebSocket connection closed");
        };
      } catch (err) {
        setHasError(true);
      }
    };

    checkApiAndWebSocket();
  }, []);

  return hasError;
}
