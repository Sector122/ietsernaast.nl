import Image from "next/image";

export default function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <Image
      src="/logo.webp"
      alt="Sektor logo"
      width={size}
      height={size}
      priority
    />
  );
}
