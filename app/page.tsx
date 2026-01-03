"use client";

import CheckVPN from "@/components/check-vpn";
import { useEffect } from "react";

export default function Home() {
  return (
    <>
      <CheckVPN />
      <div>Home page</div>
    </>
  );
}
