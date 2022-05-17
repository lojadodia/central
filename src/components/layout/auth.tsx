import { ThemeProvider } from "next-themes";

const Auth: React.FC = ({ children }) => {

  return (
    <ThemeProvider attribute="class" forcedTheme="dark">
    <div className="flex flex-col min-h-screen transition-colors duration-150">
      {children}

    </div>
</ThemeProvider>
  )
}

export default Auth;
