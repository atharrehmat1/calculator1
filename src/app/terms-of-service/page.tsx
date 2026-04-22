import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, FileText, CheckCircle2, AlertCircle, Info } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Calculator1.org",
  description: "Read the Terms of Service for Calculator1.org. Understand your rights and responsibilities when using our free calculation tools.",
};

export default function TermsOfServicePage() {
  const lastUpdated = "April 22, 2026";

  const sections = [
    {
      title: "Acceptance of Terms",
      content: "By accessing and using Calculator1.org, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.",
      icon: CheckCircle2,
    },
    {
      title: "Use of Service",
      content: "Calculator1.org provides users with access to over 3,700 free online calculators. You agree that the service is provided 'as-is' and that the site assumes no responsibility for the timeliness, deletion, mis-delivery or failure to store any user communications or personalization settings.",
      icon: Info,
    },
    {
      title: "Accuracy of Information",
      content: "While we strive to provide accurate calculations, we do not guarantee the results. The tools are intended for informational purposes only. You agree that you will not rely solely on the results provided by Calculator1.org for making critical financial, legal, or medical decisions.",
      icon: AlertCircle,
    },
    {
      title: "Intellectual Property",
      content: "All content included on this site, such as text, graphics, logos, button icons, images, and software, is the property of Calculator1.org or its content suppliers and protected by international copyright laws.",
      icon: FileText,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12 text-center md:text-left">
        <Badge className="mb-4 px-4 py-1 text-sm bg-primary/10 text-primary border-primary/20">
          Legal Terms
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 flex items-center gap-3 justify-center md:justify-start">
          <Scale className="h-10 w-10 text-primary" />
          Terms of Service
        </h1>
        <p className="text-muted-foreground text-lg">
          Effective Date: <span className="text-foreground font-semibold">{lastUpdated}</span>
        </p>
      </div>

      <div className="space-y-12 mb-16">
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <p className="text-muted-foreground leading-relaxed text-lg mb-8">
            Please read these Terms of Service carefully before using Calculator1.org. These terms govern your access to and use of our website and its services.
          </p>

          <div className="grid gap-8">
            {sections.map((section, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-primary/5 hover:border-primary/20 transition-all">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <section.icon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold font-headline mb-3 text-foreground">{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="p-8 rounded-2xl bg-destructive/5 border border-destructive/10">
          <h2 className="text-2xl font-bold font-headline mb-4 text-destructive flex items-center gap-2">
            <AlertCircle className="h-6 w-6" />
            Disclaimer of Warranties
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. CALCULATOR1.ORG EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT.
          </p>
        </section>
      </div>

      <Card className="bg-card/50 border-primary/10">
        <CardContent className="p-8 text-center">
          <h3 className="font-bold font-headline text-xl mb-4">Questions about our Terms?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            If you have any questions regarding our Terms of Service, please contact our legal team at:
          </p>
          <a href="mailto:legal@calculator1.org" className="text-primary font-bold text-lg hover:underline">
            legal@calculator1.org
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
