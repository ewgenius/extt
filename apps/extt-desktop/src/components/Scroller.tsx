import { classNames } from "#/utils/classNames";
import { FC, PropsWithChildren } from "react";
import classes from "./Scroller.module.css";

export const Scroller: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div className="w-full h-full flex-grow relative">
      <div className={classes.content}>{children}</div>
      <div className={classes.scrollbar}>
        <div className={classes.thumb} />
      </div>
    </div>
  );
};
