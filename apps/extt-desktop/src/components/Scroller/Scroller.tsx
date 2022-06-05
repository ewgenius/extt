import { FC, PropsWithChildren, useCallback, useEffect, useRef } from "react";
import { classNames } from "#/utils/classNames";
import classes from "./Scroller.module.css";

const ThumbHeight = 64;
const ThumbOffset = 6;

export const Scroller: FC<PropsWithChildren<{}>> = ({ children }) => {
  const content = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onScoll();

    const resizeObserver = new ResizeObserver(() => {
      if (content.current && thumb.current) {
        const { offsetHeight, scrollHeight } = content.current;
        if (scrollHeight <= offsetHeight) {
          thumb.current.style.visibility = "hidden";
        } else {
          thumb.current.style.visibility = "visible";
        }
      }

      onScoll();
    });

    content.current && resizeObserver.observe(content.current);

    return () => {
      content.current && resizeObserver.unobserve(content.current);
    };
  }, []);

  const onScoll = useCallback(() => {
    if (content.current && thumb.current) {
      const { offsetHeight, scrollHeight, scrollTop } = content.current;
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
      <div ref={content} onScroll={onScoll} className={classes.content}>
        {children}
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
