import * as React from "react";
import { ImageMeta } from "../utils/meta";

export const ImageCard = ({ meta }: { meta: ImageMeta }) => {
  const url = window.URL || window.webkitURL;
  const src = url.createObjectURL(meta.data);
  return (
    <div className="free-writing-image-card">
      <img src={src} className="free-writing-image-card-image" />
    </div>
  );
};
