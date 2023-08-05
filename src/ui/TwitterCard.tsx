import * as React from "react";
import { TwitterMeta } from "../utils/meta";
import parse from "html-react-parser";

export const TwitterCard = ({ meta }: { meta: TwitterMeta }) => {
  return (
    <div className="free-writing-html-card">
      <div className="free-writing-html-card-content">
        <div className="free-writing-html-card-header">
          <img
            src="https://abs.twimg.com/favicons/twitter.3.ico"
            className="free-writing-html-card-site-icon"
          />
          <span className="free-writing-html-card-site-name">X / Twitter</span>
        </div>
        <div className="free-writing-html-card-body">{parse(meta.html)}</div>
      </div>
      <a href={meta.url}></a>
    </div>
  );
};
