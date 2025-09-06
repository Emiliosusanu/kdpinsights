import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { calculateSalesFromBsr, calculateIncome } from '@/lib/incomeCalculator';
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { estimateRoyalty } from '@/lib/royaltyEstimator';
>>>>>>> 170550e (init: project baseline)
=======
import { estimateRoyalty } from '@/lib/royaltyEstimator';
>>>>>>> 420b2b9 (first commit)

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
<<<<<<< HEAD
<<<<<<< HEAD

    for (const asin of asins) {
      const relevantHistory = historyData
        .filter(h => h.asin_data_id === asin.id)
        .slice(0, 4); // Get last 4 scrapes for more stable trend

      if (relevantHistory.length < 2) {
        newTrends[asin.id] = { bsr: 'stable', reviews: 'stable', income: 'stable', price: 'stable' };
=======
=======
>>>>>>> 420b2b9 (first commit)
    // Group history by ASIN for deeper analysis (summary and MoM guard)
    const historyByAsin = (historyData || []).reduce((acc, h) => {
      (acc[h.asin_data_id] = acc[h.asin_data_id] || []).push(h);
      return acc;
    }, {});

    for (const asin of asins) {
      const allHistory = historyByAsin[asin.id] || [];
      const relevantHistory = allHistory.slice(0, 4); // Get last 4 scrapes for stable trend arrows

      if (relevantHistory.length < 2) {
        newTrends[asin.id] = { bsr: 'stable', reviews: 'stable', income: 'stable', price: 'stable', acos: 'stable' };
<<<<<<< HEAD
>>>>>>> 170550e (init: project baseline)
=======
>>>>>>> 420b2b9 (first commit)
        continue;
      }

      const current = relevantHistory[0];
      const previous = relevantHistory[1];

      const bsrTrend = calculateTrend(current.bsr, previous.bsr, true);
      const reviewsTrend = calculateTrend(current.review_count, previous.review_count);
      const priceTrend = calculateTrend(current.price, previous.price);

      const currentSales = calculateSalesFromBsr(current.bsr);
<<<<<<< HEAD
<<<<<<< HEAD
      const currentIncome = calculateIncome(currentSales, asin.royalty);
      const currentAvgIncome = (currentIncome.monthly[0] + currentIncome.monthly[1]) / 2;

      const previousSales = calculateSalesFromBsr(previous.bsr);
      const previousIncome = calculateIncome(previousSales, asin.royalty);
=======
=======
>>>>>>> 420b2b9 (first commit)
      const effectiveRoyalty = (asin.royalty && asin.royalty > 0) ? asin.royalty : estimateRoyalty(asin);
      const currentIncome = calculateIncome(currentSales, effectiveRoyalty);
      const currentAvgIncome = (currentIncome.monthly[0] + currentIncome.monthly[1]) / 2;

      const previousSales = calculateSalesFromBsr(previous.bsr);
      // Use previous price for royalty estimate if present
      const effRoyaltyPrev = (asin.royalty && asin.royalty > 0)
        ? asin.royalty
        : estimateRoyalty({ ...asin, price: (previous.price ?? asin.price) });
      const previousIncome = calculateIncome(previousSales, effRoyaltyPrev);
<<<<<<< HEAD
>>>>>>> 170550e (init: project baseline)
=======
>>>>>>> 420b2b9 (first commit)
      const previousAvgIncome = (previousIncome.monthly[0] + previousIncome.monthly[1]) / 2;

      const incomeTrend = calculateTrend(currentAvgIncome, previousAvgIncome);

<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 420b2b9 (first commit)
      // Break-even ACOS = (royalty / price) * 100
      const currentBE = (effectiveRoyalty && current.price) ? (effectiveRoyalty / current.price) * 100 : null;
      const previousBE = (effectiveRoyalty && previous.price) ? (effectiveRoyalty / previous.price) * 100 : null;
      const acosTrend = calculateTrend(currentBE, previousBE);

      // Build concise summary since last scrape (avoid redundancy)
      const summaryItems = [];
      // BSR change (lower is better). Use % change threshold 1% and absolute >= 5
      if (previous.bsr && current.bsr) {
        const delta = current.bsr - previous.bsr; // positive = worse
        const rel = previous.bsr ? Math.abs(delta / previous.bsr) : 0;
        if (Math.abs(delta) >= 5 && rel >= 0.01) {
          if (delta < 0) {
            summaryItems.push(`BSR migliorato di ${Math.abs((rel*100)).toFixed(1)}%`);
          } else {
            summaryItems.push(`BSR peggiorato di ${Math.abs((rel*100)).toFixed(1)}%`);
          }
        }
      }
      // Reviews gained
      const revDelta = (current.review_count || 0) - (previous.review_count || 0);
      if (revDelta > 0) {
        summaryItems.push(`+${revDelta} recensioni`);
      }
      // Price change
      const priceDelta = Number(current.price || 0) - Number(previous.price || 0);
      if (Math.abs(priceDelta) >= 0.01) {
        const dir = priceDelta > 0 ? '↑' : '↓';
        summaryItems.push(`Prezzo ${dir} €${Math.abs(priceDelta).toFixed(2)}`);
      }
      // Estimated monthly income change
      if (previousAvgIncome && currentAvgIncome) {
        const incDelta = currentAvgIncome - previousAvgIncome;
        const incRel = previousAvgIncome ? incDelta / previousAvgIncome : 0;
        if (Math.abs(incRel) >= 0.05 && Math.abs(incDelta) >= 0.5) {
          const dir = incDelta > 0 ? '↑' : '↓';
          summaryItems.push(`Guadagno stimato ${dir} ${Math.abs(incRel*100).toFixed(1)}%`);
        }
      }

      // Month-over-month guard (last 30d vs previous 30d)
      const now = new Date();
      const d30 = new Date(now); d30.setDate(now.getDate() - 30);
      const d60 = new Date(now); d60.setDate(now.getDate() - 60);
      const period2 = allHistory.filter(h => new Date(h.created_at) >= d30); // last 30d
      const period1 = allHistory.filter(h => new Date(h.created_at) < d30 && new Date(h.created_at) >= d60); // prev 30d
      // Helpers for drivers/confidence
      const avg = (arr) => (arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0);
      const uniqueDates = (records) => Array.from(new Set(records.map(r => new Date(r.created_at).toISOString().split('T')[0])));
      const avgBsr = (records) => {
        const v = records.map(r => Number(r.bsr)).filter(x => Number.isFinite(x) && x > 0);
        return v.length ? avg(v) : 0;
      };
      const avgRoyalty = (records) => {
        if (!records || records.length === 0) return 0;
        const vals = records.map(r => (
          (asin.royalty && asin.royalty > 0) ? asin.royalty : estimateRoyalty({ ...asin, price: (r.price ?? asin.price) })
        )).filter(Number.isFinite);
        return vals.length ? avg(vals) : 0;
      };
      const avgPrice = (records) => {
        const v = records.map(r => Number(r.price)).filter(x => Number.isFinite(x) && x > 0);
        return v.length ? avg(v) : 0;
      };
      const reviewVelocity = (records) => {
        if (!records || records.length < 2) return 0;
        const last = records[0];
        const first = records[records.length - 1];
        const days = Math.max(1, Math.abs((new Date(last.created_at) - new Date(first.created_at)) / (1000*60*60*24)));
        const delta = (Number(last.review_count)||0) - (Number(first.review_count)||0);
        return delta / days;
      };
      const avgMonthlyIncome = (records) => {
        if (!records || records.length === 0) return 0;
        const vals = records.map(r => {
          const sales = calculateSalesFromBsr(r.bsr);
          const effR = (asin.royalty && asin.royalty > 0) ? asin.royalty : estimateRoyalty({ ...asin, price: (r.price ?? asin.price) });
          const inc = calculateIncome(sales, effR);
          return (inc.monthly[0] + inc.monthly[1]) / 2;
        }).filter(v => Number.isFinite(v));
        if (vals.length === 0) return 0;
        return vals.reduce((a, b) => a + b, 0) / vals.length;
      };
      const m1 = avgMonthlyIncome(period1);
      const m2 = avgMonthlyIncome(period2);
      const b1 = avgBsr(period1);
      const b2 = avgBsr(period2);
      const v1 = reviewVelocity(period1);
      const v2 = reviewVelocity(period2);
      const r1 = avgRoyalty(period1);
      const r2 = avgRoyalty(period2);
      const p1 = avgPrice(period1);
      const p2 = avgPrice(period2);
      const coverageDays2 = uniqueDates(period2).length;
      const confidence = coverageDays2 >= 14 && period2.length >= 8 ? 'high' : (coverageDays2 >= 7 && period2.length >= 4 ? 'medium' : 'low');
      let moGuard = 'stable';
      let moDeltaPct = 0;
      if (m1 > 0 && m2 > 0) {
        moDeltaPct = ((m2 - m1) / m1) * 100;
        if (moDeltaPct >= 5) moGuard = 'better';
        else if (moDeltaPct <= -5) moGuard = 'worse';
        else moGuard = 'stable';
      } else if (m2 > 0 && m1 === 0) {
        moGuard = 'better';
        moDeltaPct = 100;
      } else if (m1 > 0 && m2 === 0) {
        moGuard = 'worse';
        moDeltaPct = -100;
      }
      // Drivers for MoM change
      const drivers = [];
      const pct = (a,b) => (b > 0 ? ((a-b)/b)*100 : 0);
      const bsrDeltaPct = pct(b2, b1);
      const velDelta = v2 - v1;
      const royaltyDeltaPct = pct(r2, r1);
      const priceDeltaPct = pct(p2, p1);
      if (Number.isFinite(b1) && Number.isFinite(b2) && Math.abs(bsrDeltaPct) >= 3) {
        drivers.push(bsrDeltaPct < 0 ? 'BSR medio più basso' : 'BSR medio più alto');
      }
      if (Number.isFinite(velDelta) && Math.abs(velDelta) >= 0.1) {
        drivers.push(velDelta > 0 ? 'Velocità recensioni in aumento' : 'Velocità recensioni in calo');
      }
      if (Number.isFinite(royaltyDeltaPct) && Math.abs(royaltyDeltaPct) >= 1) {
        drivers.push(royaltyDeltaPct > 0 ? 'Margine per copia più alto' : 'Margine per copia più basso');
      } else if (Number.isFinite(priceDeltaPct) && Math.abs(priceDeltaPct) >= 1) {
        drivers.push(priceDeltaPct > 0 ? 'Prezzo medio più alto' : 'Prezzo medio più basso');
      }

<<<<<<< HEAD
>>>>>>> 170550e (init: project baseline)
=======
>>>>>>> 420b2b9 (first commit)
      newTrends[asin.id] = {
        bsr: bsrTrend,
        reviews: reviewsTrend,
        income: incomeTrend,
        price: priceTrend,
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 420b2b9 (first commit)
        acos: acosTrend,
        summary: {
          items: summaryItems,
          moGuard,
          moDeltaPct,
          drivers,
          confidence,
          stats: {
            m1: Number.isFinite(m1) ? Number(m1.toFixed(2)) : 0,
            m2: Number.isFinite(m2) ? Number(m2.toFixed(2)) : 0,
            b1: Number.isFinite(b1) ? Math.round(b1) : 0,
            b2: Number.isFinite(b2) ? Math.round(b2) : 0,
            v1: Number.isFinite(v1) ? Number(v1.toFixed(2)) : 0,
            v2: Number.isFinite(v2) ? Number(v2.toFixed(2)) : 0,
            p1: Number.isFinite(p1) ? Number(p1.toFixed(2)) : 0,
            p2: Number.isFinite(p2) ? Number(p2.toFixed(2)) : 0,
            r1: Number.isFinite(r1) ? Number(r1.toFixed(2)) : 0,
            r2: Number.isFinite(r2) ? Number(r2.toFixed(2)) : 0,
            coverageDays: coverageDays2,
            samples: { prev: period1.length, curr: period2.length },
          },
        },
<<<<<<< HEAD
>>>>>>> 170550e (init: project baseline)
=======
>>>>>>> 420b2b9 (first commit)
      };
    }

    setTrends(newTrends);
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 420b2b9 (first commit)
    // Persist global notifications for top bell
    try {
      const entries = Object.entries(newTrends);
      const better = entries.filter(([,t]) => t?.summary?.moGuard === 'better');
      const worse = entries.filter(([,t]) => t?.summary?.moGuard === 'worse');
      const stable = entries.filter(([,t]) => t?.summary?.moGuard === 'stable');
      const topMessages = entries.slice(0, 50).map(([id, t]) => {
        const title = (asins.find(a => a.id === id)?.title) || (asins.find(a => String(a.id) === String(id))?.title) || '';
        const guard = t?.summary?.moGuard;
        const pct = t?.summary?.moDeltaPct;
        const drv = (t?.summary?.drivers || []).slice(0,2).join(', ');
        if (!guard || guard === 'stable') return null;
        return `${title || 'ASIN'}: ${guard === 'better' ? 'migliore' : 'peggiore'} (${Number.isFinite(pct) ? pct.toFixed(1) : '0'}%) — ${drv}`;
      }).filter(Boolean).slice(0, 12);
      const details = entries.map(([id, t]) => {
        const asin = asins.find(a => a.id === id) || asins.find(a => String(a.id) === String(id));
        return {
          id,
          asin: asin?.asin,
          title: asin?.title,
          guard: t?.summary?.moGuard,
          pct: Number.isFinite(t?.summary?.moDeltaPct) ? Number(t.summary.moDeltaPct.toFixed(1)) : 0,
          drivers: (t?.summary?.drivers || []).slice(0, 4),
          confidence: t?.summary?.confidence || 'low',
          stats: t?.summary?.stats || null,
        };
      }).filter(d => d.guard && d.guard !== 'stable');
      // Create a stable fingerprint based on essential fields
      const detailsForFp = details
        .map(d => ({ id: String(d.id), guard: d.guard, pct: Number(d.pct).toFixed(1), drv: (d.drivers||[]).slice(0,4).join('|') }))
        .sort((a,b) => (a.id + a.guard + a.pct + a.drv).localeCompare(b.id + b.guard + b.pct + b.drv));
      const countsObj = { better: better.length, worse: worse.length, stable: stable.length };
      const fingerprint = JSON.stringify({ counts: countsObj, details: detailsForFp });

      const payload = {
        ts: Date.now(),
        counts: countsObj,
        messages: topMessages,
        details,
        fingerprint,
      };
      localStorage.setItem('globalNotifications', JSON.stringify(payload));
      try { window.dispatchEvent(new Event('globalNotificationsUpdated')); } catch (_) {}
    } catch (_) {}
<<<<<<< HEAD
>>>>>>> 170550e (init: project baseline)
=======
>>>>>>> 420b2b9 (first commit)
    setIsLoading(false);
  }, [asins.map(a => a.id).join(',')]); // Depend on string of IDs

  useEffect(() => {
    calculateAsinTrends();
  }, [calculateAsinTrends]);

  return { trends, isLoading, refreshTrends: calculateAsinTrends };
};

export default useAsinTrends;