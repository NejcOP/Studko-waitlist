import { motion } from "framer-motion";
import { FileText, Brain, ClipboardList, BarChart3 } from "lucide-react";
import Countdown from "@/components/Countdown";
import FeatureCard from "@/components/FeatureCard";
import WaitlistForm from "@/components/WaitlistForm";

const features = [
  {
    icon: FileText,
    title: "Prodaja zapiskov",
    description:
      "Ne pusti, da tvoji dobri zapiski nabirajo prah. Objavi jih na Študko tržnici in služi od vsakega prenosa. Tvoje znanje ima svojo ceno!",
    isNew: true,
  },
  {
    icon: Brain,
    title: "Interaktivni AI Mentor",
    description:
      "Naloži snov, Študko pa ti takoj odgovori na vprašanja, povzame lekcije in ti pomaga razumeti najtežje koncepte.",
    isNew: false,
  },
  {
    icon: ClipboardList,
    title: "Pametni Kviz Generator",
    description:
      "Pripravi se na izpit s kvizi, ki jih Študko ustvari neposredno iz tvojih zapiskov.",
    isNew: false,
  },
  {
    icon: BarChart3,
    title: "Inštrukcije",
    description:
      "Če nudiš inštrukcije, Študko poskrbi za rezervacije in ti kaže jasne grafe tvojega zaslužka.",
    isNew: false,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen gradient-hero overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-studko-purple/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-studko-pink/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-studko-blue/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-1.5s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display gradient-text inline-block">
            Študko
          </h1>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-16"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-display text-foreground leading-tight mb-4 px-4">
            Naj tvoji zapiski delajo zate, medtem ko ti spiš.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 px-4">
            Študko: Edina platforma, ki ti hkrati krajša čas učenja in polni denarnico.
          </p>
          <div className="inline-block px-6 py-3 rounded-full gradient-bg shadow-glow">
            <p className="text-sm sm:text-base font-semibold text-primary-foreground">
              Samo še prvih 50 mest za doživljenjski PRO dostop!
            </p>
          </div>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-16 sm:mb-20"
        >
          <Countdown />
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16 sm:mb-20"
        >
          <h3 className="text-2xl sm:text-3xl font-bold font-display text-center text-foreground mb-8 sm:mb-12">
            Kaj vse Študko omogoča?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Waitlist Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center pb-12 sm:pb-20"
        >
          <h3 className="text-2xl sm:text-3xl font-bold font-display text-foreground mb-4">
            Pridruži se čakalni listi
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground/80 mb-2">
            🔥 Več kot 15 študentov se je že prijavilo danes.
          </p>
          <p className="text-muted-foreground mb-8 px-4">
            Postani prvi Študko uporabnik in spremeni svoje zapiske v denar.
          </p>
          <WaitlistForm />
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center py-6 border-t border-border"
        >
          <p className="text-sm text-muted-foreground">
            © 2026 Študko. Vse pravice pridržane.
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
