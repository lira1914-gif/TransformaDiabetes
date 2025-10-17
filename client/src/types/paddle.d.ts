declare global {
  interface Window {
    Paddle?: {
      Checkout: {
        open: (options: {
          transactionId: string;
          settings?: {
            theme?: 'light' | 'dark';
            locale?: string;
            displayMode?: 'overlay' | 'inline';
            successUrl?: string;
          };
        }) => void;
      };
    };
  }
}

export {};
