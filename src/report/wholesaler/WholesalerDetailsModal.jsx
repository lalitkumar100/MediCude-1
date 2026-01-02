import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, FileText, Phone, Mail, MapPin, Store } from "lucide-react";

export default function WholesalerDetailsModal({ 
  isOpen, 
  onClose, 
  wholesaler 
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden border-0 shadow-2xl">
        
        {/* Header */}
        <DialogHeader className="p-6 pb-4 bg-indigo-50/50 border-b">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-100 rounded-full">
                <Store className="w-5 h-5 text-indigo-600" />
             </div>
             <div>
                <DialogTitle className="text-xl text-gray-900">
                  Wholesaler Details
                </DialogTitle>
                <DialogDescription className="mt-1 text-gray-500">
                  View full profile information for this distributor.
                </DialogDescription>
             </div>
          </div>
        </DialogHeader>

        {wholesaler && (
          <div className="p-6 space-y-6">
            {/* Name & GST Section */}
            <div className="grid grid-cols-1 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                 <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                       <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                         Business Name
                       </label>
                       <p className="text-base font-semibold text-gray-900">
                         {wholesaler.name}
                       </p>
                    </div>
                 </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                 <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                       <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                         GST Registration No
                       </label>
                       <p className="text-base font-medium text-gray-900 font-mono tracking-wide">
                         {wholesaler.gst_no}
                       </p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
               <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                    <Phone className="w-4 h-4 text-indigo-500" />
                    Contact Number
                  </div>
                  <p className="text-sm text-gray-600 pl-6">
                    {wholesaler.contact}
                  </p>
               </div>

               <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                    <Mail className="w-4 h-4 text-indigo-500" />
                    Email Address
                  </div>
                  <p className="text-sm text-gray-600 pl-6 truncate" title={wholesaler.email}>
                    {wholesaler.email}
                  </p>
               </div>
            </div>

            <div className="border-t pt-4">
               <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    Registered Address
                  </div>
                  <p className="text-sm text-gray-600 pl-6 leading-relaxed">
                    {wholesaler.address}
                  </p>
               </div>
            </div>
          </div>
        )}

        <DialogFooter className="p-6 pt-2 bg-gray-50 border-t">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Close Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}