import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

interface Action {
  label: string;
  href: string;
}

interface EmptyStateProps {
  title: string;
  description: string;
  primaryAction: Action;
  secondaryAction?: Action;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  primaryAction,
  secondaryAction,
  icon = <Search className="w-10 h-10 text-primary" />,
}: EmptyStateProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6 pb-8 px-8 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          {icon}
        </div>
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button asChild className="w-full">
            <Link href={primaryAction.href}>{primaryAction.label}</Link>
          </Button>
          {secondaryAction && (
            <Button asChild variant="outline" className="w-full">
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
