import { Slot } from "expo-router";
import React from "react";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Slot />
    </>
  );
}
