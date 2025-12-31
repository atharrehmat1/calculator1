import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/icon.png"
      alt="Calculator1.org Logo"
      width={28}
      height={28}
      className={cn("object-contain", className)}
      priority
    />
  );
}
