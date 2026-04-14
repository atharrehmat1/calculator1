import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <Image
        src="/icon-light.png"
        alt="Calculator1.org Logo"

        className="dark:hidden object-contain"
        priority
        width={50}
        height={50}
      />
      <Image
        src="/icon-dark.png"
        alt="Calculator1.org Logo"

        className="hidden dark:block object-contain"
        priority
        width={50}
        height={50}
      />
    </div>
  );
}
