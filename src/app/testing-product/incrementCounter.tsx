/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title: any;
};

export default function IncrementCounter({ title }: Props) {
  const [count, setCount] = useState(0);
  // const { ref, inView } = useInView({
  //   triggerOnce: true,
  // });

  useEffect(() => {
    const finalCount = title;
    let currentCount = 0;
    const increment = Math.ceil(finalCount / 50);
    const timer = setInterval(() => {
      currentCount += increment;
      if (currentCount >= finalCount) {
        currentCount = finalCount;
        clearInterval(timer);
      }
      setCount(currentCount);
    }, 30);

    return () => clearInterval(timer);
  }, []);
  if (typeof title !== "number") return title;

  return <div>{count}</div>;
}
