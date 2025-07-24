"use client";
import EyeTracking from "@/components/eye-tracking";
import React, { useEffect, useState } from "react";

export default function page({ params }) {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setSessionId(resolvedParams.id);
    };
    unwrapParams();
  }, [params]);

  return (
    <div>
      <EyeTracking sessionId={sessionId} />
    </div>
  );
}
