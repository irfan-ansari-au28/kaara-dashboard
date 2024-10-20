import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@/config/authConfig';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Login({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      console.log('Sign up successful!');
    } catch (error) {
      console.error('Sign up failed:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const { instance } = useMsal();

  const handleLogin = () => {
    console.log("MS Login")
      instance.loginRedirect(loginRequest).catch(e => {
          console.error(e);
      });
  };



  return (
    <div className="h-screen w-full flex overflow-hidden">
      {/* Left Panel with Gradient */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-b from-gray-900 via-gray-800 to-black">
        <div className="absolute top-6 left-6">
          <div className="flex items-center gap-2">
            {/* <div className="h-8 w-8 bg-white/90 rounded flex items-center justify-center"> */}
            {/* <div className="p-4 h-20 w-32 rounded bg-white/90 " >
                <img src="/src/assets/images/kaara-logo.png" alt="Kaara Logo" className="w-auto mb-4" />
              </div> */}
            {/* <span className="text-black font-bold">A</span> */}
            {/* </div> */}
            {/* <span className="text-white font-semibold">Acme Inc</span> */}
          </div>
        </div>
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Kaara has given us a platform with all of the power, flexibility, scalability and security we need. 
               Implementation is also so much easier when you are with people you know and trust."
            </p>
            <footer className="text-sm">
            Santrupta Das
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col w-full lg:w-1/2">
        <div className="flex justify-end p-6">
          <div className="p-2  " >
            <img src="/src/assets/images/kaara-logo.png" alt="Kaara Logo" className="w-24 mb-4" />
          </div>
          {/* <span className="text-sm font-medium">
            Login
          </span> */}
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-40">
          <div className="w-full max-w-sm space-y-5">
            <div className="flex flex-col text-center space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to create your account
              </p>
            </div>

            <div className={`w-full ${className || ''}`} {...props}>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : null}
                  Sign in with Email
                </Button>
              </form>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    OR CONTINUE WITH
                  </span>
                </div>
              </div>

              <Button variant="outline" type="button" className="w-full" disabled={isLoading} onClick={handleLogin}>
                {isLoading ? (
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 23 23">
                    <path fill="#00a4ef" d="M11.4 24H0V12.6h11.4V24z" />
                    <path fill="#ff4b1f" d="M24 24H12.6V12.6H24V24z" />
                    <path fill="#7cbb00" d="M11.4 11.4H0V0h11.4v11.4z" />
                    <path fill="#ffb900" d="M24 11.4H12.6V0H24v11.4z" />
                  </svg>
                )}
                Microsoft
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-5">
                By clicking continue, you agree to our{' '}
                <a href="#" className="underline underline-offset-4 hover:text-primary">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="underline underline-offset-4 hover:text-primary">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}