/**
 * Resto logotipi — restoranning asl logotipidan olingan vektor.
 * Rang `currentColor` orqali beriladi: oq fonda taupe, taupe fonda oq.
 */
const RATIO = {
  full: 1987 / 1261, // "Resto" + "RESTAURANT"
  script: 1987 / 1031, // faqat "Resto"
};

export default function Logo({ variant = 'full', height = 40, className = '', style }) {
  return (
    <span
      className={`logo logo--${variant} ${className}`.trim()}
      style={{ height, width: height * RATIO[variant], ...style }}
      role="img"
      aria-label="Resto Restaurant"
    />
  );
}
