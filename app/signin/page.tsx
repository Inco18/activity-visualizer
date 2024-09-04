import React from "react";
import SignInHeader from "./SignInHeader";
import SignInForm from "./SignInForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SmallFooter from "@/components/UI/SmallFooter";
import { authOptions } from "@/utils/authOptions";

const SignIn = async () => {
  const session = await getServerSession(authOptions);
  if (session) redirect("/app");
  return (
    <>
      <SignInHeader />
      <main className="flex items-center justify-center flex-1">
        <SignInForm />
      </main>
      <SmallFooter bg="bg-dark-800" />
    </>
  );
};

export default SignIn;
