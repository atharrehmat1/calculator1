import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, MapPin, Send, Facebook, Twitter, Instagram } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Calculator1.org",
  description: "Have a question or a calculator request? Get in touch with the Calculator1.org team. We're here to help.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <Badge className="mb-4 px-4 py-1 text-sm bg-primary/10 text-primary border-primary/20">
          Get in Touch
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Contact Our Team</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          We value your feedback and requests. Whether you found a bug or need a new calculation tool, we're ready to listen.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Contact Information */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-8">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold font-headline">Email Us</h3>
                  <p className="text-sm text-muted-foreground mb-1">General Inquiries</p>
                  <a href="mailto:info@calculator1.org" className="text-primary hover:underline font-medium">info@calculator1.org</a>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-8">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold font-headline">Support</h3>
                  <p className="text-sm text-muted-foreground mb-1">Bug Reports & Help</p>
                  <a href="/support" className="text-primary hover:underline font-medium">Visit Help Center</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold font-headline">Location</h3>
                  <p className="text-sm text-muted-foreground mb-1">Our Global HQ</p>
                  <address className="not-italic text-foreground font-medium text-sm">
                    Digital Nomad Way, Suite 101<br />
                    San Francisco, CA 94105
                  </address>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <h3 className="font-bold font-headline mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <Button size="icon" variant="secondary" className="rounded-full bg-white/10 hover:bg-white/20 border-none text-white">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="secondary" className="rounded-full bg-white/10 hover:bg-white/20 border-none text-white">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="secondary" className="rounded-full bg-white/10 hover:bg-white/20 border-none text-white">
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs opacity-70 mt-6 leading-relaxed italic">
                Our social media channels are the best place to get updates on new calculator releases.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-xl border-none bg-card/80 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-headline">Send us a Message</CardTitle>
              <CardDescription>We typically respond to all inquiries within 24-48 business hours.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Name</label>
                    <Input placeholder="John Doe" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input type="email" placeholder="john@example.com" className="bg-background/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="How can we help?" className="bg-background/50" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea placeholder="Tell us more about your request or feedback..." className="min-h-[150px] bg-background/50" />
                </div>

                <Button className="w-full sm:w-auto px-8 h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-full transition-all flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
