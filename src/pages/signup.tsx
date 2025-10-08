import React, { useState } from "react";
import { useRouter } from "next/router";

export default function SignupPage() {
  const router = useRouter();
  const [email,setEmail]=useState(""); const [pw,setPw]=useState("");

  async function handleSignup(e:React.FormEvent){
    e.preventDefault();
    // TODO: real auth
    router.push("/assess/mini");
  }

  return (
    <main className="max-w-sm mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold">Create your account</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSignup}>
        <input className="w-full rounded-md border px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full rounded-md border px-3 py-2" placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)} />
        <button className="w-full rounded-md bg-indigo-600 text-white font-semibold py-2 hover:bg-indigo-500">Sign up</button>
      </form>
    </main>
  );
}
