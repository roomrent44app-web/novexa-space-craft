import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@fontsource/fredoka/600.css";
import "@fontsource/fredoka/700.css";
import "@fontsource/chewy/400.css";
import "@fontsource/titan-one/400.css";
import "@fontsource/kalam/700.css";
import "@fontsource/nunito-sans/400.css";
import "@fontsource/nunito-sans/600.css";
import "@fontsource/nunito-sans/700.css";
import "@fontsource/nunito-sans/800.css";
import "./index.css";

const root = document.getElementById("root");
if (root) createRoot(root).render(<App />);

// Warm blog posts + cover photos in the background so Blog and articles open instantly.
const warmBlog = () => import("./lib/blogCache").then((m) => m.loadPosts());
("requestIdleCallback" in window ? (window as any).requestIdleCallback : setTimeout)(warmBlog, 1200);
