import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ReactComponent as PlayIcon } from "./assets/play.svg";
import { ReactComponent as PauseIcon } from "./assets/pause.svg";
import { ReactComponent as ExpandIcon } from "./assets/expand.svg";
import { ReactComponent as CompressIcon } from "./assets/compress.svg";
import { VolumeControl } from "./VolumeControl";
import { Progress } from "./Progress";
import { Settings } from "./Settings";
import { TimeText } from "./TimeText";
import { LoadingIndicator } from "./LoadingIndicator";

export interface IVideoLink {
  link: string;
  quality: string;
  rendition: string;
  type: string;
}

interface IVideoPlayer {
  links: IVideoLink[];
}

export const VideoPlayer: React.FC<IVideoPlayer> = ({ links }) => {
  const [paused, setPaused] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [sortLinks, setSortLinks] = useState<IVideoLink[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const playFn = () => videoRef.current?.play();

  const pauseFn = () => videoRef.current?.pause();

  const exitFullScreenFn = () => {
    document.exitFullscreen();
    setFullScreen(false);
  };

  const fullScreenFn = () => {
    if (videoRef.current) {
      const { parentElement } = videoRef.current;
      if (parentElement) {
        parentElement.requestFullscreen();
        setFullScreen(true);
      }
    }
  };

  const onLoadStart = () => setLoading(true);

  const onLoaded = () => setLoading(false);

  const onVideoClick = () => {
    if (paused) {
      playFn();
    } else {
      pauseFn();
    }
  };

  const onPlayState = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setPaused(e.currentTarget.paused);
  };

  useEffect(() => {
    const sLinks = links.sort((a, b) =>
      b.rendition.localeCompare(a.rendition, undefined, {
        numeric: true,
      })
    );
    setSortLinks(sLinks);
  }, [links]);

  useEffect(() => {
    document.onkeydown = (e: KeyboardEvent) => {
      const { code } = e;
      if (videoRef.current) {
        const { currentTime, duration, paused } = videoRef.current;
        if (code === "ArrowRight" && currentTime + 5 < duration) {
          videoRef.current.currentTime = currentTime + 5;
        }
        if (code === "ArrowLeft" && currentTime - 5 > 0) {
          videoRef.current.currentTime = currentTime - 5;
        }
        if (code === "Space") {
          paused ? playFn() : pauseFn();
        }
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      setPaused(videoRef.current.paused);
    }
  }, [videoRef]);

  return (
    <Container>
      <Video
        ref={videoRef}
        autoPlay
        controls={false}
        onPause={onPlayState}
        onPlay={onPlayState}
        onClick={onVideoClick}
        onLoadStart={onLoadStart}
        onLoadedData={onLoaded}
      >
        {links.map(({ link, quality, rendition, type }) => (
          <source
            key={`video_source_${quality}_${rendition}`}
            src={link}
            type={type}
          />
        ))}
      </Video>
      {loading && (
        <LoadingDim>
          <LoadingIndicator />
        </LoadingDim>
      )}
      <ControlBar>
        <Progress videoRef={videoRef} links={sortLinks} />
        <BetWeenBox>
          <ControlBox>
            {paused ? (
              <PlayIcon onClick={playFn} />
            ) : (
              <PauseIcon onClick={pauseFn} />
            )}
            <VolumeControl videoRef={videoRef} />
            <TimeText videoRef={videoRef} />
          </ControlBox>
          <ControlBox>
            <Settings videoRef={videoRef} links={sortLinks} />
            {!fullScreen ? (
              <ExpandIcon onClick={fullScreenFn} />
            ) : (
              <CompressIcon onClick={exitFullScreenFn} />
            )}
          </ControlBox>
        </BetWeenBox>
      </ControlBar>
    </Container>
  );
};

const Container = styled.div`
  position: relative;

  width: 1280px;
  height: 720px;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;

  cursor: pointer;
`;

const ControlBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  padding: 0 20px;

  background: linear-gradient(transparent, 60%, black);
  svg {
    width: 20px;
    height: 20px;
    & > path {
      fill: white;
    }

    cursor: pointer;
  }
  z-index: 5;
`;

const BetWeenBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ControlBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  padding: 15px;
`;

const LoadingDim = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background-color: rgb(15 15 15 / 20%);

  z-index: 1;
`;
