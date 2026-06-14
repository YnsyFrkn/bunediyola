"use client";

import { useEffect, useState } from "react";

import { incrementPostViewCount } from "@/actions/postActions";

type PostViewCountProps = {
  postId: string;
  initialCount: number;
};

export function PostViewCount({ postId, initialCount }: PostViewCountProps) {
  const [viewCount, setViewCount] = useState(initialCount);

  useEffect(() => {
    const storageKey = `bunediyola:viewed:${postId}`;

    if (window.sessionStorage.getItem(storageKey)) {
      return;
    }

    window.sessionStorage.setItem(storageKey, "1");

    void incrementPostViewCount(postId)
      .then((updatedCount) => {
        if (updatedCount !== null) {
          setViewCount(updatedCount);
        }
      })
      .catch(() => {
        window.sessionStorage.removeItem(storageKey);
      });
  }, [postId]);

  return <span className="text-sm text-[#6b7280]">{viewCount} goruntuleme</span>;
}
