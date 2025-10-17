declare global {
  interface Window {
    Paddle?: {
      Initialize: (options: {
        environment: 'sandbox' | 'production';
        token: string;
        eventCallback?: (event: any) => void;
      }) => void;
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
