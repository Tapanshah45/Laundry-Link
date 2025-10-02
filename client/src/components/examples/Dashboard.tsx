import { Dashboard } from "../Dashboard";

export default function DashboardExample() {
  return (
    <Dashboard
      user={{
        name: "Rahul Kumar",
        phone: "9876543210",
        room: "A-204"
      }}
      onLogout={() => {
        console.log("Logout triggered");
      }}
    />
  );
}
