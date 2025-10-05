import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

interface PhoneLoginProps {
  onLoginSuccess: (userData: { name: string; phone: string; room: string }) => void;
}

export function PhoneLogin({ onLoginSuccess }: PhoneLoginProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const { toast } = useToast();

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          console.log("reCAPTCHA solved");
        }
      });
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    
    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const phoneNumber = `+91${phone}`;
      
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setStep("otp");
      
      toast({
        title: "OTP Sent",
        description: `Verification code sent to +91 ${phone}`,
      });
    } catch (err: any) {
      console.error("Error sending OTP:", err);
      setError(err.message || "Failed to send OTP. Please try again.");
      
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      console.log("Looking for user document with ID:", phone);
      const userDocRef = doc(db, "users", phone);
      const userDoc = await getDoc(userDocRef);
      
      console.log("Document exists:", userDoc.exists());
      if (userDoc.exists()) {
        console.log("User data found:", userDoc.data());
      }
      
      if (!userDoc.exists()) {
        setError(`User not registered. Make sure document ID is: ${phone}`);
        await auth.signOut();
        setLoading(false);
        return;
      }
      
      const userData = userDoc.data();
      
      onLoginSuccess({
        name: userData.name,
        phone: phone,
        room: userData.room
      });
      
      toast({
        title: "Login Successful! 🎉",
        description: `Welcome ${userData.name}`,
      });
    } catch (err: any) {
      console.error("Error verifying OTP:", err);
      
      if (err.code === 'auth/invalid-verification-code') {
        setError("Invalid OTP. Please check and try again.");
      } else if (err.code === 'auth/code-expired') {
        setError("OTP has expired. Please request a new one.");
      } else {
        setError("Verification failed. Please try again.");
      }
      
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setOtp("");
    setLoading(true);
    
    try {
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      }
      
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const phoneNumber = `+91${phone}`;
      
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      
      toast({
        title: "OTP Resent",
        description: `New verification code sent to +91 ${phone}`,
      });
    } catch (err: any) {
      console.error("Error resending OTP:", err);
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div id="recaptcha-container"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Laundry Booking</h1>
          <p className="text-muted-foreground mt-2">Book your laundry slot instantly</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              {step === "phone" ? "Enter Phone Number" : "Verify OTP"}
            </CardTitle>
            <CardDescription>
              {step === "phone" 
                ? "We'll send you a one-time password" 
                : `Code sent to +91 ${phone}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "phone" ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 border rounded-md bg-muted">
                      <span className="text-sm font-mono text-muted-foreground">+91</span>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="flex-1 font-mono"
                      data-testid="input-phone"
                      disabled={loading}
                    />
                  </div>
                </div>
                {error && (
                  <p className="text-sm text-error" data-testid="text-error">{error}</p>
                )}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || phone.length !== 10}
                  data-testid="button-send-otp"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="text-center text-2xl font-mono tracking-widest"
                    data-testid="input-otp"
                    disabled={loading}
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="text-sm text-error" data-testid="text-error">{error}</p>
                )}
                <div className="space-y-2">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || otp.length !== 6}
                    data-testid="button-verify-otp"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Login"
                    )}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={handleResendOtp}
                      disabled={loading}
                      data-testid="button-resend-otp"
                    >
                      Resend OTP
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1"
                      onClick={() => {
                        setStep("phone");
                        setOtp("");
                        setError("");
                      }}
                      disabled={loading}
                      data-testid="button-change-number"
                    >
                      Change Number
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
