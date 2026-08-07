export default function TelegramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      style={{ flex: "0 0 auto" }}
    >
      <path d="M21.9 4.3 2.7 11.8c-1 .4-1 1 0 1.3l4.7 1.5 1.8 5.7c.2.7.4.9 1 .9.5 0 .7-.2 1-.5l2.6-2.5 5.3 4c1 .5 1.7.2 1.9-.9l3.4-15.9c.3-1.3-.5-1.9-1.5-1.4z" />
    </svg>
  );
}
