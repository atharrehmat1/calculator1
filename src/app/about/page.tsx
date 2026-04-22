import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Users, Shield, Zap, Globe, Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Calculator1.org",
  description: "Learn more about Calculator1.org, your premier destination for over 3,700 free online calculators across every category imaginable.",
};

export default function AboutPage() {
  const stats = [
    { label: "Total Calculators", value: "3,700+", icon: Calculator },
    { label: "Monthly Users", value: "500K+", icon: Users },
    { label: "Categories", value: "15+", icon: Zap },
    { label: "Countries Served", value: "190+", icon: Globe },
  ];

  const values = [
    {
      title: "Accuracy First",
      description: "Every calculator on our platform is rigorously tested for mathematical precision and reliability.",
      icon: Shield,
    },
    {
      title: "Built for Everyone",
      description: "From simple addition to complex financial modeling, we make high-level calculations accessible to all.",
      icon: Heart,
    },
    {
      title: "Speed & Simplicity",
      description: "No logins, no paywalls, no clutter. Get your results in seconds with our optimized interface.",
      icon: Zap,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <Badge className="mb-4 px-4 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
          The World's Calculator Hub
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Empowering Your Decisions with Data
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Calculator1.org was born from a simple idea: that complex math shouldn't be a barrier to informed decision-making. We provide the tools you need to calculate anything, anywhere, for free.
        </p>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none bg-primary/[0.03] backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary/70" />
              <div className="text-2xl font-bold font-headline text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mission Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <h2 className="text-3xl font-bold font-headline mb-6">Our Mission</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
            <p>
              At Calculator1.org, we believe that access to accurate information is a fundamental right. Whether you're a student solving physics equations, a homeowner calculating a mortgage, or a scientist analyzing statistical data, our mission is to provide you with the most reliable tools possible.
            </p>
            <p>
              We've meticulously built a collection of over 3,700 calculators, each designed with a focus on user experience and mathematical integrity. Our platform is completely free to use, ensuring that high-quality calculation tools are available to everyone, regardless of their location or financial status.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {values.map((value, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <value.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold font-headline mb-1">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-snug">{value.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team/Contact Call to Action */}
      <Card className="bg-primary text-primary-foreground overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-48 w-48 bg-black/10 rounded-full blur-2xl" />
        <CardContent className="p-10 md:p-16 text-center relative z-10">
          <h2 className="text-3xl font-bold font-headline mb-4">Have a Calculator Request?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Our library is growing every day. If you need a specific tool that we don't have yet, we'd love to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/contact" className="px-8 py-3 bg-white text-primary font-bold rounded-full hover:bg-opacity-90 transition-all shadow-lg">
              Contact Our Team
            </a>
            <a href="/calculators" className="px-8 py-3 bg-primary-foreground/10 text-white font-bold rounded-full hover:bg-white/10 transition-all border border-white/20">
              Browse All Tools
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
