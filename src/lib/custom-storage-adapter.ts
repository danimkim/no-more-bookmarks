import { SupportedStorage } from "@supabase/supabase-js";

export const customStorageAdapter: SupportedStorage = {
  getItem: (key) => {
    if (typeof window === "undefined") {
      // return null on server side
      return null;
    }

    // read cookie on browser
    const name = key + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");

    for (let cookie of cookieArray) {
      cookie = cookie.trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  },

  setItem: (key, value) => {
    if (typeof window === "undefined") {
      // do nothing on server side
      return;
    }

    // set cookie (7 days expiration)
    const expires = new Date();
    expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000);
    document.cookie = `${key}=${value}; expires=${expires.toUTCString()}; path=/; secure; samesite=lax`;
  },

  removeItem: (key) => {
    if (typeof window === "undefined") {
      return;
    }

    // delete cookie (set to past date)
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },
};
