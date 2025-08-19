import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, DollarSign, RefreshCcw, Trash2, Loader2, LineChart, Edit, BarChart2, Clock, BookOpen, Calendar, MessageCircle, PackageCheck, PackageX, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateSalesFromBsr, calculateIncome } from '@/lib/incomeCalculator';
import TrendIndicator from '@/components/TrendIndicator';
import BestsellerBadge from '@/components/BestsellerBadge';

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
  const income = calculateIncome(sales, data.royalty);

  const formatIncomeRange = (range) => {
    if (range[0] === range[1]) {
      return `€${range[0].toFixed(2)}`;
    }
    return `€${range[0].toFixed(2)} - €${range[1].toFixed(2)}`;
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

  const isAvailable = data.stock_status && (data.stock_status.toLowerCase().includes('in stock') || data.stock_status.toLowerCase().includes('disponibile'));

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
          </div>
        </a>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground line-clamp-2">{data.title || 'Titolo non disponibile'}</h3>
          <p className="text-sm text-muted-foreground mb-1">{data.author || 'Autore non disponibile'}</p>
          <p className="text-xs text-muted-foreground/70">ASIN: {data.asin}</p>
          <div className={`flex items-center gap-1.5 text-xs mt-1 ${isAvailable ? 'text-green-400' : 'text-orange-400'}`}>
            {isAvailable ? <PackageCheck className="w-3.5 h-3.5" /> : <PackageX className="w-3.5 h-3.5" />}
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
              <p className="font-semibold text-foreground">{data.price > 0 ? `€${data.price.toFixed(2)}` : '—'}</p>
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
        <div className="flex items-center justify-between gap-2 bg-muted/50 p-2 rounded-lg col-span-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <div>
              <p className="text-muted-foreground">Recensioni</p>
              <p className="font-semibold text-foreground">{data.rating ? `${data.rating}/5 (${formatNumber(data.review_count)})` : '—'}</p>
            </div>
          </div>
          <TrendIndicator trend={trend?.reviews} />
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
              <p className="font-semibold text-foreground">{data.royalty > 0 ? formatIncomeRange(income.monthly) : 'Imposta royalty'}</p>
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
    </motion.div>
  );
};

export default AsinCard;