// Google Maps API loader utility
// This ensures the Google Maps API is loaded only once and provides a promise-based interface

// Utility function for components
export const ensureGoogleMapsLoaded = async (): Promise<boolean> => {
  // Check if Google Maps is already available
  if (typeof window !== 'undefined' && window.google && window.google.maps && window.google.maps.Geocoder) {
    return true;
  }

  // Check if API key is configured
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error("Google Maps API key is not configured");
    return false;
  }

  // Check if script is already loading or loaded
  if (typeof window !== 'undefined') {
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    );
    if (existingScript) {
      // Wait for existing script to load
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (window.google && window.google.maps && window.google.maps.Geocoder) {
            resolve(true);
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      });
    }

    // Load the script
    return new Promise((resolve, reject) => {
      const callbackName = "googleMapsInit" + Date.now();
      
      // Create callback function
      (window as any)[callbackName] = () => {
        delete (window as any)[callbackName];
        resolve(true);
      };

      // Create script element
      const script = document.createElement("script");
      script.src = "https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&libraries=places&callback=" + callbackName;
      script.async = true;
      script.defer = true;

      script.onerror = () => {
        delete (window as any)[callbackName];
        console.error("Failed to load Google Maps API");
        resolve(false);
      };

      document.head.appendChild(script);
    });
  }

  return false;
};

// Declare global types
declare global {
  interface Window {
    google: any;
  }
}