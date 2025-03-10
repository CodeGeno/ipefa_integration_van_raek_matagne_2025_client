
import { cn } from "@/lib/utils"

import {Button, Card, CardContent, Input, Label } from "./ui";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Réinitialiser mot de passe</h1>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                />
              </div>
              <Button type="submit" className="w-full">
               Réinitialiser mot de passe
              </Button> 
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
                src="https://i.pinimg.com/736x/56/59/d3/5659d3cc7968ba91c75f9576625cd553.jpg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
