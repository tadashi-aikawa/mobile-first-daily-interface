import * as React from "react";
import { HTMLMeta } from "../utils/meta";

export const HTMLCard = ({ meta }: { meta: HTMLMeta }) => (
  <div className="mfdi-html-card">
    {meta.coverUrl && (
      <img src={meta.coverUrl} className="mfdi-html-card-image" />
    )}
    <div className="mfdi-html-card-content">
      <div className="mfdi-html-card-header">
        <img
          src={meta.faviconUrl}
          className="mfdi-html-card-site-icon"
        />
        <span className="mfdi-html-card-site-name">
          {meta.siteName}
        </span>
      </div>
      <div className="mfdi-html-card-body">{meta.title}</div>
    </div>
    <a href={meta.originUrl}></a>
  </div>
);
