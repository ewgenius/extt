import { FC, PropsWithChildren, useCallback, useEffect, useRef } from "react";
import { classNames } from "#/utils/classNames";
import classes from "./Scroller.module.css";

const ThumbHeight = 64;
const ThumbOffset = 6;

export const Scroller: FC<PropsWithChildren<{}>> = ({ children }) => {
  const content = useRef<HTMLDivElement>(null);
  const contentWrapper = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(onResize);
    contentWrapper.current && resizeObserver.observe(contentWrapper.current);
    content.current && resizeObserver.observe(content.current);

    return () => {
      contentWrapper.current &&
        resizeObserver.unobserve(contentWrapper.current);
      content.current && resizeObserver.unobserve(content.current);
    };
  }, []);

  const onResize = useCallback(() => {
    console.log("on resize");
    if (contentWrapper.current && thumb.current) {
      const { offsetHeight, scrollHeight } = contentWrapper.current;
      if (scrollHeight <= offsetHeight) {
        thumb.current.style.visibility = "hidden";
      } else {
        thumb.current.style.visibility = "visible";
      }
    }

    onScoll();
  }, []);

  const onScoll = useCallback(() => {
    if (contentWrapper.current && thumb.current) {
      const { offsetHeight, scrollHeight, scrollTop } = contentWrapper.current;
      const calculatedThumbHeight =
        offsetHeight * (offsetHeight / scrollHeight);
      const thumbHeight =
        calculatedThumbHeight < ThumbHeight
          ? ThumbHeight
          : calculatedThumbHeight;
      const scrollSize = scrollHeight - offsetHeight;
      const scrollPercent = scrollTop / scrollSize;

      const scrollValue =
        scrollPercent < 0 ? 0 : scrollPercent > 1 ? 1 : scrollPercent;

      thumb.current.style.height = `${thumbHeight}px`;
      thumb.current.style.transform = `translateY(${
        (offsetHeight - thumbHeight - ThumbOffset * 2) * scrollValue
      }px)`;
    }
  }, []);

  return (
    <div className="w-full h-full flex-grow relative">
      <div
        ref={contentWrapper}
        onScroll={onScoll}
        className={classes.contentWrapper}
      >
        <div ref={content}>{children}</div>
      </div>
      <div className={classes.scrollbar}>
        <div
          ref={thumb}
          className={classNames("bg-black dark:bg-white", classes.thumb)}
          style={{
            top: ThumbOffset,
            right: ThumbOffset,
          }}
        />
      </div>
    </div>
  );
};
