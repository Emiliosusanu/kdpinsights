import React from 'react';
<<<<<<< HEAD
import { motion } from 'framer-motion';
import { Star, TrendingUp, DollarSign, RefreshCcw, Trash2, Loader2, LineChart, Edit, BarChart2, Clock, BookOpen, Calendar, MessageCircle, PackageCheck, PackageX, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateSalesFromBsr, calculateIncome } from '@/lib/incomeCalculator';
import TrendIndicator from '@/components/TrendIndicator';
import BestsellerBadge from '@/components/BestsellerBadge';
=======
import { Star, TrendingUp, DollarSign, RefreshCcw, Trash2, Loader2, LineChart, Edit, BarChart2, Clock, BookOpen, Calendar, MessageCircle, PackageCheck, PackageX, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateSalesFromBsr, calculateIncome } from '@/lib/incomeCalculator';
import { estimateRoyalty } from '@/lib/royaltyEstimator';
import TrendIndicator from '@/components/TrendIndicator';
import BestsellerBadge from '@/components/BestsellerBadge';
import AsinAcosGuideModal from '@/components/AsinAcosGuideModal';
import CircularProgress from '@/components/ui/CircularProgress';
>>>>>>> 170550e (init: project baseline)

const AsinCard = ({ data, trend, onRefresh, onDelete, onShowChart, onEditRoyalty, onShowReviews, onShowLogs, isRefreshing }) => {
  const handleRefresh = (e) => {
    e.stopPropagation();
    if (onRefresh) onRefresh(data);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(data);
  };

  const handleShowChart = (e) => {
    e.stopPropagation();
    if (onShowChart) onShowChart(data);
  };
  
  const handleEditRoyalty = (e) => {
    e.stopPropagation();
    if (onEditRoyalty) onEditRoyalty(data);
  };

  const handleShowReviews = (e) => {
    e.stopPropagation();
    if (onShowReviews) onShowReviews(data);
  }

  const handleShowLogs = (e) => {
    e.stopPropagation();
    if (onShowLogs) onShowLogs(data);
  };

  const imageUrl = data.image_url && data.image_url !== '/placeholder.png' 
    ? data.image_url 
    : `https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800&auto=format&fit=crop`;

  const amazonLink = `https://www.amazon.${data.country || 'com'}/dp/${data.asin}`;

  const sales = calculateSalesFromBsr(data.bsr);
<<<<<<< HEAD
  const income = calculateIncome(sales, data.royalty);

  const formatIncomeRange = (range) => {
    if (range[0] === range[1]) {
      return `€${range[0].toFixed(2)}`;
    }
    return `€${range[0].toFixed(2)} - €${range[1].toFixed(2)}`;
=======
  const effectiveRoyalty = (data.royalty && data.royalty > 0) ? data.royalty : estimateRoyalty(data);
  const income = calculateIncome(sales, effectiveRoyalty);

  const formatIncomeRange = (range) => {
    if (range[0] === range[1]) {
      return `$${range[0].toFixed(2)}`;
    }
    return `$${range[0].toFixed(2)} - $${range[1].toFixed(2)}`;
>>>>>>> 170550e (init: project baseline)
  };
  
  const formatTimeAgo = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m ago`;
    return `${Math.floor(seconds)}s ago`;
  };

  const formatNumber = (num) => {
    if (typeof num !== 'number' || num === 0) return '—';
    return new Intl.NumberFormat('it-IT').format(num);
  };

<<<<<<< HEAD
=======
  // (Per-ASIN notification removed for a steadier layout)

>>>>>>> 170550e (init: project baseline)
// use backend availability_code
const availability = (data.availability_code || '').toUpperCase();
const inStock = availability === 'IN_STOCK';
const availabilityClass = inStock ? 'text-green-400' : 'text-red-400';
const AvailabilityIcon = inStock ? PackageCheck : PackageX;

<<<<<<< HEAD
  return (
    <motion.div
      layout
      whileHover={{ y: -8, scale: 1.03, boxShadow: '0 20px 30px -10px hsla(var(--primary), 0.2)' }}
      className="glass-card p-5 flex flex-col h-full group transition-all duration-300"
    >
      <div className="flex gap-4 mb-4">
        <a href={amazonLink} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 relative">
          <div className="relative w-24 h-36">
             {data.is_bestseller && <BestsellerBadge />}
             <img className="w-full h-full object-cover rounded-md shadow-md transition-transform duration-300 group-hover:scale-105" alt={`Copertina di ${data.title}`} src={imageUrl} />
=======
// break-even ACOS calculation
// breakEvenAcos = (royalty / price) * 100
const breakEvenAcos = (data.price > 0 && effectiveRoyalty > 0) ? (effectiveRoyalty / data.price) * 100 : null;

// Modal state
const [showAcosModal, setShowAcosModal] = React.useState(false);

// Persist ACOS modal across auto-refresh
const openAcosGuide = React.useCallback((e) => {
  if (e) {
    e.stopPropagation();
  }
  setShowAcosModal(true);
  try {
    localStorage.setItem('acosGuideOpen', JSON.stringify({ open: true, asin: data.asin, ts: Date.now() }));
  } catch (_) {}
}, [data.asin]);

const closeAcosGuide = React.useCallback(() => {
  setShowAcosModal(false);
  try {
    localStorage.removeItem('acosGuideOpen');
  } catch (_) {}
}, []);

React.useEffect(() => {
  try {
    const raw = localStorage.getItem('acosGuideOpen');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.open && parsed?.asin === data.asin) {
        setShowAcosModal(true);
      }
    }
  } catch (_) {}
  // Optional: sync across tabs
  const onStorage = (ev) => {
    if (ev.key === 'acosGuideOpen') {
      try {
        const p = ev.newValue ? JSON.parse(ev.newValue) : null;
        if (p?.open && p?.asin === data.asin) {
          setShowAcosModal(true);
        } else {
          setShowAcosModal(false);
        }
      } catch (_) {}
    }
  };
  window.addEventListener('storage', onStorage);
  return () => window.removeEventListener('storage', onStorage);
}, [data.asin]);

 // Mouse-follow glow (steady, no layout shift)
 const cardRef = React.useRef(null);
 const [glowActive, setGlowActive] = React.useState(false);
 const handleMouseMove = React.useCallback((e) => {
   const el = cardRef.current;
   if (!el) return;
   const rect = el.getBoundingClientRect();
   const x = e.clientX - rect.left;
   const y = e.clientY - rect.top;
   el.style.setProperty('--mx', `${x}px`);
   el.style.setProperty('--my', `${y}px`);
 }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setGlowActive(true)}
      onMouseLeave={() => setGlowActive(false)}
      className="relative glass-card p-5 flex flex-col h-full group transition-shadow duration-200 md:hover:shadow-lg"
      style={{
        // provide safe defaults for CSS vars
        '--mx': '50%',
        '--my': '50%',
        contain: 'paint',
        willChange: 'box-shadow'
      }}
    >
      {/* mouse-follow light, fully non-interactive and solid */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-150 hidden md:block ${glowActive ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: 'radial-gradient(160px circle at var(--mx) var(--my), rgba(255,255,255,0.07), transparent 70%)'
        }}
      />
      <div className="flex gap-4 mb-4">
        <a href={amazonLink} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 relative group/cover">
          {data.is_bestseller && (
            <div className="absolute -left-2 -top-2 z-10">
              <BestsellerBadge />
            </div>
          )}
          <div className="relative w-24 h-36 overflow-hidden rounded-md">
             {/* progress indicator (scraper update) */}
             {isRefreshing && (
               <div className="absolute top-1 right-1 z-10">
                 <CircularProgress size={22} thickness={2} />
               </div>
             )}
             {isRefreshing && (
               <div
                 aria-hidden="true"
                 className="pointer-events-none absolute -inset-1 rounded-[10px] animate-spin"
                 style={{
                   animationDuration: '1.6s',
                   background: 'conic-gradient(from 0deg, rgba(16,185,129,0.5), rgba(59,130,246,0.5), rgba(16,185,129,0.5))',
                   WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))',
                   mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))'
                 }}
               />
             )}
             <img className="w-full h-full object-cover shadow-md transform-gpu transition duration-200 md:group-hover/cover:brightness-110 md:group-hover/cover:shadow-[0_0_18px_rgba(255,255,255,0.25)]" alt={`Copertina di ${data.title}`} src={imageUrl} loading="lazy" decoding="async" />
>>>>>>> 170550e (init: project baseline)
          </div>
        </a>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground line-clamp-2">{data.title || 'Titolo non disponibile'}</h3>
          <p className="text-sm text-muted-foreground mb-1">{data.author || 'Autore non disponibile'}</p>
          <p className="text-xs text-muted-foreground/70">ASIN: {data.asin}</p>
          <div className={`flex items-center gap-1.5 text-xs mt-1 ${availabilityClass}`}>
  <AvailabilityIcon className="w-3.5 h-3.5" />
  <span className="font-semibold">{data.stock_status || 'Sconosciuto'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-4 flex-grow">
        <div className="flex items-center justify-between gap-2 bg-muted/50 p-2 rounded-lg">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <div>
              <p className="text-muted-foreground">Prezzo</p>
<<<<<<< HEAD
              <p className="font-semibold text-foreground">{data.price > 0 ? `€${data.price.toFixed(2)}` : '—'}</p>
=======
              <p className="font-semibold text-foreground">{data.price > 0 ? `$${data.price.toFixed(2)}` : '—'}</p>
>>>>>>> 170550e (init: project baseline)
            </div>
          </div>
           <TrendIndicator trend={trend?.price} />
        </div>
        <div className="flex items-center justify-between gap-2 bg-muted/50 p-2 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-secondary" />
            <div>
              <p className="text-muted-foreground">BSR</p>
              <p className="font-semibold text-foreground">{formatNumber(data.bsr)}</p>
            </div>
          </div>
          <TrendIndicator trend={trend?.bsr} />
        </div>
<<<<<<< HEAD
        <div className="flex items-center justify-between gap-2 bg-muted/50 p-2 rounded-lg col-span-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <div>
              <p className="text-muted-foreground">Recensioni</p>
              <p className="font-semibold text-foreground">{data.rating ? `${data.rating}/5 (${formatNumber(data.review_count)})` : '—'}</p>
            </div>
          </div>
          <TrendIndicator trend={trend?.reviews} />
=======
        <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg col-span-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:gap-4 w-full">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-semibold text-foreground text-sm sm:text-base leading-tight min-w-0">
                {data.rating ? (
                  <>
                    <span className="sm:hidden">{`${data.rating}/5 (${new Intl.NumberFormat('it-IT', { notation: 'compact', maximumFractionDigits: 1 }).format(data.review_count || 0)})`}</span>
                    <span className="hidden sm:inline">{`${data.rating}/5 (${formatNumber(data.review_count)})`}</span>
                  </>
                ) : '—'}
              </span>
              <TrendIndicator trend={trend?.reviews} small />
            </div>
            <div
              className="flex items-center gap-1.5 justify-end flex-shrink-0 cursor-pointer hover:opacity-90 focus:outline-none focus:ring-1 focus:ring-border/50 rounded-md px-1 py-0.5"
              role="button"
              tabIndex={0}
              onClick={openAcosGuide}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  openAcosGuide();
                }
              }}
            >
              <div className="text-right leading-tight">
                <p className="text-muted-foreground text-[11px] sm:text-xs">
                  <span className="hidden sm:inline">BE ACOS</span>
                  <span className="sm:hidden inline">BE</span>
                </p>
                <p className="font-semibold text-foreground text-xs sm:text-sm">{breakEvenAcos != null ? `${breakEvenAcos.toFixed(1)}%` : '—'}</p>
              </div>
              <TrendIndicator trend={trend?.acos} small />
            </div>
          </div>
>>>>>>> 170550e (init: project baseline)
        </div>
        
        {data.page_count > 0 && (
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <div>
                    <p className="text-muted-foreground">Pagine</p>
                    <p className="font-semibold text-foreground">{data.page_count}</p>
                </div>
            </div>
        )}

        {data.publication_date && (
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <div>
                    <p className="text-muted-foreground">Pubblicato</p>
                    <p className="font-semibold text-foreground">{new Date(data.publication_date).toLocaleDateString('it-IT')}</p>
                </div>
            </div>
        )}
        
        <div className="flex items-center justify-between gap-2 bg-muted/50 p-2 rounded-lg col-span-2">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-accent" />
            <div>
              <p className="text-muted-foreground">Guadagno Stimato (Mese)</p>
<<<<<<< HEAD
              <p className="font-semibold text-foreground">{data.royalty > 0 ? formatIncomeRange(income.monthly) : 'Imposta royalty'}</p>
=======
              <p className="font-semibold text-foreground">{formatIncomeRange(income.monthly)}</p>
>>>>>>> 170550e (init: project baseline)
            </div>
          </div>
          <TrendIndicator trend={trend?.income} />
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-border/20">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3"/>
          <span>{formatTimeAgo(data.updated_at) || 'Mai'}</span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button onClick={handleRefresh} size="icon" variant="ghost" className="w-8 h-8" disabled={isRefreshing}>
              {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
            </Button>
            <Button onClick={handleShowLogs} size="icon" variant="ghost" className="w-8 h-8">
              <History className="w-4 h-4" />
            </Button>
            <Button onClick={handleShowReviews} size="icon" variant="ghost" className="w-8 h-8">
              <MessageCircle className="w-4 h-4" />
            </Button>
            <Button onClick={handleEditRoyalty} size="icon" variant="ghost" className="w-8 h-8">
              <Edit className="w-4 h-4" />
            </Button>
            <Button onClick={handleShowChart} size="icon" variant="ghost" className="w-8 h-8">
              <LineChart className="w-4 h-4" />
            </Button>
            <Button onClick={handleDelete} size="icon" variant="ghost" className="w-8 h-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4" />
            </Button>
        </div>
      </div>
<<<<<<< HEAD
    </motion.div>
  );
};

export default AsinCard;
=======
      <AsinAcosGuideModal
        asinData={data}
        breakEvenAcos={breakEvenAcos}
        isOpen={showAcosModal}
        onClose={closeAcosGuide}
      />
    </div>
  );
};

export default AsinCard;
>>>>>>> 170550e (init: project baseline)
