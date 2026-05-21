"use client";

import { useEffect } from "react";
import { initMockAnswers } from "@/lib/localStorage";

export default function ClientInit() {
  useEffect(() => {
    initMockAnswers();
  }, []);
  return null;
}
