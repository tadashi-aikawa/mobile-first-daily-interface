import * as React from "react";
import { ImageMeta } from "../utils/meta";

export const ImageCard = ({ meta }: { meta: ImageMeta }) => {
  const url = window.URL || window.webkitURL;
  const src = url.createObjectURL(meta.data);
  return (
    <div className="mfdi-image-card">
      <img src={src} className="mfdi-image-card-image" />
    </div>
  );
};
