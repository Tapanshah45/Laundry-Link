import { SlotCard } from "../SlotCard";

export default function SlotCardExample() {
  const availableSlot = {
    id: "1",
    time: "10:00 AM",
    date: "Today, Oct 2",
    available: true
  };

  const bookedSlot = {
    id: "2",
    time: "02:00 PM",
    date: "Today, Oct 2",
    available: false,
    bookedBy: "B-101"
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <SlotCard 
          slot={availableSlot} 
          onBook={(id) => console.log("Booking slot:", id)}
          isBooking={false}
        />
        <SlotCard 
          slot={bookedSlot} 
          onBook={(id) => console.log("Booking slot:", id)}
          isBooking={false}
        />
      </div>
    </div>
  );
}
