import { FC, PropsWithChildren, useCallback, useEffect, useRef } from "react";
import { classNames } from "#/utils/classNames";
import classes from "./Scroller.module.css";

const ThumbHeightMin = 64;
const ThumbWidth = 8;
const ThumbOffset = 6;

export interface ScrollerProps {
  padded?: boolean;
}

export const Scroller: FC<PropsWithChildren<ScrollerProps>> = ({
  children,
  padded,
}) => {
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
    if (contentWrapper.current && thumb.current) {
      const { offsetHeight, scrollHeight } = contentWrapper.current;
      if (scrollHeight <= offsetHeight) {
        thumb.current.style.visibility = "hidden";
      } else {
        thumb.current.style.visibility = "visible";

        const calculatedThumbHeight =
          offsetHeight * (offsetHeight / scrollHeight);
        const thumbHeight = Math.min(
          Math.max(ThumbHeightMin, calculatedThumbHeight),
          offsetHeight - ThumbOffset * 2
        );
        thumb.current.style.height = `${thumbHeight}px`;
      }
    }

    onScoll();
  }, []);

  const onScoll = useCallback(() => {
    if (contentWrapper.current && thumb.current) {
      const { offsetHeight, scrollHeight, scrollTop } = contentWrapper.current;
      if (scrollHeight > offsetHeight) {
        const { offsetHeight: thumbHeight } = thumb.current;

        const scrollSize = scrollHeight - offsetHeight;
        const scrollPercent = scrollTop / scrollSize;

        const scrollValue =
          scrollPercent < 0 ? 0 : scrollPercent > 1 ? 1 : scrollPercent;

        thumb.current.style.transform = `translateY(${
          (offsetHeight - thumbHeight - ThumbOffset * 2) * scrollValue
        }px)`;
      }
    }
  }, []);

  return (
    <div className="relative h-full w-full flex-grow">
      <div
        ref={contentWrapper}
        onScroll={onScoll}
        className={classes.contentWrapper}
      >
        <div
          ref={content}
          style={{
            paddingRight: padded ? ThumbWidth + ThumbOffset * 2 : 0,
          }}
        >
          {children}
        </div>
      </div>
      <div className={classes.scrollbar}>
        <div
          ref={thumb}
          className={classNames("bg-black dark:bg-white", classes.thumb)}
          style={{
            top: ThumbOffset,
            right: ThumbOffset,
            width: ThumbWidth,
            borderRadius: ThumbWidth / 2,
          }}
        />
      </div>
    </div>
  );
};
