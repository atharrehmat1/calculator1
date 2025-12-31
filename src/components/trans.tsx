"use client";

import { useTranslation } from "@/contexts/translation-context";
import { useEffect, useState } from "react";

interface TransProps {
  children: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function Trans({ children, className, as: Component = "span" }: TransProps) {
  const { translate, currentLanguage } = useTranslation();
  const [translatedText, setTranslatedText] = useState(children);

  useEffect(() => {
    if (currentLanguage === 'english') {
      setTranslatedText(children);
      return;
    }

    translate(children).then(setTranslatedText).catch(() => {
      setTranslatedText(children);
    });
  }, [children, currentLanguage, translate]);

  return <Component className={className}>{translatedText}</Component>;
}

