import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { IVideoLink } from ".";
import { timeNumberToString } from "./utils";

interface IProgress {
  videoRef: React.RefObject<HTMLVideoElement>;
  links: IVideoLink[];
}

interface IHighlighter {
  title: string;
  percentage: number;
  eventTime: number;
}

export const Progress: React.FC<IProgress> = ({ videoRef, links }) => {
  const [progress, setProgress] = useState<number>(0);
  const [previewLeft, setPreviewLeft] = useState<number>(0);
  const [highlighters, setHighlighters] = useState<IHighlighter[]>([]);
  const [hoverHighlight, setHoverHighlighters] = useState<IHighlighter>();
  const [hoverTime, setHoverTime] = useState<string>("00:00:00");

  const previewRef = useRef<HTMLVideoElement>(null);

  const videoTimeSet = (x: number, width: number) => {
    if (videoRef.current) {
      const { duration } = videoRef.current;
      const time = x / width > 1 ? 1 : x / width < 0 ? 0 : x / width;
      videoRef.current.currentTime = duration * time;
      setProgress(time);
    }
  };

  const onClickProgress = (e: React.MouseEvent<HTMLDivElement>) => {
    const {
      nativeEvent: { offsetX },
      currentTarget: { clientWidth },
    } = e;
    videoTimeSet(offsetX, clientWidth);
  };

  const onMouseDownProgress = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget } = e;
    const onMouseMove = ({ offsetX }: MouseEvent) => {
      videoTimeSet(offsetX, currentTarget.clientWidth);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", () =>
      window.removeEventListener("mousemove", onMouseMove)
    );
    window.addEventListener("mouseout", () =>
      window.removeEventListener("mousemove", onMouseMove)
    );
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (previewRef.current) {
      const {
        nativeEvent: { offsetX },
        currentTarget: { clientWidth },
      } = e;
      const { duration, clientWidth: previewWidth } = previewRef.current;
      const time = duration * (offsetX / clientWidth);
      previewRef.current.currentTime = time;

      const findHighlight = highlighters.find(
        ({ eventTime }) => eventTime > time - 5 && eventTime < time + 5
      );
      setHoverHighlighters(findHighlight);
      setHoverTime(timeNumberToString(Math.floor(time)));

      let left = offsetX;
      if (offsetX + previewWidth / 2 > clientWidth)
        left = clientWidth - previewWidth / 2;
      if (offsetX < previewWidth / 2) left = previewWidth / 2;
      setPreviewLeft(left);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("timeupdate", (e) => {
        const { currentTime, duration } = e.target as HTMLVideoElement;
        setProgress(currentTime / duration);
      });
    }
  }, [videoRef]);

  return (
    <Container
      progress={progress}
      onClick={onClickProgress}
      onMouseDown={onMouseDownProgress}
      onMouseMove={onMouseMove}
    >
      {highlighters.map(({ percentage }) => (
        <Highlighter key={`high_light_${percentage}`} percentage={percentage} />
      ))}
      {links.length > 0 && (
        <PreviewBox left={previewLeft}>
          {hoverHighlight && <PreviewText>{hoverHighlight.title}</PreviewText>}
          <PreviewImg src={links[links.length - 1].link} ref={previewRef} />
          <PreviewText>{hoverTime}</PreviewText>
        </PreviewBox>
      )}
    </Container>
  );
};

interface IContainer {
  progress: number;
}

const Container = styled.div<IContainer>`
  width: 100%;
  height: 5px;

  position: relative;

  background-color: #3535359d;

  cursor: pointer;

  &:hover {
    height: 8px;
    div:last-child {
      display: flex;
    }
  }
  &::after {
    content: "";
    width: ${({ progress }) => `${progress * 100}%`};
    height: 100%;

    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;

    background-color: #0099fe;
  }
  transition: all 0.2s ease;
`;

interface IHighlighterStyle {
  percentage: number;
}

const Highlighter = styled.div<IHighlighterStyle>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ percentage }) => percentage * 100}%;
  width: 10px;
  transform: translateX(-50%);

  background-color: rgb(255 255 255 / 50%);

  z-index: 1;
  pointer-events: none;
`;

interface IPreviewBox {
  left: number;
}

const PreviewBox = styled.div<IPreviewBox>`
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;

  background-color: white;
  border: 2px solid #e6e6e6;
  border-radius: 4px;
  box-shadow: 8px 8px 16px rgba(58, 70, 93, 0.07);

  padding: 5px;

  position: absolute;
  top: -20px;
  left: ${({ left }) => left}px;

  transform: translateY(-100%) translateX(-50%);
`;

const PreviewText = styled.span`
  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
`;

const PreviewImg = styled.video`
  width: 178px;
  height: 100px;
`;
