import { PropsWithChildren } from "react";

export function Workflowpage({ children }: PropsWithChildren) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-accent dark:bg-url['/paper-dark.svg'] light:bg-[url('/paper.svg')]">
      <div className="w-full max-w-md p-8 space-y-6 bg-primary-foreground rounded-md shadow-md">
        {children}
      </div>
    </div>
  );
}
