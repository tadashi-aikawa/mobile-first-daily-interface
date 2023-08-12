import * as React from "react";
import { TwitterMeta } from "../utils/meta";
import parse from "html-react-parser";

export const TwitterCard = ({ meta }: { meta: TwitterMeta }) => {
  return (
    <div className="mfdi-html-card">
      <div className="mfdi-html-card-content">
        <div className="mfdi-html-card-header">
          <img
            src="https://abs.twimg.com/favicons/twitter.3.ico"
            className="mfdi-html-card-site-icon"
          />
          <span className="mfdi-html-card-site-name">X / Twitter</span>
        </div>
        <div className="mfdi-html-card-body">{parse(meta.html)}</div>
      </div>
      <a href={meta.url}></a>
    </div>
  );
};
