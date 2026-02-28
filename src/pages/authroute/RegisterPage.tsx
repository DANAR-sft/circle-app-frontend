import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { PostRegister } from "../../hooks/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const formRegister = async (
    e: React.FormEvent<HTMLFormElement>,
    data: HTMLFormElement,
  ) => {
    e.preventDefault();
    const form = new FormData(data);
    const fullname = form.get("fullname") as string;
    const username = form.get("username") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    try {
      await dispatch(
        PostRegister({ fullname, username, email, password }),
      ).unwrap();

      navigate("/");
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div className="md:flex md:justify-center md:items-center md:h-screen md:w-full">
      <Card className="w-full max-w-md h-screen md:h-auto rounded-none md:rounded-lg justify-center">
        <CardHeader>
          <CardTitle className="text-5xl font-bold text-green-500">
            circle
          </CardTitle>
          <CardTitle>Register a new account</CardTitle>
          <CardDescription>
            Enter your email below to register a new account
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
                <span>email or username is already taken</span>
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <form onSubmit={(e) => formRegister(e, e.currentTarget)}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullname"
                  name="fullname"
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  required
                />
              </div>
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
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  minLength={6}
                  required
                />
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Already have account?
                  <span
                    onClick={() => {
                      window.location.href = "/login";
                    }}
                    className="text-green-500 hover:underline ml-1 hover:cursor-pointer"
                  >
                    Login.
                  </span>
                </span>
                <br />
                <span className="text-sm text-muted-foreground">
                  By registering, you agree to our Terms of Service and Privacy
                  Policy.
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
                Creating Account...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                Register
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
