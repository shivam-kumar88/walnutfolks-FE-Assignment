"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { saveUserChartData } from "@/store/chartSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface UpdateDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdateDataModal({ isOpen, onClose }: UpdateDataModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const currentData = useSelector((state: RootState) => state.charts);

  const [callDuration, setCallDuration] = useState(currentData.callDuration);
  const [sadPathInner, setSadPathInner] = useState(currentData.sadPathInner);
  const [sadPathOuter, setSadPathOuter] = useState(currentData.sadPathOuter);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCallDuration(currentData.callDuration);
      setSadPathInner(currentData.sadPathInner);
      setSadPathOuter(currentData.sadPathOuter);
    }
  }, [isOpen, currentData]);

  const handleCallDurationChange = (index: number, value: string) => {
    const newData = [...callDuration];
    newData[index] = { ...newData[index], calls: Number(value) || 0 };
    setCallDuration(newData);
  };

  const handleSadPathInnerChange = (index: number, value: string) => {
    const newData = [...sadPathInner];
    newData[index] = { ...newData[index], value: Number(value) || 0 };
    setSadPathInner(newData);
  };

  const handleSadPathOuterChange = (index: number, value: string) => {
    const newData = [...sadPathOuter];
    newData[index] = { ...newData[index], value: Number(value) || 0 };
    setSadPathOuter(newData);
  };

  const executeSave = async () => {
    if (!user) return;
    setIsSaving(true);
    
    try {
      await dispatch(saveUserChartData({
        userId: user.id,
        callDuration,
        sadPathInner,
        sadPathOuter
      })).unwrap(); 
      
      setIsConfirmOpen(false);
      onClose(); 
    } catch (error) {
      alert("Failed to save data. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] bg-white text-gray-900 rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Update Chart Data</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="callDuration" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1">
              <TabsTrigger value="callDuration" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Call Duration</TabsTrigger>
              <TabsTrigger value="sadPathInner" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Main Issues</TabsTrigger>
              <TabsTrigger value="sadPathOuter" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Sub Issues</TabsTrigger>
            </TabsList>

            <div className="mt-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              
              <TabsContent value="callDuration" className="space-y-4 mt-0">
                {callDuration.map((item, index) => (
                  <div key={index} className="flex items-center justify-between gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <label className="text-sm font-medium w-16">{item.time}</label>
                    <input
                      type="number"
                      value={item.calls}
                      onChange={(e) => handleCallDurationChange(index, e.target.value)}
                      className="w-full bg-white border border-gray-200 text-sm rounded-lg focus:ring-2 focus:ring-[#8B5CF6] outline-none p-2 transition-all"
                    />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="sadPathInner" className="space-y-4 mt-0">
                {sadPathInner.map((item, index) => (
                  <div key={index} className="flex items-center justify-between gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <label className="text-sm font-medium w-48 truncate">{item.name}</label>
                    <input
                      type="number"
                      value={item.value}
                      onChange={(e) => handleSadPathInnerChange(index, e.target.value)}
                      className="w-full bg-white border border-gray-200 text-sm rounded-lg focus:ring-2 focus:ring-[#8B5CF6] outline-none p-2 transition-all"
                    />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="sadPathOuter" className="space-y-4 mt-0">
                {sadPathOuter.map((item, index) => (
                  <div key={index} className="flex items-center justify-between gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <label className="text-sm font-medium w-48 truncate" title={item.name}>{item.name}</label>
                    <input
                      type="number"
                      value={item.value}
                      onChange={(e) => handleSadPathOuterChange(index, e.target.value)}
                      className="w-full bg-white border border-gray-200 text-sm rounded-lg focus:ring-2 focus:ring-[#8B5CF6] outline-none p-2 transition-all"
                    />
                  </div>
                ))}
              </TabsContent>

            </div>
          </Tabs>

          <div className="flex justify-end gap-3 mt-8">
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              Cancel
            </button>
            <button 
              onClick={() => setIsConfirmOpen(true)}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md"
            >
              Review & Save
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="bg-white rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Overwrite Database?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              This action will update your saved analytics data in Supabase with the new values you just entered. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel disabled={isSaving} className="rounded-xl border-gray-200 text-gray-700">Go back</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault(); 
                executeSave();
              }}
              disabled={isSaving}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl"
            >
              {isSaving ? "Saving..." : "Yes, Update Data"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}