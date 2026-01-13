import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isNew?: boolean;
  index: number;
}

const FeatureCard = ({ icon: Icon, title, description, isNew, index }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group"
    >
      <div className="relative p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-lg transition-all duration-300 h-full">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 gradient-bg opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300" />
        
        {/* NEW badge */}
        {isNew && (
          <div className="absolute -top-3 -right-3 px-3 py-1 gradient-bg rounded-full text-xs font-bold text-primary-foreground shadow-glow">
            NOVO
          </div>
        )}

        {/* Icon */}
        <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center mb-4 shadow-glow">
          <Icon className="w-7 h-7 text-primary-foreground" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold font-display text-foreground mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
