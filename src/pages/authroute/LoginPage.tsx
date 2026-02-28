import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PostLogin } from "../../hooks/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function LoginPage() {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const formLogin = async (
    e: React.FormEvent<HTMLFormElement>,
    data: HTMLFormElement,
  ) => {
    e.preventDefault();
    setError(false);

    const form = new FormData(data);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    try {
      await dispatch(PostLogin({ email, password })).unwrap();

      navigate("/");
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div className="md:flex md:justify-center md:items-center md:h-screen md:w-full">
      <Card className="w-full max-w-md h-screen md:h-auto rounded-none md:rounded-lg justify-center">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-5xl font-bold text-green-500">
              circle
            </CardTitle>
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardDescription>
            {error && (
              <div
                className={`text-sm text-red-500 text-center bg-red-400/20 p-2 rounded-md mt-2 relative ${error ? "block" : "hidden"}`}
              >
                <button
                  className="absolute top-0 right-2 cursor-pointer"
                  onClick={() => setError(false)}
                >
                  x
                </button>
                <span>email or password is incorrect</span>
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <form onSubmit={(e) => formLogin(e, e.currentTarget)}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-xs underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Don't have an account?
                  <span
                    onClick={() => {
                      window.location.href = "/register";
                    }}
                    className="text-green-500 hover:underline ml-1 hover:cursor-pointer"
                  >
                    Register
                  </span>
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            {authState.loading ? (
              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 italic"
                disabled
              >
                Login...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                Login
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
