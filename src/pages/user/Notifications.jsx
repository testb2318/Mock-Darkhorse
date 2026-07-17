import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserNotifications } from '../../redux/notificationSlice';
import { selectUser } from '../../redux/authSlice';
import { 
  X, 
  Bell, 
  Info, 
  AlertTriangle, 
  AlertCircle,
  CheckCircle,
  Mail,
  Clock,
  Trash2,
  BellRing,
  Eye,
  CheckCheck
} from 'lucide-react';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notifications);
  const auth = useSelector(selectUser);
  const [visibleNotifications, setVisibleNotifications] = useState([]);
  const [showClearAll, setShowClearAll] = useState(false);
  const [removingIds, setRemovingIds] = useState([]);

  useEffect(() => {
    if (auth?.id) {
      dispatch(getUserNotifications(auth.id));
    }
  }, [dispatch, auth?.id]);

  useEffect(() => {
    if (notifications?.length > 0) {
      setVisibleNotifications(notifications.filter(item => item.type === "notification"));
      setShowClearAll(true);
    }
  }, [notifications]);

  const getAlertStyle = (type) => {
    switch (type) {
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-gold-dark/10 to-gold-light/5',
          border: 'border-l-4 border-gold-medium',
          text: 'text-gold-light',
          iconBg: 'bg-gold-medium/10',
          icon: <Info className="w-5 h-5 text-gold-light" />,
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-500/10 to-amber-600/5',
          border: 'border-l-4 border-amber-500',
          text: 'text-amber-400',
          iconBg: 'bg-amber-500/10',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        };
      case 'danger':
        return {
          bg: 'bg-gradient-to-r from-red-600/10 to-red-700/5',
          border: 'border-l-4 border-red-500',
          text: 'text-red-400',
          iconBg: 'bg-red-500/10',
          icon: <AlertCircle className="w-5 h-5 text-red-400" />,
        };
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/5',
          border: 'border-l-4 border-emerald-500',
          text: 'text-emerald-400',
          iconBg: 'bg-emerald-500/10',
          icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-slate-500/10 to-slate-600/5',
          border: 'border-l-4 border-slate-500',
          text: 'text-slate-400',
          iconBg: 'bg-slate-500/10',
          icon: <Bell className="w-5 h-5 text-slate-400" />,
        };
    }
  };

  const removeNotification = (id) => {
    setRemovingIds(prev => [...prev, id]);
    setTimeout(() => {
      setVisibleNotifications(prev => prev.filter(notif => notif.id !== id));
      setRemovingIds(prev => prev.filter(rid => rid !== id));
    }, 300);
  };

  const clearAllNotifications = () => {
    const allIds = visibleNotifications.map(n => n.id);
    setRemovingIds(allIds);
    setTimeout(() => {
      setVisibleNotifications([]);
      setShowClearAll(false);
      setRemovingIds([]);
    }, 300);
  };

  const getTimeAgo = (date) => {
    if (!date) return 'Just now';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }
    return 'Just now';
  };

  const animationStyles = `
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(100px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOutRight {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(100px); }
    }
    @keyframes shrinkWidth {
      from { width: 100%; }
      to { width: 0%; }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes glowPulse {
      0%, 100% { box-shadow: 0 0 5px rgba(212,175,55,0.3); }
      50% { box-shadow: 0 0 20px rgba(212,175,55,0.6); }
    }
    @keyframes pulse-slow {
      0%, 100% { opacity: 0.2; }
      50% { opacity: 0.5; }
    }
    .animate-glow { animation: glowPulse 2s ease-in-out infinite; }
    .animate-spin-slow { animation: spin 1.5s linear infinite; }
    .animate-shrink-width { animation: shrinkWidth 5s linear forwards; }
    .animate-slide-in-right { animation: slideInRight 0.4s ease-out forwards; }
    .animate-slide-out-right { animation: slideOutRight 0.3s ease-out forwards; }
    .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
  `;

  if (loading) {
    return (
      <>
        <style>{animationStyles}</style>
        <div className="min-h-screen flex items-center justify-center bg-transparent">
          <div className="text-center">
            <div className="inline-block rounded-full h-16 w-16 border-4 border-gold-medium border-t-transparent animate-spin-slow"></div>
            <p className="mt-4 text-gold-light font-medium tracking-wide">Loading alerts...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{animationStyles}</style>
      
      <section className="min-h-screen bg-transparent py-8 px-4 relative overflow-hidden text-slate-200">
        {/* Animated Background Orbs (Gold Theme) */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold-medium/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-light/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gold-medium/20 rounded-full blur-xl animate-pulse-slow"></div>
                  <div className="relative w-14 h-14 bg-black/40 rounded-full flex items-center justify-center border border-gold-medium/30 animate-glow">
                    <BellRing className="w-7 h-7 text-gold-medium" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white font-display uppercase tracking-wider">
                    Notifications
                  </h1>
                  <p className="text-slate-400 text-sm mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Latest account activities
                  </p>
                </div>
              </div>
              
              {showClearAll && visibleNotifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all border border-red-500/20 active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-bold uppercase tracking-tighter">Clear All</span>
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {visibleNotifications.length > 0 ? (
              visibleNotifications.map((notification, index) => {
                const { id, title, message, type, createdAt } = notification;
                const style = getAlertStyle(type);
                const isRemoving = removingIds.includes(id);
                
                return (
                  <div
                    key={id}
                    className={`group relative transform transition-all duration-300 ${isRemoving ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Main Card */}
                    <div className={`glass-card animated-border-gold relative rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.05)] transition-all p-0.5`}>
                      <div className={`p-5 flex items-start justify-between gap-4 bg-black/40 rounded-[15px]`}>
                        <div className="flex items-start gap-4 flex-1 relative z-10">
                          {/* Icon Container */}
                          <div className={`${style.iconBg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/5`}>
                            {style.icon}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className={`font-bold ${style.text} text-lg tracking-tight`}>
                                {title}
                              </h3>
                                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-gold-medium/20">
                                  <Clock className="w-3 h-3" />
                                  {getTimeAgo(createdAt)}
                                </span>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed mb-4">
                              {message}
                            </p>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <button className="text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg bg-gradient-to-r from-gold-dark to-gold-light text-black hover:opacity-90 transition-all flex items-center gap-2">
                                <Eye className="w-3.5 h-3.5" />
                                Details
                              </button>
                              <button className="text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg bg-black/60 hover:bg-black text-slate-300 transition-all flex items-center gap-2 border border-gold-medium/30">
                                <CheckCheck className="w-3.5 h-3.5" />
                                Done
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeNotification(id)}
                          className="text-slate-500 hover:text-white transition-colors p-1"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Animated Progress Bar (Timer feel) */}
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-medium/30 rounded-b-[15px] z-10">
                        <div className="h-full bg-gold-light animate-shrink-width origin-left"></div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-20 glass-card animated-border-gold rounded-3xl p-1">
                <div className="bg-black/40 rounded-[1.8rem] py-20 border-b border-gold-medium/20">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold-medium/10 flex items-center justify-center border border-gold-medium/20">
                    <Bell className="w-10 h-10 text-gold-medium" />
                  </div>
                  <h3 className="text-xl font-bold text-white font-display uppercase tracking-wider">Inbox is empty</h3>
                  <p className="text-slate-400 text-sm mt-2">
                    No new notifications to show right now.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer Badge */}
          {visibleNotifications.length > 0 && (
            <div className="mt-8 text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-gold-medium/40">
                <Mail className="w-3.5 h-3.5 text-gold-light" />
                <span className="text-xs font-semibold text-gold-medium uppercase tracking-widest">
                  {visibleNotifications.length} Active Alerts
                </span>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Notifications;