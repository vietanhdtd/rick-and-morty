import { useEffect } from "react";

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    const defaultTitle = "Multiverse Guide";
    document.title = title ? `${title} | ${defaultTitle}` : defaultTitle;
  }, [title]);
}
