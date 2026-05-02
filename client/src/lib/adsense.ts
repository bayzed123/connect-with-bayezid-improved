/**
 * AdSense Utility
 * Handles loading and initializing Google AdSense on blog pages
 * Prevents duplicate script injection and ensures proper ad rendering
 */

const ADSENSE_CLIENT_ID = "ca-pub-9789336661158068";
const ADSENSE_SCRIPT_URL = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;

let scriptLoaded = false;
let scriptLoadPromise: Promise<void> | null = null;

/**
 * Load AdSense script once and reuse across components
 * Prevents duplicate script injection
 */
export function loadAdSenseScript(): Promise<void> {
  // If already loaded, return immediately
  if (scriptLoaded) {
    return Promise.resolve();
  }

  // If currently loading, return existing promise
  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  // Check if script already exists in DOM
  const existingScript = document.querySelector(`script[src="${ADSENSE_SCRIPT_URL}"]`);
  if (existingScript) {
    scriptLoaded = true;
    return Promise.resolve();
  }

  // Load script for the first time
  scriptLoadPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = ADSENSE_SCRIPT_URL;
    script.crossOrigin = "anonymous";

    script.onload = () => {
      scriptLoaded = true;
      scriptLoadPromise = null;
      resolve();
    };

    script.onerror = () => {
      console.error("Failed to load AdSense script");
      scriptLoaded = true;
      scriptLoadPromise = null;
      resolve(); // Resolve anyway to prevent blocking
    };

    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

/**
 * Push ad units to AdSense for rendering
 * Call this after adding <ins class="adsbygoogle"> elements to DOM
 * Only processes ads that haven't been initialized yet
 */
export function pushAdUnits(): void {
  if (typeof window !== "undefined" && (window as any).adsbygoogle) {
    try {
      // Get all adsbygoogle ins elements
      const adElements = document.querySelectorAll('ins.adsbygoogle');
      
      // Only push ads that haven't been processed yet
      adElements.forEach((ad) => {
        // Check if ad has already been processed (has data-ad-status attribute)
        if (!ad.hasAttribute('data-ad-status')) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        }
      });
    } catch (error) {
      // Silently handle errors to avoid console spam
      // This is expected when ads are already loaded
    }
  }
}

/**
 * Initialize AdSense on a page
 * Should be called in useEffect after component mounts
 * Safe to call multiple times - only processes new ads
 */
export async function initializeAdSense(): Promise<void> {
  try {
    await loadAdSenseScript();
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      pushAdUnits();
    }, 100);
  } catch (error) {
    // Silently handle errors
  }
}

export const ADSENSE_CLIENT = ADSENSE_CLIENT_ID;
