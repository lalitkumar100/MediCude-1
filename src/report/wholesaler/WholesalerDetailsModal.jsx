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

export default function WholesalerDetailsModal({ 
  isOpen, 
  onClose, 
  wholesaler 
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* UPDATED CLASSNAME:
        1. fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]: Forces exact center alignment.
        2. max-h-[90vh] overflow-y-auto: Ensures it fits on mobile screens and scrolls if content is too long.
        3. w-full max-w-[95vw]: Ensures it takes appropriate width on mobile.
      */}
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-lg z-50">
        <DialogHeader>
          <DialogTitle className="text-blue-700">
            Wholesaler Details
          </DialogTitle>
          <DialogDescription>
            Comprehensive information about the wholesaler.
          </DialogDescription>
        </DialogHeader>

        {wholesaler && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Wholesaler Name
                </label>
                <p className="text-sm text-gray-900">
                  {wholesaler.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  GST No
                </label>
                <p className="text-sm text-gray-900 font-mono">
                  {wholesaler.gst_no}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <p className="text-sm text-gray-900">
                  {wholesaler.contact}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="text-sm text-gray-900">
                  {wholesaler.email}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Address
              </label>
              <p className="text-sm text-gray-900">
                {wholesaler.address}
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}