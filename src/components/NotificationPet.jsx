import React from 'react';
import GlobalNotificationsBell from '@/components/GlobalNotificationsBell';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const loadPayload = () => {
  try {
    const raw = localStorage.getItem('globalNotifications');
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
};

const pad2 = (n) => String(n).padStart(2, '0');
const fmtYMD = (d) => `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
const fmtEUR = (v) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(Math.max(0, Number(v) || 0));

function computePayoutForMonth(year, month) {
  const lastDay = new Date(year, month + 1, 0).getDate();
  let payoutDate = new Date(year, month, Math.min(29, lastDay));
  const wd = payoutDate.getDay();
  if (wd === 6) payoutDate.setDate(payoutDate.getDate() + 2);
  else if (wd === 0) payoutDate.setDate(payoutDate.getDate() + 1);
  return payoutDate;
}

const NotificationPet = () => {
  const { user } = useAuth();
  const [payload, setPayload] = React.useState(() => loadPayload());
  const [ackTs, setAckTs] = React.useState(() => {
    try { return Number(localStorage.getItem('globalNotificationsAckTs')) || 0; } catch (_) { return 0; }
  });
  const [ackFp, setAckFp] = React.useState(() => {
    try { return localStorage.getItem('globalNotificationsAckFp') || ''; } catch (_) { return ''; }
  });
  // Removed greeting animations for a solid, non-flashing UI

  const counts = payload?.counts || { better: 0, worse: 0, stable: 0 };
  const sentiment = React.useMemo(() => {
    if (!payload) return 'neutral';
    if ((counts.better || 0) === 0 && (counts.worse || 0) === 0) return 'neutral';
    if ((counts.worse || 0) > (counts.better || 0)) return 'bad';
    if ((counts.better || 0) >= (counts.worse || 0)) return 'good';
    return 'neutral';
  }, [payload, counts.better, counts.worse]);

  const shouldShow = React.useMemo(() => {
    const importantCount = (payload?.counts?.better || 0) + (payload?.counts?.worse || 0);
    if (!importantCount) return false;
    const fp = payload?.fingerprint;
    if (fp) return fp !== ackFp;
    const ts = payload?.ts || 0;
    return ts > ackTs;
  }, [payload, ackTs, ackFp]);

  React.useEffect(() => {
    const onStorage = (ev) => {
      if (ev.key === 'globalNotifications') {
        setPayload(loadPayload());
      }
      if (ev.key === 'globalNotificationsAckTs' || ev.key === 'globalNotificationsAckFp') {
        try {
          setAckTs(Number(localStorage.getItem('globalNotificationsAckTs')) || 0);
          setAckFp(localStorage.getItem('globalNotificationsAckFp') || '');
        } catch (_) {}
      }
    };
    const onUpdated = () => setPayload(loadPayload());
    const onAckChanged = () => {
      try {
        setAckTs(Number(localStorage.getItem('globalNotificationsAckTs')) || 0);
        setAckFp(localStorage.getItem('globalNotificationsAckFp') || '');
      } catch (_) {}
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('globalNotificationsUpdated', onUpdated);
    window.addEventListener('globalNotificationsAckChanged', onAckChanged);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('globalNotificationsUpdated', onUpdated);
      window.removeEventListener('globalNotificationsAckChanged', onAckChanged);
    };
  }, []);

  // Payout-day celebration state
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const payoutDate = computePayoutForMonth(y, m);
  const isPayoutDay = today.toDateString() === payoutDate.toDateString();
  const target = new Date(y, m - 2, 1);
  const targetKey = `${target.getFullYear()}-${pad2(target.getMonth()+1)}`;
  const [payoutTotal, setPayoutTotal] = React.useState(null);
<<<<<<< HEAD
=======
  const [showBubble, setShowBubble] = React.useState(false);
>>>>>>> 420b2b9 (first commit)
  const [quoteIdx, setQuoteIdx] = React.useState(0);
  const quotes = React.useMemo(() => [
    'La costanza batte il talento quando il talento non è costante.',
    'Un libro alla volta, un giorno alla volta.',
    'Numeri veri, risultati veri. Avanti tutta!',
    'Le piccole azioni quotidiane costruiscono grandi risultati.',
    'Continua a scrivere: il successo ama la disciplina.',
  ], []);

  // Month-to-date (MTD) talking mode
  const curKey = `${y}-${pad2(m+1)}`;
  const [mtdEUR, setMtdEUR] = React.useState(null);
  const GOAL = 10000;
  const talkPool = React.useMemo(() => [
    'Finora questo mese: {mtd} — puntiamo a {goal}!',
    'Siamo a {pct}% dell’obiettivo. Avanti così!',
    'Ogni pagina conta. {mtd} questo mese, focus su {goal}!',
    'Momentum in costruzione: {mtd}. Acceleriamo verso {goal}!',
    'Ottimo inizio ({mtd}), ma non basta: obiettivo {goal}.',
    'Passi brevi ogni giorno portano lontano. {mtd} finora.',
    'Stringiamo le viti: {mtd} non è abbastanza, miriamo a {goal}.',
    'Dati alla mano: {mtd} MTD. Prossimo step: strategie per {goal}.',
    'La disciplina batte la motivazione: {mtd} → {goal}.',
    'Ogni recensione aiuta. {mtd} MTD: spingiamo ancora.',
    'Sei più vicino di quanto pensi. {mtd} → target {goal}.',
    'Niente scuse, solo azione. {mtd} finora.',
    'Micro-ottimizzazioni, macro-risultati: {mtd} → {goal}.',
    'Continuità quotidiana: {mtd} MTD. Alziamo l’asticella.',
    'Finestra mobile: {mtd} — mantieni il ritmo verso {goal}.',
    'Bravo! {mtd} finora. Ora sprint verso {goal}.',
    'Non mollare: {mtd} è un checkpoint, non il traguardo.',
    'Focalizzati: {mtd} MTD. Prossimo milestone: {goal}.',
    'Strategia > fortuna. {mtd} oggi, rotta su {goal}.',
    'Siamo in corsa. {mtd} MTD: spingi per {goal}!' 
  ], []);

  const loadMtdEUR = React.useCallback(async () => {
    // Prefer data persisted by PayoutWidget (already converted to EUR)
    try {
      const raw = localStorage.getItem('payoutWidgetRows');
      if (raw) {
        const rows = JSON.parse(raw);
        const row = Array.isArray(rows) ? rows.find(r => r?.key === curKey) : null;
        if (row && typeof row.totalEUR === 'number') {
          setMtdEUR(row.totalEUR);
          return;
        }
      }
    } catch (_) {}
    // Fallback: EUR-only query for current month
    try {
      if (!user) return;
      const from = new Date(y, m, 1);
      const to = new Date(y, m + 1, 1);
      const { data, error } = await supabase
        .from('kdp_entries')
        .select('income')
        .eq('user_id', user.id)
        .eq('income_currency', 'EUR')
        .gte('date', fmtYMD(from))
        .lt('date', fmtYMD(to));
      if (error) throw error;
      const sum = (data || []).reduce((acc, r) => acc + (parseFloat(r.income || 0) || 0), 0);
      setMtdEUR(sum);
    } catch (_) {}
  }, [curKey, user?.id, y, m]);

  // Try reading the total from PayoutWidget (localStorage). Fallback to Supabase EUR-only.
  const loadPayoutTotal = React.useCallback(async () => {
    try {
      const raw = localStorage.getItem('payoutWidgetRows');
      if (raw) {
        const rows = JSON.parse(raw);
        const row = Array.isArray(rows) ? rows.find(r => r?.key === targetKey) : null;
        if (row && typeof row.totalEUR === 'number') {
          setPayoutTotal(row.totalEUR);
          return;
        }
      }
    } catch (_) {}
    // Fallback: EUR only
    try {
      if (!user) return;
      const from = new Date(target.getFullYear(), target.getMonth(), 1);
      const to = new Date(target.getFullYear(), target.getMonth() + 1, 1);
      const { data, error } = await supabase
        .from('kdp_entries')
        .select('income')
        .eq('user_id', user.id)
        .eq('income_currency', 'EUR')
        .gte('date', fmtYMD(from))
        .lt('date', fmtYMD(to));
      if (error) throw error;
      const sum = (data || []).reduce((acc, r) => acc + (parseFloat(r.income || 0) || 0), 0);
      setPayoutTotal(sum);
    } catch (_) {}
  }, [targetKey, target, user?.id]);

  React.useEffect(() => {
    if (!isPayoutDay) return;
    loadPayoutTotal();
    const onUpdated = () => loadPayoutTotal();
    window.addEventListener('payoutWidgetRowsUpdated', onUpdated);
    window.addEventListener('storage', onUpdated);
    return () => {
      window.removeEventListener('payoutWidgetRowsUpdated', onUpdated);
      window.removeEventListener('storage', onUpdated);
    };
  }, [isPayoutDay, loadPayoutTotal]);

  // Load MTD on mount and when rows update
  React.useEffect(() => {
    loadMtdEUR();
    const onUpdated = () => loadMtdEUR();
    window.addEventListener('payoutWidgetRowsUpdated', onUpdated);
    window.addEventListener('storage', onUpdated);
    return () => {
      window.removeEventListener('payoutWidgetRowsUpdated', onUpdated);
      window.removeEventListener('storage', onUpdated);
    };
  }, [loadMtdEUR]);

  React.useEffect(() => {
    if (!isPayoutDay) return;
    const id = setInterval(() => setQuoteIdx(i => (i + 1) % quotes.length), 300000); // 5 min
    return () => clearInterval(id);
  }, [isPayoutDay, quotes.length]);

<<<<<<< HEAD
  // Rotate talk messages on non-payout days when MTD is available
  React.useEffect(() => {
    if (isPayoutDay) return; // handled by payout-day rotator
    if (mtdEUR == null) return;
    const id = setInterval(() => setQuoteIdx(i => (i + 1) % talkPool.length), 600000); // 10 min
    return () => clearInterval(id);
  }, [isPayoutDay, mtdEUR, talkPool.length]);

=======
  // Ephemeral message scheduler on regular days: 10–15 random messages/day, 10–15s display, 10–15 min apart
  const timersRef = React.useRef({ show: null, hide: null });
  const clearTimers = React.useCallback(() => {
    if (timersRef.current.show) { clearTimeout(timersRef.current.show); timersRef.current.show = null; }
    if (timersRef.current.hide) { clearTimeout(timersRef.current.hide); timersRef.current.hide = null; }
  }, []);

  const scheduleNextMessage = React.useCallback(() => {
    if (isPayoutDay) return; // payout day handled separately
    if (mtdEUR == null) return; // need data to talk
    const todayKey = fmtYMD(new Date());
    let count = 0;
    try { count = Number(localStorage.getItem(`petMsgCount:${todayKey}`)) || 0; } catch (_) {}
    if (count >= 15) return; // daily cap
    const delay = 600000 + Math.floor(Math.random() * 300000); // 10–15 min
    timersRef.current.show = setTimeout(() => {
      // pick a random message index, avoid immediate repeat
      setQuoteIdx((prev) => {
        if (talkPool.length <= 1) return 0;
        let idx = Math.floor(Math.random() * talkPool.length);
        if (idx === prev) idx = (idx + 1) % talkPool.length;
        return idx;
      });
      setShowBubble(true);
      try { localStorage.setItem(`petMsgCount:${todayKey}`, String(count + 1)); } catch (_) {}
      const displayMs = 10000 + Math.floor(Math.random() * 5000); // 10–15s
      timersRef.current.hide = setTimeout(() => {
        setShowBubble(false);
        scheduleNextMessage(); // chain
      }, displayMs);
    }, delay);
  }, [isPayoutDay, mtdEUR, talkPool.length]);

  // Kick off scheduler when MTD becomes available and not payout day
  React.useEffect(() => {
    if (isPayoutDay) { clearTimers(); setShowBubble(false); return; }
    if (mtdEUR == null) return;
    // initial gentle delay (3–6s) before first message
    const initialDelay = 3000 + Math.floor(Math.random() * 3000);
    timersRef.current.show = setTimeout(() => {
      // immediate show first message, then schedule next
      setQuoteIdx((prev) => (prev + 1) % (talkPool.length || 1));
      setShowBubble(true);
      const todayKey = fmtYMD(new Date());
      try {
        const c = Number(localStorage.getItem(`petMsgCount:${todayKey}`)) || 0;
        localStorage.setItem(`petMsgCount:${todayKey}`, String(Math.min(15, c + 1)));
      } catch (_) {}
      const displayMs = 10000 + Math.floor(Math.random() * 5000);
      timersRef.current.hide = setTimeout(() => {
        setShowBubble(false);
        scheduleNextMessage();
      }, displayMs);
    }, initialDelay);
    return () => clearTimers();
  }, [isPayoutDay, mtdEUR, talkPool.length, scheduleNextMessage, clearTimers]);

>>>>>>> 420b2b9 (first commit)
  // Show pet on payout day or when MTD message is available even without new notifications
  if (!shouldShow && !isPayoutDay && mtdEUR == null) return null;

  return (
    <div className="fixed right-4 bottom-24 lg:bottom-8 z-50">
      <style>{`
        @keyframes petDance { 0% { transform: translateY(0) rotate(0deg);} 25% { transform: translateY(-2px) rotate(3deg);} 50% { transform: translateY(0) rotate(0deg);} 75% { transform: translateY(-2px) rotate(-3deg);} 100% { transform: translateY(0) rotate(0deg);} }
<<<<<<< HEAD
      `}</style>
      <div className={`relative ${isPayoutDay ? '[animation:petDance_1.8s_ease-in-out_infinite] transform-gpu' : ''}`} style={isPayoutDay ? { willChange: 'transform' } : undefined}>
=======
        @keyframes petBreathe { 0% { transform: translateY(0) rotate(0deg);} 50% { transform: translateY(-1px) rotate(0.4deg);} 100% { transform: translateY(0) rotate(0deg);} }
        @media (prefers-reduced-motion: reduce) { .pet-anim { animation: none !important; } }
      `}</style>
      <div className={`relative pet-anim ${isPayoutDay ? '[animation:petDance_1.8s_ease-in-out_infinite]' : '[animation:petBreathe_8s_ease-in-out_infinite]'} transform-gpu`} style={{ willChange: 'transform' }}>
>>>>>>> 420b2b9 (first commit)
        <GlobalNotificationsBell />
        {isPayoutDay ? (
          <div className="absolute -top-3 right-14 w-72 bg-slate-900 text-slate-100 border border-slate-700 rounded-xl p-3 shadow-xl">
            <p className="text-xs text-slate-300">Giorno di pagamento Amazon</p>
            <p className="text-sm font-semibold mt-1">{`Mese pagato: ${target.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}`}</p>
            <p className="text-sm mt-1">Totale: <span className="text-emerald-400 font-bold">{payoutTotal != null ? fmtEUR(payoutTotal) : '—'}</span></p>
            <p className="text-xs text-slate-300 mt-2 italic">“{quotes[quoteIdx]}”</p>
          </div>
<<<<<<< HEAD
        ) : (
=======
        ) : (showBubble && mtdEUR != null) ? (
>>>>>>> 420b2b9 (first commit)
          <div className="absolute -top-3 right-14 w-72 bg-slate-900 text-slate-100 border border-slate-700 rounded-xl p-3 shadow-xl">
            <p className="text-xs text-slate-300">Progresso del mese</p>
            <p className="text-sm mt-1">Fino ad oggi: <span className="text-emerald-400 font-bold">{mtdEUR != null ? fmtEUR(mtdEUR) : '—'}</span></p>
            {(() => {
              const pct = mtdEUR != null ? Math.min(100, Math.round((mtdEUR / GOAL) * 100)) : null;
              const msgTemplate = talkPool[quoteIdx % talkPool.length] || '';
              const msg = msgTemplate
                .replace('{mtd}', mtdEUR != null ? fmtEUR(mtdEUR) : '—')
                .replace('{goal}', fmtEUR(GOAL))
                .replace('{pct}', pct != null ? String(pct) : '—');
              return <p className="text-xs text-slate-300 mt-2 italic">“{msg}”</p>;
            })()}
          </div>
<<<<<<< HEAD
        )}
      </div>
    </div>
  );
};
=======
        ) : null}
      </div>
    </div>
  );
}
;
>>>>>>> 420b2b9 (first commit)

export default NotificationPet;
