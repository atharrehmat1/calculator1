import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Eye, Database, Cookie, Lock, Bell } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Calculator1.org",
  description: "Read the Privacy Policy for Calculator1.org. We value your privacy and are committed to protecting your personal information.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "April 22, 2026";

  const sections = [
    {
      title: "Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, request a calculator, or communicate with us. This may include your name, email address, and any other information you choose to provide. We also automatically collect certain information when you use the site, such as your IP address and device identifiers.",
      icon: Database,
    },
    {
      title: "How We Use Information",
      content: "We use the information we collect to provide, maintain, and improve our services, including to personalize your experience and to respond to your requests. We may also use the information to send you technical notices, updates, and support messages.",
      icon: Eye,
    },
    {
      title: "Cookies & Tracking",
      content: "We use cookies and similar technologies to track activity on our site and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our site.",
      icon: Cookie,
    },
    {
      title: "Data Security",
      content: "We take reasonable measures to protect your personal information from loss, theft, misuse, and unauthorized access. However, no method of transmission over the Internet or electronic storage is 100% secure.",
      icon: Lock,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12 text-center md:text-left">
        <Badge className="mb-4 px-4 py-1 text-sm bg-primary/10 text-primary border-primary/20">
          Privacy Center
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 flex items-center gap-3 justify-center md:justify-start">
          <ShieldCheck className="h-10 w-10 text-primary" />
          Privacy Policy
        </h1>
        <p className="text-muted-foreground text-lg">
          Last Updated: <span className="text-foreground font-semibold">{lastUpdated}</span>
        </p>
      </div>

      <div className="space-y-8 mb-16">
        <Card className="border-none bg-primary/[0.03] backdrop-blur-sm">
          <CardContent className="p-8">
            <p className="text-muted-foreground leading-relaxed text-lg italic">
              "Your privacy is critically important to us. At Calculator1.org, we have a few fundamental principles: We don’t ask you for personal information unless we truly need it. We don’t share your personal information with anyone except to comply with the law, develop our products, or protect our rights."
            </p>
          </CardContent>
        </Card>

        {sections.map((section, i) => (
          <section key={i} className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <section.icon className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold font-headline">{section.title}</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed pl-12">
              {section.content}
            </p>
          </section>
        ))}

        <section className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold font-headline">Changes to This Policy</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed pl-12">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>
      </div>

      <Card className="bg-card/50 border-primary/10">
        <CardContent className="p-8">
          <h3 className="font-bold font-headline text-xl mb-4">Contact for Privacy Issues</h3>
          <p className="text-muted-foreground mb-6">
            If you have any questions about this Privacy Policy or our practices, please contact our Data Protection Officer at:
          </p>
          <div className="flex flex-col gap-2">
            <span className="text-primary font-medium">privacy@calculator1.org</span>
            <span className="text-sm text-muted-foreground">Subject: Privacy Concern</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
