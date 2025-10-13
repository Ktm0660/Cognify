import React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function AssessmentDonePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-20">
      <div className="mx-auto max-w-2xl">
        <Card className="p-10 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">Assessment complete</h1>
          <p className="mt-4 text-slate-600">
            Thanks for taking the assessment. We&apos;ll crunch the numbers and keep you posted when your insights are ready.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/">
              <Button variant="primary">Return home</Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
