import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export interface Slot {
  id: string;
  time: string;
  date: string;
  available: boolean;
  bookedBy?: string;
}

interface SlotCardProps {
  slot: Slot;
  onBook: (slotId: string) => void;
  isBooking: boolean;
}

export function SlotCard({ slot, onBook, isBooking }: SlotCardProps) {
  const isAvailable = slot.available;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={isAvailable ? { scale: 1.02 } : {}}
      className="h-full"
    >
      <Card 
        className={`h-full transition-all ${
          isAvailable 
            ? "border-2 border-success bg-success-light hover-elevate" 
            : "border-2 border-error bg-error-light opacity-60"
        }`}
        data-testid={`card-slot-${slot.id}`}
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Badge 
              variant={isAvailable ? "default" : "destructive"}
              className="uppercase text-xs font-semibold"
              data-testid={`badge-status-${slot.id}`}
            >
              {isAvailable ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Available
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 mr-1" />
                  Booked
                </>
              )}
            </Badge>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <p 
                className={`text-3xl font-bold font-mono ${
                  isAvailable ? "text-success-light-foreground" : "text-error-light-foreground"
                }`}
                data-testid={`text-time-${slot.id}`}
              >
                {slot.time}
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <p data-testid={`text-date-${slot.id}`}>{slot.date}</p>
            </div>
          </div>

          <Button
            className="w-full"
            disabled={!isAvailable || isBooking}
            onClick={() => onBook(slot.id)}
            variant={isAvailable ? "default" : "secondary"}
            data-testid={`button-book-${slot.id}`}
          >
            {isBooking ? "Booking..." : isAvailable ? "Book Slot" : "Not Available"}
          </Button>

          {!isAvailable && slot.bookedBy && (
            <p className="text-xs text-center text-muted-foreground" data-testid={`text-booked-by-${slot.id}`}>
              Booked by Room {slot.bookedBy}
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
