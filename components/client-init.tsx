"use client";

import { useEffect } from "react";
import { resetIfServerRestarted, initMockAnswers, initMockAnonymousQuestions, getCurrentUser } from "@/lib/localStorage";
import { getStoredClassSession } from "@/lib/client-session";

export default function ClientInit() {
  useEffect(() => {
    resetIfServerRestarted();
    initMockAnswers();
    const user = getCurrentUser();
    const classSession = getStoredClassSession();
    if (user && (!classSession || !user.classId || user.classId === classSession.classId)) {
      initMockAnonymousQuestions(user.id);
    }
  }, []);
  return null;
}
