/** Resto logotipi — restoranning asl logotipidan olingan vektor */
export default function Logo({ height = 38, style }) {
  return (
    <span
      className="logo"
      style={{ height, width: height * (1987 / 1261), ...style }}
      role="img"
      aria-label="Resto Restaurant"
    />
  );
}
