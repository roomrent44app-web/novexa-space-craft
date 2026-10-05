import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@fontsource/fredoka/600.css";
import "@fontsource/fredoka/700.css";
import "@fontsource/chewy/400.css";
import "@fontsource/nunito-sans/400.css";
import "@fontsource/nunito-sans/600.css";
import "@fontsource/nunito-sans/700.css";
import "@fontsource/nunito-sans/800.css";
import "./index.css";

const root = document.getElementById("root");
if (root) createRoot(root).render(<App />);
