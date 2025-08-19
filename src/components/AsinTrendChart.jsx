import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DateRangePicker from '@/components/DateRangePicker';
import { addDays, format } from 'date-fns';

const AsinTrendChart = ({ asinData, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -60),
    to: new Date(),
  });

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      
      let query = supabase
        .from('asin_history')
        .select('created_at, bsr, review_count')
        .eq('asin_data_id', asinData.id);

      if (dateRange?.from) {
        query = query.gte('created_at', dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        query = query.lte('created_at', dateRange.to.toISOString());
      }

      query = query.order('created_at', { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching history:', error);
      } else {
        const formattedData = data.map(item => ({
          date: new Date(item.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }),
          BSR: item.bsr,
          Recensioni: item.review_count,
        }));
        setHistory(formattedData);
      }
      setLoading(false);
    };

    if (asinData) {
      fetchHistory();
    }
  }, [asinData, dateRange]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{asinData.title}</h2>
              <p className="text-gray-400">Andamento storico</p>
            </div>
            <Button onClick={onClose} size="icon" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="mb-4">
            <DateRangePicker date={dateRange} setDate={setDateRange} />
          </div>

          <div className="flex-grow">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </div>
            ) : history.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.5)" />
                  <YAxis yAxisId="left" stroke="#82ca9d" orientation="left" label={{ value: 'BSR', angle: -90, position: 'insideLeft', fill: '#82ca9d' }} reversed={true} />
                  <YAxis yAxisId="right" stroke="#8884d8" orientation="right" label={{ value: 'Recensioni', angle: -90, position: 'insideRight', fill: '#8884d8' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.8)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: '#fff'
                    }}
                    formatter={(value, name) => [value.toLocaleString('it-IT'), name]}
                  />
                  <Legend wrapperStyle={{ color: '#fff' }} />
                  <Line yAxisId="left" type="monotone" dataKey="BSR" stroke="#82ca9d" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                  <Line yAxisId="right" type="monotone" dataKey="Recensioni" stroke="#8884d8" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Dati storici insufficienti per generare un grafico.
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AsinTrendChart;