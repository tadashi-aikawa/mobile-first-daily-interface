import * as React from "react";
import { HTMLMeta } from "../utils/meta";

export const HTMLCard = ({ meta }: { meta: HTMLMeta }) => (
  <div className="free-writing-html-card">
    {meta.coverUrl && (
      <img src={meta.coverUrl} className="free-writing-html-card-image" />
    )}
    <div className="free-writing-html-card-content">
      <div className="free-writing-html-card-header">
        <img
          src={meta.faviconUrl}
          className="free-writing-html-card-site-icon"
        />
        <span className="free-writing-html-card-site-name">
          {meta.siteName}
        </span>
      </div>
      <div className="free-writing-html-card-body">{meta.title}</div>
    </div>
    <a href={meta.originUrl}></a>
  </div>
);
