import React from "react";
import Link from "next/link";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function AssessmentDonePage() {
  return (
    <main className="bg-slate-50">
      <div className="mx-auto min-h-[70vh] max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
        <Card className="p-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Thanks for completing the assessment!</h1>
          <p className="mt-4 text-slate-600">
            We’re processing your responses. Check back soon for insights and next steps tailored to you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/">
              <Button variant="secondary">Back to home</Button>
            </Link>
            <Link href="/assess/mini">
              <Button variant="gradient">Explore more challenges</Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
