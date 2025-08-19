import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { calculateSalesFromBsr, calculateIncome } from '@/lib/incomeCalculator';

const calculateTrend = (current, previous, lowerIsBetter = false) => {
  if (previous === null || current === null || previous === 0 || current === previous) {
    return 'stable';
  }
  
  const changeThreshold = 0.01; // 1% change
  const absoluteChange = Math.abs(current - previous);
  const relativeChange = Math.abs(absoluteChange / previous);

  if (relativeChange < changeThreshold && absoluteChange < 5) {
      return 'stable';
  }

  if (lowerIsBetter) {
    return current < previous ? 'up' : 'down'; // up is good (e.g. BSR decreased)
  }
  return current > previous ? 'up' : 'down'; // up is good (e.g. reviews increased)
};

const useAsinTrends = (asins) => {
  const [trends, setTrends] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const calculateAsinTrends = useCallback(async () => {
    if (!asins || asins.length === 0) {
      setTrends({});
      return;
    }

    setIsLoading(true);
    const asinIds = asins.map(a => a.id);

    const { data: historyData, error } = await supabase
      .from('asin_history')
      .select('asin_data_id, bsr, review_count, created_at, price')
      .in('asin_data_id', asinIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching history for trends:", error);
      setTrends({});
      setIsLoading(false);
      return;
    }

    const newTrends = {};

    for (const asin of asins) {
      const relevantHistory = historyData
        .filter(h => h.asin_data_id === asin.id)
        .slice(0, 4); // Get last 4 scrapes for more stable trend

      if (relevantHistory.length < 2) {
        newTrends[asin.id] = { bsr: 'stable', reviews: 'stable', income: 'stable', price: 'stable' };
        continue;
      }

      const current = relevantHistory[0];
      const previous = relevantHistory[1];

      const bsrTrend = calculateTrend(current.bsr, previous.bsr, true);
      const reviewsTrend = calculateTrend(current.review_count, previous.review_count);
      const priceTrend = calculateTrend(current.price, previous.price);

      const currentSales = calculateSalesFromBsr(current.bsr);
      const currentIncome = calculateIncome(currentSales, asin.royalty);
      const currentAvgIncome = (currentIncome.monthly[0] + currentIncome.monthly[1]) / 2;

      const previousSales = calculateSalesFromBsr(previous.bsr);
      const previousIncome = calculateIncome(previousSales, asin.royalty);
      const previousAvgIncome = (previousIncome.monthly[0] + previousIncome.monthly[1]) / 2;

      const incomeTrend = calculateTrend(currentAvgIncome, previousAvgIncome);

      newTrends[asin.id] = {
        bsr: bsrTrend,
        reviews: reviewsTrend,
        income: incomeTrend,
        price: priceTrend,
      };
    }

    setTrends(newTrends);
    setIsLoading(false);
  }, [asins.map(a => a.id).join(',')]); // Depend on string of IDs

  useEffect(() => {
    calculateAsinTrends();
  }, [calculateAsinTrends]);

  return { trends, isLoading, refreshTrends: calculateAsinTrends };
};

export default useAsinTrends;