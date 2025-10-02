import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlotCard, Slot } from "./SlotCard";
import { ThemeToggle } from "./ThemeToggle";
import { LogOut, Home, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  user: {
    name: string;
    phone: string;
    room: string;
  };
  onLogout: () => void;
}

//todo: remove mock functionality
const MOCK_SLOTS: Slot[] = [
  { id: "1", time: "08:00 AM", date: "Today, Oct 2", available: true },
  { id: "2", time: "10:00 AM", date: "Today, Oct 2", available: true },
  { id: "3", time: "12:00 PM", date: "Today, Oct 2", available: false, bookedBy: "B-101" },
  { id: "4", time: "02:00 PM", date: "Today, Oct 2", available: true },
  { id: "5", time: "04:00 PM", date: "Today, Oct 2", available: false, bookedBy: "C-305" },
  { id: "6", time: "06:00 PM", date: "Today, Oct 2", available: true },
  { id: "7", time: "08:00 AM", date: "Tomorrow, Oct 3", available: true },
  { id: "8", time: "10:00 AM", date: "Tomorrow, Oct 3", available: true },
];

export function Dashboard({ user, onLogout }: DashboardProps) {
  //todo: remove mock functionality
  const [slots, setSlots] = useState<Slot[]>(MOCK_SLOTS);
  const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleBookSlot = async (slotId: string) => {
    setBookingSlotId(slotId);
    console.log("Booking slot:", slotId);
    
    // Simulate booking API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    //todo: remove mock functionality - replace with Firebase Firestore update
    setSlots(prev => 
      prev.map(slot => 
        slot.id === slotId 
          ? { ...slot, available: false, bookedBy: user.room }
          : slot
      )
    );
    
    setBookingSlotId(null);
    
    toast({
      title: "Slot Booked Successfully! 🎉",
      description: `Your laundry slot has been confirmed for ${slots.find(s => s.id === slotId)?.time}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container h-full flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-semibold">Laundry Booking</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-online animate-pulse-dot" />
              <span className="text-sm text-muted-foreground hidden sm:inline">Live</span>
            </div>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 sm:p-12 mb-8 shadow-md">
            <div className="max-w-3xl">
              <h2 className="text-3xl sm:text-4xl font-bold mb-2" data-testid="text-welcome">
                Welcome, {user.name}! 👋
              </h2>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  <span className="text-lg">Room</span>
                  <Badge 
                    variant="secondary" 
                    className="font-mono text-base px-3 py-1"
                    data-testid="badge-room"
                  >
                    {user.room}
                  </Badge>
                </div>
              </div>
              <p className="mt-4 text-primary-foreground/90">
                Select an available time slot below to book your laundry
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-2">Available Slots</h3>
            <p className="text-muted-foreground">
              {slots.filter(s => s.available).length} of {slots.length} slots available
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
            {slots.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                onBook={handleBookSlot}
                isBooking={bookingSlotId === slot.id}
              />
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
