import "./styles/site.css";
import initializeMotion from "./app/lib/motion";

// Every route is already complete HTML. React is used at build time, so this
// enhancement never replaces the page and the site remains usable without JS.
initializeMotion();
