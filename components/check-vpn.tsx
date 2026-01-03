// components/CheckVPN.tsx

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CheckVPN = () => {
  const [isVpn, setIsVpn] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const checkVpnStatus = async () => {
      try {
        // Making the API call to check if VPN is enabled
        const res = await fetch("/api/check-vpn"); // This is the custom API route
        const data = await res.json();

        const res2 = await fetch("/api/get-ip"); // This is the custom API route
        const data2 = await res2.json();

        console.log("ip is", data2);
        console.log("isVpn", data);

        if (data.isVpn) {
          // If VPN is detected, redirect the user to the warning page
          router.replace("/vpn-warning");
        } else {
          setIsVpn(false); // VPN is not detected
        }
      } catch (error) {
        console.error("Error checking VPN:", error);
        setIsVpn(false); // Fallback to no VPN detected
      } finally {
        setIsLoading(false);
      }
    };

    checkVpnStatus();
  }, [router]);

  if (isLoading) return <div>Loading...</div>;

  return isVpn === false ? <div>Content Page Here</div> : null;
};

export default CheckVPN;
