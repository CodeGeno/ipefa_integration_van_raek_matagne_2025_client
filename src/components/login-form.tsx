"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useContext } from "react";
import { AccountContext } from "@/app/context";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { post } from "@/app/fetch";
import { setCookie } from "cookies-next/client";
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  interface LoginFormProps {
    email: string;
    password: string;
  }

  const { accountData, setAccountData } = useContext(AccountContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<LoginFormProps>({
    email: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorMessage(null);
  };
  interface AccountData {
    token: string;
    role: string;
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await post<AccountData>("/security/login/", formData);
      const data = response.data;

      if (response.success) {
        localStorage.setItem("token", data?.token ?? "");
        localStorage.setItem("role", data?.role ?? "");
        setAccountData({
          role: data?.role ?? "",
          token: data?.token ?? "",
        });

        toast({
          title: "Connexion réussie",
          description: "Vous êtes connecté avec succès",
        });

        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setErrorMessage("Email ou mot de passe incorrect");
        toast({
          title: "Erreur de connexion",
          description:
            "Veuillez vérifier votre adresse email et votre mot de passe",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage(
        "Une erreur s'est produite lors de la connexion. Veuillez réessayer."
      );
      console.error("Erreur de connexion:", error);
      toast({
        title: "Erreur de connexion",
        description:
          "Une erreur s'est produite lors de la connexion. Veuillez réessayer.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  const { toast } = useToast();
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Connexion</h1>
                <p className="text-balance text-muted-foreground">
                  Connectez-vous à votre compte scolaire
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent mr-2"></div>
                    Connexion en cours...
                  </div>
                ) : (
                  "Connexion"
                )}
              </Button>
              {errorMessage && (
                <div className="text-red-500 text-sm text-center mt-2">
                  {errorMessage}
                </div>
              )}
            </div>
          </form>
          <div className="relative hidden overflow-hidden md:block">
            <img
              src="https://i.pinimg.com/736x/56/59/d3/5659d3cc7968ba91c75f9576625cd553.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
