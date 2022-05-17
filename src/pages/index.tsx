import { useRouter } from "next/router";
import { Element } from "react-scroll";
import Auth from "@components/layout/auth";
import React, { useEffect, useState } from "react";
import PageLoader from "@components/ui/page-loader/page-loader";
import styles from "../components/ui/page-loader/page-loader.module.css";
import Cookies from "js-cookie";

export default function HomePage() {
  const router = useRouter();



 
  return (
    <>
    <div
      className="w-full h-screen flex fixed top-0 left-0 right-0 bottom-0 flex-col z-50 bg-white dark:bg-black items-center justify-center"
    >
      <div className="flex relative">
        <div className={styles.page_loader}></div>
        <h3 className="text-sm font-semibold text-body italic absolute top-1/2 -mt-2 w-full text-center">
          Carreg...
        </h3>
      </div>
    </div>
    </>
  );
}

HomePage.Layout = Auth;
