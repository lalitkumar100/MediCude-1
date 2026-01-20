import React from "react";
import { 
  Construction, 
  TrendingUp, 
  LayoutDashboard,
  Timer,
  Wallet,
  PieChart
} from "lucide-react";
import { Button } from "@/components/ui/button"; 
import { Card, CardContent } from "@/components/ui/card"; 
import { Badge } from "@/components/ui/badge"; 

const FinTrackStatus = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Central Aqua Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-50 rounded-full blur-[100px] -z-10 opacity-70" />

      <div className="max-w-3xl w-full text-center space-y-10">
        
        {/* Status Badge */}
        <div className="flex justify-center">
          <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-teal-100 px-4 py-1.5 flex gap-2 animate-pulse">
            <Timer size={14} />
            Feature Release: Scheduled for feb 2026
          </Badge>
        </div>

        {/* Main Icon & Headline */}
        <div className="space-y-6">
          <div className="relative inline-block">
             <div className="absolute inset-0 bg-teal-400 blur-2xl opacity-20 rounded-full"></div>
             <div className="relative bg-white w-24 h-24 rounded-3xl shadow-2xl shadow-teal-100/50 flex items-center justify-center mx-auto border border-teal-50">
               <Wallet className="text-teal-500 w-12 h-12" />
             </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-slate-900 tracking-tight">
              FinTrack is <span className="text-teal-600 font-extrabold">Coming Soon</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
              We are currently fine-tuning our AI financial engine to provide you with the most accurate pharmacy accounting experience.
            </p>
          </div>
        </div>

        {/* Sneak Peek Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
          <Card className="border-slate-100 bg-white/40 backdrop-blur-sm transition-transform hover:scale-[1.02]">
            <CardContent className="p-5 flex gap-4 items-center">
              <div className="bg-teal-100 p-2.5 rounded-xl text-teal-600">
                <TrendingUp size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Real-time Profit Tracking</h3>
                <p className="text-xs text-slate-500">Analyze daily margins and growth.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 bg-white/40 backdrop-blur-sm transition-transform hover:scale-[1.02]">
            <CardContent className="p-5 flex gap-4 items-center">
              <div className="bg-teal-100 p-2.5 rounded-xl text-teal-600">
                <PieChart size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Expense Categorization</h3>
                <p className="text-xs text-slate-500">Smart labels for shop & staff costs.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button 
            className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-6 rounded-2xl text-md font-semibold shadow-xl shadow-teal-200/50 transition-all hover:-translate-y-1"
            onClick={() => window.history.back()}
          >
            <LayoutDashboard className="mr-2" size={18} />
            Return to Dashboard
          </Button>
  
        </div>

        {/* Footer Signature */}
        <div className="pt-16 border-t border-slate-50">
          <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
            <Construction size={16} />
            <span>Project Module by</span>
            <span className="font-bold text-slate-600">Lalit Kumar</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinTrackStatus;