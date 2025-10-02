import { PhoneLogin } from "../PhoneLogin";

export default function PhoneLoginExample() {
  return (
    <PhoneLogin 
      onLoginSuccess={(userData) => {
        console.log("Login successful:", userData);
      }}
    />
  );
}
