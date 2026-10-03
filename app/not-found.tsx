import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";

export default function NotFound() {
  return (
    <Section>
      <Container className="py-20 text-center">
        <p className="text-xs font-medium tracking-[0.2em] text-electric uppercase">
          404
        </p>
        <h1 className="font-heading mt-3 text-4xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          The page you requested does not exist or is not published.
        </p>
        <Button render={<Link href="/" />} className="mt-8">
          Back home
        </Button>
      </Container>
    </Section>
  );
}
