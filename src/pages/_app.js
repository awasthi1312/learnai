import { UsersProvider } from "@/context/UsersContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <UsersProvider>
      <Component {...pageProps} />
    </UsersProvider>
  );
}
