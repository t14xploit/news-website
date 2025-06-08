import React from "react";
import Image from "next/image";

interface EditorProfileModelProps {
  image?: string | null;
}

export default function EditorProfileModel({ image }: EditorProfileModelProps) {
  return (
    <Image
      src={image || "https://placehold.co/100x100?text=Default"}
      alt="Editor Avatar"
      width={80}
      height={80}
      className="rounded-full object-cover"
    />
  );
}
