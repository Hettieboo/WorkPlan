import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Phone, Euro, Users, Check, X } from 'lucide-react';

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Constants
  const HOURLY_RATE_GROSS = 13.08;
  const SOCIAL_CONTRIBUTION_RATE = 0.22;
  const HOURLY_RATE_NET = HOURLY_RATE_GROSS * (1 - SOCIAL_CONTRIBUTION_RATE);

  // Family data
  const families = {
    beery: {
      name: 'BEERY family',
      address: '35 BIS RUE MARCEL DASSAULT BOULOGNE BILLANCOURT',
      phones: {
        other: '06 24 16 01 17',
        mother: '06 61 58 78 43'
      },
      children: [
        { name: 'Jack', age: 6 },
        { name: 'Stella', age: 4 }
      ],
      status: 'Confirmed',
      schedule: [
        { day: 3, startHour: 10, startMin: 0, endHour: 19, endMin: 0 }
      ],
      weeklyHours: 9
    },
    barret: {
      name: 'BARRET family',
      address: '12 RUE DES BEAUMONTS FONTENAY SOUS BOIS',
      phones: {
        father: '06 60 72 24 73',
        mother: '06 04 08 21 73'
      },
      children: [
        { name: 'Julia', age: 3 },
        { name: 'Lewis', age: 6 }
      ],
      status: 'Not confirmed',
      schedule: [
        { day: 1, startHour: 17, startMin: 0, endHour: 19, endMin: 0 },
        { day: 2, startHour: 17, startMin: 0, endHour: 19, endMin: 0 },
        { day: 4, startHour: 17, startMin: 0, endHour: 19, endMin: 0 }
      ],
      weeklyHours: 6
    }
  };

  const getDayName = (dayNum) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNum];
  };

  const getTodaysGig = () => {
    const today = currentTime.getDay();
    
    for (const [key, family] of Object.entries(families)) {
      const todaySchedule = family.schedule.find(s => s.day === today);
      if (todaySchedule) {
        return { family, schedule: todaySchedule, familyKey: key };
      }
    }
    return null;
  };

  const isCurrentlyWorking = () => {
    const todaysGig = getTodaysGig();
    if (!todaysGig) return false;

    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = todaysGig.schedule.startHour * 60 + todaysGig.schedule.startMin;
    const endMinutes = todaysGig.schedule.endHour * 60 + todaysGig.schedule.endMin;

    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  };

  const formatTime = (hour, min) => {
    return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
  };

  const totalWeeklyHours = families.beery.weeklyHours + families.barret.weeklyHours;
  const weeklyGrossEarnings = totalWeeklyHours * HOURLY_RATE_GROSS;
  const weeklyNetEarnings = totalWeeklyHours * HOURLY_RATE_NET;
  const monthlyGrossEarnings = weeklyGrossEarnings * 4.33;
  const monthlyNetEarnings = weeklyNetEarnings * 4.33;

  const todaysGig = getTodaysGig();
  const isWorking = isCurrentlyWorking();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Schedule
              </h1>
              <p className="text-gray-600 mt-1">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </p>
            </div>
            {isWorking && (
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                <span className="font-semibold text-sm">Working Now</span>
              </div>
            )}
          </div>
        </div>

        {/* Today's Gig */}
        {todaysGig ? (
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex items-center mb-4">
              <Calendar className="mr-3" size={28} />
              <h2 className="text-2xl font-bold">Today's Assignment</h2>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <h3 className="text-2xl font-bold mb-4">{todaysGig.family.name}</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-lg">{todaysGig.family.address}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-3" size={20} />
                  <span className="text-xl font-bold">
                    {formatTime(todaysGig.schedule.startHour, todaysGig.schedule.startMin)} - {formatTime(todaysGig.schedule.endHour, todaysGig.schedule.endMin)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-3" size={20} />
                  <span className="text-lg">
                    {todaysGig.family.children.map(c => `${c.name} (${c.age}y)`).join(', ')}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-90">Today's earnings</span>
                    <span className="text-2xl font-bold">
                      €{((todaysGig.schedule.endHour - todaysGig.schedule.startHour) * HOURLY_RATE_NET).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6 text-center border border-gray-200">
            <Calendar className="mx-auto mb-4 text-gray-300" size={56} />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No assignment today</h2>
            <p className="text-gray-500">Enjoy your day off! 🎉</p>
          </div>
        )}

        {/* Earnings Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-emerald-100">
            <div className="flex items-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-xl mr-3">
                <Euro className="text-emerald-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Weekly</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-gray-600">Gross</span>
                <span className="text-xl font-bold text-emerald-700">€{weeklyGrossEarnings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-gray-600">Net</span>
                <span className="text-3xl font-bold text-emerald-800">€{weeklyNetEarnings.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500 mt-3 pt-3 border-t">
                {totalWeeklyHours} hours × €{HOURLY_RATE_GROSS}/hr
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-blue-100">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-xl mr-3">
                <Euro className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Monthly</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-gray-600">Gross</span>
                <span className="text-xl font-bold text-blue-700">€{monthlyGrossEarnings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-gray-600">Net</span>
                <span className="text-3xl font-bold text-blue-800">€{monthlyNetEarnings.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500 mt-3 pt-3 border-t">
                Based on 4.33 weeks/month
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-5">Weekly Schedule</h2>
          
          {Object.entries(families).map(([key, family]) => (
            <div key={key} className="mb-6 last:mb-0">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-purple-700">{family.name}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    family.status === 'Confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {family.status === 'Confirmed' ? <Check className="inline w-3 h-3 mr-1" /> : <X className="inline w-3 h-3 mr-1" />}
                    {family.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  {family.schedule.map((sched, idx) => {
                    const isToday = sched.day === currentTime.getDay();
                    return (
                      <div key={idx} className={`flex items-center justify-between p-3 rounded-lg transition ${
                        isToday 
                          ? 'bg-purple-600 text-white shadow-md' 
                          : 'bg-white text-gray-700'
                      }`}>
                        <span className="font-semibold">{getDayName(sched.day)}</span>
                        <span className={`font-bold ${isToday ? 'text-white' : 'text-purple-600'}`}>
                          {formatTime(sched.startHour, sched.startMin)} - {formatTime(sched.endHour, sched.endMin)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="text-sm text-gray-700 bg-white/50 rounded-lg p-3">
                  <span className="font-semibold">{family.weeklyHours}h/week</span>
                  <span className="mx-2">•</span>
                  <span className="font-semibold text-purple-700">€{(family.weeklyHours * HOURLY_RATE_NET).toFixed(2)} net/week</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Family Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(families).map(([key, family]) => (
            <div key={key} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{family.name}</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="mr-3 mt-1 text-gray-400 flex-shrink-0" size={18} />
                  <span className="text-sm text-gray-700">{family.address}</span>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Contact</p>
                  {Object.entries(family.phones).map(([type, phone]) => (
                    <div key={type} className="flex items-center text-sm mb-1 ml-7">
                      <Phone className="mr-2 text-gray-400" size={14} />
                      <span className="text-gray-700">
                        <span className="capitalize font-medium">{type}:</span> {phone}
                      </span>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Children</p>
                  <div className="ml-7 space-y-1">
                    {family.children.map((child, idx) => (
                      <div key={idx} className="text-sm text-gray-700">
                        <span className="font-medium">{child.name}</span>, {child.age} years old
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <p className="text-xs text-gray-600">
            <strong>Note:</strong> Net earnings calculated with 22% social contributions. Actual amounts may vary based on your CDD contract terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
