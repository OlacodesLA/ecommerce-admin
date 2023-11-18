import { useEffect, useRef } from "react";

export default function useMounted() {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return mounted;
}

export function getInitials(name: string) {
  const words = name?.split(" ");
  const initials = words?.map((word) => word[0]).join("");
  return initials.toUpperCase();
}
