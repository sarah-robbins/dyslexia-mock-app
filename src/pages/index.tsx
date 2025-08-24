import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { type NextPage } from "next";
import Head from "next/head";
import { Card } from "primereact/card";

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to dashboard
    void router.push('/dashboard');
  }, [router]);

  return (
    <>
      <Head>
        <title>Dyslexia App | VBSD</title>
        <meta name="description" content="Demo Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-column justify-content-center align-items-center text-center m-4 sm:m-0">
        <Card>
          test
        </Card>
      </main>
    </>
  );
};

export default Home;
