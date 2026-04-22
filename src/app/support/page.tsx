import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Search, HelpCircle, Bug, BookOpen, Calculator, LifeBuoy } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support & FAQ - Calculator1.org",
  description: "Get help using our tools. Frequently asked questions, bug reporting, and user guides for Calculator1.org.",
};

export default function SupportPage() {
  const faqs = [
    {
      question: "Are the calculators free to use?",
      answer: "Yes, 100% free. All tools on Calculator1.org are provided at no cost to the user. We support the site through minimal non-intrusive advertising.",
    },
    {
      question: "How accurate are the results?",
      answer: "Our calculators use standard mathematical formulas and are regularly audited for accuracy. However, results should be used for informational purposes only. For critical financial or medical decisions, we recommend consulting with a professional.",
    },
    {
      question: "I found a bug in a calculator. How do I report it?",
      answer: "We appreciate your help! You can report bugs through our Contact page or by emailing support@calculator1.org. Please include the name of the calculator and the inputs you used.",
    },
    {
      question: "Can I request a new calculator?",
      answer: "Absolutely! We are constantly adding to our library. Send us your request via the Contact page with details about the required inputs and the formula used if possible.",
    },
    {
      question: "Do I need to create an account?",
      answer: "No, you don't need an account to use our calculators. However, creating a free account allows you to save your 'Favorite' calculators and view your calculation history.",
    },
  ];

  const categories = [
    { name: "Getting Started", icon: BookOpen, count: 5 },
    { name: "Calculations", icon: Calculator, count: 12 },
    { name: "Account Help", icon: LifeBuoy, count: 8 },
    { name: "Troubleshooting", icon: Bug, count: 6 },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <Badge className="mb-4 px-4 py-1 text-sm bg-primary/10 text-primary border-primary/20">
          Support Center
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">How can we help?</h1>
        <div className="relative max-w-xl mx-auto mt-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input className="w-full pl-12 pr-4 h-14 rounded-full border-primary/20 bg-background/50 text-lg shadow-sm" placeholder="Search for help articles..." />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {categories.map((cat, i) => (
          <Card key={i} className="hover:border-primary/40 hover:bg-primary/[0.02] transition-all cursor-pointer group">
            <CardContent className="p-6 text-center">
              <cat.icon className="h-8 w-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="font-bold font-headline text-sm">{cat.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{cat.count} articles</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* FAQ Section */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold font-headline mb-6 flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border rounded-xl px-6 bg-card/50 backdrop-blur-sm border-primary/5 overflow-hidden">
                <AccordionTrigger className="hover:no-underline font-semibold font-headline text-left py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6 pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Sidebar Help */}
        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground border-none shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Still need help?</CardTitle>
              <CardDescription className="text-primary-foreground/80">Our support team is ready to assist you.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-6 leading-relaxed">
                If you couldn't find the answer you were looking for, please don't hesitate to reach out. We respond to most support tickets within 24 hours.
              </p>
              <a href="/contact" className="block w-full text-center py-3 bg-white text-primary font-bold rounded-full hover:bg-opacity-90 transition-all shadow-md">
                Contact Support
              </a>
            </CardContent>
          </Card>

          <Card className="border-primary/10 bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-headline">Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Join our community to stay updated on new features and tools.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Latest Update: v2.4 released</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Follow us on Twitter for instant support.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
