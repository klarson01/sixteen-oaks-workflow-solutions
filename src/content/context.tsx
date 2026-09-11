import { createContext, useContext } from "react";
import seed from "./seed.json";
import type { SiteContent } from "./model";
export const defaultContent = seed as SiteContent;
export const SiteContext = createContext({
  content: defaultContent,
  formToken: "",
});
export const useSite = () => useContext(SiteContext);
