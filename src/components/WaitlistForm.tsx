import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import confetti from "canvas-confetti";

const WaitlistForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#8B5CF6", "#EC4899", "#3B82F6", "#06B6D4"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#8B5CF6", "#EC4899", "#3B82F6", "#06B6D4"],
      });
    }, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Prosim vnesi veljaven e-poštni naslov");
      return;
    }

    setIsLoading(true);

    try {
      // Save email to database - webhook will automatically send email
      const { error: insertError } = await supabase
        .from("waiting_list")
        .insert([{ email: email.toLowerCase().trim() }]);

      if (insertError) {
        if (insertError.code === "23505") {
          setError("Ta e-pošta je že na čakalni listi!");
        } else {
          setError(`Napaka pri shranjevanju: ${insertError.message}`);
        }
        return;
      }

      // Show success - webhook handles email sending
      setIsSuccess(true);
      triggerConfetti();
      
    } catch (err) {
      console.error("Error submitting email:", err);
      setError("Nekaj je šlo narobe. Prosim poskusi znova.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="relative">
              <div className="absolute inset-0 gradient-bg opacity-20 blur-2xl rounded-full" />
              <div className="relative flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="tvoja@email.si"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 rounded-xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary transition-all"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-14 px-6 rounded-xl gradient-bg text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-all group"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Hočem prednostni dostop
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-destructive text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <p className="text-center text-sm text-muted-foreground px-4">
              Prvih 50 prijavljenih prejme PRO status za 2 leti zastonj.
            </p>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8 rounded-2xl gradient-card border border-border shadow-lg"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full gradient-bg flex items-center justify-center shadow-glow"
            >
              <Check className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            <h3 className="text-2xl font-bold font-display text-foreground mb-2">
              Uspešno ste se prijavili!
            </h3>
            <p className="text-muted-foreground">
              Tvoje mesto je rezervirano. Ob otvoritvi boste dobili potrditveni email!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WaitlistForm;
