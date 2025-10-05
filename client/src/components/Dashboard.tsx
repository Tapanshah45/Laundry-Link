import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlotCard, Slot } from "./SlotCard";
import { ThemeToggle } from "./ThemeToggle";
import { LogOut, Home, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

interface DashboardProps {
  user: {
    name: string;
    phone: string;
    room: string;
  };
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "slots"), (snapshot) => {
      const slotsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Slot[];
      
      setSlots(slotsData.sort((a, b) => a.time.localeCompare(b.time)));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching slots:", error);
      toast({
        title: "Error",
        description: "Failed to load slots. Please refresh the page.",
        variant: "destructive",
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleBookSlot = async (slotId: string) => {
    setBookingSlotId(slotId);
    
    try {
      const slotRef = doc(db, "slots", slotId);
      await updateDoc(slotRef, {
        available: false,
        bookedBy: user.room
      });
      
      const bookedSlot = slots.find(s => s.id === slotId);
      
      toast({
        title: "Slot Booked Successfully! 🎉",
        description: `Your laundry slot has been confirmed for ${bookedSlot?.time}`,
      });
    } catch (error) {
      console.error("Error booking slot:", error);
      toast({
        title: "Booking Failed",
        description: "Failed to book slot. Please try again.",
        variant: "destructive",
      });
    } finally {
      setBookingSlotId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      onLogout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">Loading slots...</p>
        </div>
      </div>
    );
  }

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
              onClick={handleLogout}
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

          {slots.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No slots available at the moment.</p>
            </div>
          ) : (
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
          )}
        </motion.div>
      </main>
    </div>
  );
}
