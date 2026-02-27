"use client";

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchUserChartData, resetToDefaultCharts } from '@/store/chartSlice';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useState } from 'react';
import UpdateDataModal from '../modals/UpdateDataModal';
import { setAuthModalOpen } from '@/store/authSlice';

export default function AnalyticsDashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const { callDuration, sadPathInner, sadPathOuter, isLoading } = useSelector(
        (state: RootState) => state.charts
    );

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    useEffect(() => {
        if (user?.id) {
          dispatch(fetchUserChartData(user.id));
        } else {
          dispatch(resetToDefaultCharts());
        }
      }, [user, dispatch]);
    

  return (
    <div className="w-full max-w-7xl 2xl:max-w-300 mx-auto p-6 space-y-6  ">


    {isLoading && (
        <div className="absolute inset-0 z-10 bg-[#0a0714]/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5CF6]"></div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Call Analytics</h2>

        {user ? (
          <button
            onClick={() => setIsUpdateModalOpen(true)}
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(139,92,246,0.2)]"
          >
            Edit Custom Data
          </button>
        )
        :
        <button
            onClick={() => {dispatch(setAuthModalOpen(true))}}
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(139,92,246,0.2)]"
          >
            Edit Custom Data
          </button>
    
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
      <div className="bg-[#eef2f6] rounded-2xl p-6 shadow-lg h-[400px] flex flex-col">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Call Duration Analysis</h3>
          <div className="flex-grow w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={callDuration} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5ea2d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#5ea2d8" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#333' }}
                />
                <Area type="monotone" dataKey="calls" stroke="#5ea2d8" strokeWidth={2} fillOpacity={1} fill="url(#colorCalls)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#eef2f6] rounded-2xl p-6 shadow-lg h-[400px] flex flex-col relative overflow-hidden">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Sad Path Analysis</h3>
          <div className="flex-grow w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                
                <Pie data={sadPathInner} dataKey="value" cx="50%" cy="50%" innerRadius="35%" outerRadius="55%" stroke="#eef2f6" strokeWidth={2} isAnimationActive={true}>
                  {sadPathInner.map((entry, index) => <Cell key={`inner-${index}`} fill={entry.color} />)}
                </Pie>

                <Pie
                  data={sadPathOuter} dataKey="value" cx="50%" cy="50%" innerRadius="56%" outerRadius="75%" stroke="#eef2f6" strokeWidth={2} isAnimationActive={true}
                  labelLine={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '3 3' }}
                  label={({ cx, cy, midAngle = 0, outerRadius, name }: any) => {
                    const RADIAN = Math.PI / 180;
                    const radius = Number(outerRadius) * 1.2;
                    const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN);
                    const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text x={x} y={y} fill="#6b7280" textAnchor={x > Number(cx) ? 'start' : 'end'} dominantBaseline="central" className="text-[10px] md:text-xs font-medium">
                        {name}
                      </text>
                    );
                  }}
                >
                  {sadPathOuter.map((entry, index) => <Cell key={`outer-${index}`} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <UpdateDataModal 
        isOpen={isUpdateModalOpen} 
        onClose={() => setIsUpdateModalOpen(false)} 
      />
    </div>
  );
}