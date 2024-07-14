import "@/styles/globals.css";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import RootLayout from "@/components/Layouts/RootLayout";

export default function App({ Component, pageProps }) {

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </ThemeProvider>
  )
}
