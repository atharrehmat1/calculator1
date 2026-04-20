import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <Image
        src="/icon-light.png?v=1"
        alt="Logo Calculator1.org"
        className="dark:hidden object-contain"
        priority
        width={230}
        height={80}
      />
      <Image
        src="/icon-dark.png?v=1"
        alt="Logo Calculator1.org"
        className="hidden dark:block object-contain"
        priority
        width={230}
        height={80}
      />
    </div>
  );
}
