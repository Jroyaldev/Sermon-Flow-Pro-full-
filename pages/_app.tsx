import { AppProps } from 'next/app';
import { SupabaseProvider } from '../lib/SupabaseProvider';
import { ClerkProvider } from "@clerk/nextjs";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <SupabaseProvider>
        <Component {...pageProps} />
      </SupabaseProvider>
    </ClerkProvider>
  );
}

export default MyApp;