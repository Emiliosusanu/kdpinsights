import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, X, History, ShoppingCart, Star, BarChart, AlertTriangle, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const eventIcons = {
  ASIN_ADDED: <PlusCircle className="w-5 h-5 text-green-400" />,
  STOCK_STATUS_CHANGED: <ShoppingCart className="w-5 h-5 text-orange-400" />,
  REVIEW_COUNT_DROPPED: <AlertTriangle className="w-5 h-5 text-red-400" />,
  PRICE_CHANGED: <BarChart className="w-5 h-5 text-blue-400" />,
  BSR_CHANGED: <BarChart className="w-5 h-5 text-purple-400" />,
  default: <History className="w-5 h-5 text-gray-400" />,
};

const AsinEventLogModal = ({ asinData, isOpen, onClose }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!asinData) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from('asin_events')
        .select('*')
        .eq('asin_data_id', asinData.id)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data);
      }
      setIsLoading(false);
    };

    if (isOpen) {
      fetchEvents();
    }
  }, [isOpen, asinData]);

  const getEventIcon = (eventType) => {
    return eventIcons[eventType] || eventIcons.default;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Log Eventi - {asinData?.title}</DialogTitle>
          <DialogDescription>
            Visualizza gli eventi più recenti per questo ASIN.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto p-1 pr-4">
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : events.length > 0 ? (
            <div className="relative pl-8">
              <div className="absolute left-[15px] top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
              {events.map(event => (
                <div key={event.id} className="relative mb-6">
                  <div className="absolute -left-8 top-1.5 flex items-center justify-center w-8 h-8 bg-slate-800 rounded-full border-2 border-slate-700">
                    {getEventIcon(event.event_type)}
                  </div>
                  <div className="pl-4">
                    <p className="font-semibold text-foreground">{event.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(event.created_at).toLocaleString('it-IT')}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Nessun evento registrato per questo ASIN.</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Chiudi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AsinEventLogModal;