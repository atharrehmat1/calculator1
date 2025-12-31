
"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { useAuth } from "@/contexts/auth-context";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
    const router = useRouter();
    const { login, register, user } = useAuth();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("login");
    const [isLoading, setIsLoading] = useState(false);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!loginEmail || !loginPassword) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(loginEmail)) {
            toast({
                title: "Error",
                description: "Please enter a valid email address",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            await login(loginEmail, loginPassword);
            toast({
                title: "Success",
                description: "Logged in successfully!",
            });
        } catch (error: any) {
            toast({
                title: "Login Failed",
                description: error.message || "Invalid email or password",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!signupName || !signupEmail || !signupPassword) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }

        // Name validation
        if (signupName.trim().length < 2) {
            toast({
                title: "Error",
                description: "Name must be at least 2 characters long",
                variant: "destructive",
            });
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(signupEmail)) {
            toast({
                title: "Error",
                description: "Please enter a valid email address",
                variant: "destructive",
            });
            return;
        }

        // Password validation
        if (signupPassword.length < 6) {
            toast({
                title: "Error",
                description: "Password must be at least 6 characters long",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            await register(signupEmail, signupPassword, signupName.trim());
            toast({
                title: "Success",
                description: "Account created successfully!",
            });
        } catch (error: any) {
            toast({
                title: "Signup Failed",
                description: error.message || "Failed to create account",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
             <div className="w-full max-w-md mx-auto p-4">
                 <div className="flex justify-center mb-6">
                    <Link href="/" className="flex items-center gap-2">
                        <Logo className="h-8 w-8" />
                        <span className="text-2xl font-bold font-headline text-foreground">
                            Calculator1.org
                        </span>
                    </Link>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <Card>
                            <CardHeader>
                                <CardTitle>Welcome Back!</CardTitle>
                                <CardDescription>Enter your credentials to access your account.</CardDescription>
                            </CardHeader>
                            <form onSubmit={handleLogin}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email-login">Email</Label>
                                        <Input 
                                            id="email-login" 
                                            type="email" 
                                            placeholder="m@example.com" 
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            required 
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password-login">Password</Label>
                                        <Input 
                                            id="password-login" 
                                            type="password" 
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            required 
                                            disabled={isLoading}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-4">
                                    <Button className="w-full" type="submit" disabled={isLoading}>
                                        {isLoading ? "Logging in..." : "Login"}
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground">
                                        Don&apos;t have an account?{' '}
                                        <button 
                                            type="button"
                                            onClick={() => setActiveTab("signup")} 
                                            className="underline hover:text-primary"
                                        >
                                            Sign up
                                        </button>
                                    </p>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                    <TabsContent value="signup">
                        <Card>
                            <CardHeader>
                                <CardTitle>Create an Account</CardTitle>
                                <CardDescription>Join us to save your favorite calculators and more.</CardDescription>
                            </CardHeader>
                            <form onSubmit={handleSignup}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name-signup">Name</Label>
                                        <Input 
                                            id="name-signup" 
                                            placeholder="John Doe" 
                                            value={signupName}
                                            onChange={(e) => setSignupName(e.target.value)}
                                            required 
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email-signup">Email</Label>
                                        <Input 
                                            id="email-signup" 
                                            type="email" 
                                            placeholder="m@example.com" 
                                            value={signupEmail}
                                            onChange={(e) => setSignupEmail(e.target.value)}
                                            required 
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password-signup">Password</Label>
                                        <Input 
                                            id="password-signup" 
                                            type="password" 
                                            value={signupPassword}
                                            onChange={(e) => setSignupPassword(e.target.value)}
                                            required 
                                            disabled={isLoading}
                                            minLength={6}
                                        />
                                        <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-4">
                                    <Button className="w-full" type="submit" disabled={isLoading}>
                                        {isLoading ? "Creating account..." : "Sign Up"}
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground">
                                        Already have an account?{' '}
                                        <button 
                                            type="button"
                                            onClick={() => setActiveTab("login")} 
                                            className="underline hover:text-primary"
                                        >
                                            Login
                                        </button>
                                    </p>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
