
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";

const NotFound = () => {
  return (
    <PageLayout>
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="font-serif text-9xl font-bold text-primary">404</h1>
        <h2 className="mt-6 font-serif text-3xl font-medium">Page Not Found</h2>
        <p className="mt-4 max-w-md text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="mt-8 rounded-full">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" /> Return to Home
          </Link>
        </Button>
      </div>
    </PageLayout>
  );
};

export default NotFound;
