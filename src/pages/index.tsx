import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { type NextPage } from "next";
import Head from "next/head";
import { Card } from "primereact/card";
import UserSelector from "@/components/UserSelector/UserSelector";
import { Button } from "primereact/button";

const Home: NextPage = () => {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    // Check if user was previously selected
    const savedUserId = localStorage.getItem('demoUserId');
    if (savedUserId) {
      setSelectedUserId(parseInt(savedUserId));
    }
  }, []);

  const handleUserSelect = (userId: number) => {
    setSelectedUserId(userId);
  };

  const enterDashboard = () => {
    if (selectedUserId) {
      void router.push('/dashboard');
    }
  };

  return (
    <>
      <Head>
        <title>Dyslexia App | VBSD</title>
        <meta name="description" content="Demo Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-column justify-content-center align-items-center text-center m-4 sm:m-0">
        <Card>
          <div className="p-6">
            <h1 className="landing-title mb-4">
              Dyslexia <br /> Dashboard Demo
            </h1>
            
            <UserSelector 
              onUserSelect={handleUserSelect} 
              selectedUserId={selectedUserId || undefined}
            />
            
            <Button 
              label="Enter Dashboard" 
              onClick={enterDashboard}
              disabled={!selectedUserId}
              className="mt-4"
            />
          </div>
        </Card>
      </main>
    </>
  );
};

export default Home;
