"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NetworkGuard() {
  const router = useRouter();

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        const res = await fetch("/api/check-vpn");
        const data = await res.json();

        console.log("data in guard", data);

        if (data.isVpn) {
          router.replace("/vpn-warning");
        }
      } catch (e) {
        console.error("Network check failed", e);
      }
    };

    checkNetwork();
  }, [router]);

  return null;
}
