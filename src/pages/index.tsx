import React from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Dashboard from "./dashboard/Dashboard";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dyslexia App | VBSD</title>
        <meta name="description" content="Demo Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Dashboard />
    </>
  );
};

export default Home;
