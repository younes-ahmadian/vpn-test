"use client";

import NetworkGuard from "@/components/network-guard";
import { useEffect } from "react";

export default function Home() {
  return (
    <>
      <NetworkGuard />
      <div>Home page</div>
    </>
  );
}
