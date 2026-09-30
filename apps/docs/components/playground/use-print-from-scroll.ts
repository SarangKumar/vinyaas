"use client";

import { useEffect } from "react";

/**
 * When Ctrl+P / print runs inside an overflow scrollport, browsers often
 * reset to the top of that container. Shift content so the printed page
 * starts at the current scroll position (current section).
 */
export function usePrintFromScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const main = document.getElementById("docs-content");

    if (!main) {
      return;
    }

    function beforePrint() {
      if (!main) {
        return;
      }

      const offset = main.scrollTop;
      main.style.setProperty("--print-scroll-offset", `-${offset}px`);
      main.dataset.printFromScroll = "true";
    }

    function afterPrint() {
      if (!main) {
        return;
      }

      main.style.removeProperty("--print-scroll-offset");
      delete main.dataset.printFromScroll;
    }

    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);

    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
      afterPrint();
    };
  }, [enabled]);
}
