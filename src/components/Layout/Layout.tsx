import React, { ReactNode } from "react";

import Head from "next/head";
import Header from "../Header/Header";
import styles from "@/styles/Home.module.css";

interface LayoutProps {
  children: ReactNode;
}

function Layout ({ children }: LayoutProps)  {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} `} >
        <Header />
        {children}
      </main>
    </div>
  );
};

export default Layout;
