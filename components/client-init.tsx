"use client";

import { useEffect } from "react";
import { resetIfServerRestarted, initMockAnswers, initMockAnonymousQuestions, getCurrentUser } from "@/lib/localStorage";

export default function ClientInit() {
  useEffect(() => {
    resetIfServerRestarted();
    initMockAnswers();
    const user = getCurrentUser();
    if (user) initMockAnonymousQuestions(user.id);
  }, []);
  return null;
}
