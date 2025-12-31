
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DonatePage() {
    const router = useRouter();

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <div className="relative mb-8 text-center">
                <Button variant="ghost" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2" onClick={() => router.back()}>
                    <ArrowLeft className="h-6 w-6" />
                    <span className="sr-only">Back</span>
                </Button>
                <h1 className="text-3xl font-bold font-headline">Donate</h1>
            </div>

            <Card className="shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-muted text-muted-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
                        <Clock className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-3xl font-headline">Coming Soon</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground pt-2">
                        The donation feature is currently under development. 
                        We're working hard to bring you a seamless way to support Calculator1.org.
                        Check back soon!
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-6 md:px-10 text-center py-8">
                    <p className="text-muted-foreground">
                        Thank you for your interest in supporting our platform. 
                        We appreciate your patience as we build this feature.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
