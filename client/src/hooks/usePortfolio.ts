import { useEffect, useState } from "react";
import { cv, type Portfolio } from "@/lib/cv";
import { fetchPortfolio } from "@/services/portfolioApi";

let cachedPortfolio: Portfolio | null = null;
let cacheFromApi = false;
let inFlightRequest: Promise<{ portfolio: Portfolio; isApiBacked: boolean }> | null = null;

async function getPortfolioOnce() {
  if (cachedPortfolio) {
    return { portfolio: cachedPortfolio, isApiBacked: cacheFromApi };
  }

  if (!inFlightRequest) {
    inFlightRequest = fetchPortfolio()
      .then((data) => ({ portfolio: data, isApiBacked: true }))
      .catch(() => ({ portfolio: cv, isApiBacked: false }))
      .then((result) => {
        cachedPortfolio = result.portfolio;
        cacheFromApi = result.isApiBacked;
        return result;
      })
      .finally(() => {
        inFlightRequest = null;
      });
  }

  return inFlightRequest;
}

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<Portfolio>(cachedPortfolio || cv);
  const [isApiBacked, setIsApiBacked] = useState(cacheFromApi);
  const [isLoading, setIsLoading] = useState(!cachedPortfolio);

  useEffect(() => {
    let active = true;

    getPortfolioOnce().then((result) => {
      if (!active) return;
      setPortfolio(result.portfolio);
      setIsApiBacked(result.isApiBacked);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return { portfolio, isApiBacked, isLoading };
}
