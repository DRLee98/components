import React, { SVGProps, useEffect, useState } from "react";
import styled from "styled-components";

import { ReactComponent as VolumeHighIcon } from "./assets/volume-high.svg";
import { ReactComponent as VolumeMidIcon } from "./assets/volume-mid.svg";
import { ReactComponent as VolumeLowIcon } from "./assets/volume-low.svg";
import { ReactComponent as VolumeOffIcon } from "./assets/volume-off.svg";
import { ReactComponent as MuteIcon } from "./assets/volume-x.svg";

interface IVolumeControl {
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const VolumeControl: React.FC<IVolumeControl> = ({ videoRef }) => {
  const [muted, setMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);

  const VolumeIcon = (props: SVGProps<SVGSVGElement>) => {
    if (muted) return <MuteIcon {...props} />;
    if (volume === 0) return <VolumeOffIcon {...props} />;
    if (volume < 0.3) return <VolumeLowIcon {...props} />;
    if (volume < 0.6) return <VolumeMidIcon {...props} />;
    return <VolumeHighIcon {...props} />;
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const volumeChangeFn = (x: number, width: number) => {
    if (videoRef.current) {
      if (muted) {
        videoRef.current.muted = false;
        setMuted(false);
      }
      const volume = x / width > 1 ? 1 : x / width < 0 ? 0 : x / width;
      videoRef.current.volume = volume;
      setVolume(volume);
    }
  };

  const onChangeVolume = (e: React.MouseEvent<HTMLDivElement>) => {
    const {
      nativeEvent: { offsetX },
      currentTarget: { clientWidth },
    } = e;
    volumeChangeFn(offsetX, clientWidth);
  };

  const onVolumeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget } = e;
    const onMouseMove = ({ offsetX }: MouseEvent) => {
      volumeChangeFn(offsetX, currentTarget.clientWidth);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", () =>
      window.removeEventListener("mousemove", onMouseMove)
    );
    window.addEventListener("mouseout", () =>
      window.removeEventListener("mousemove", onMouseMove)
    );
  };

  useEffect(() => {
    if (videoRef.current) {
      if (muted) {
        setVolume(0);
      } else {
        setVolume(videoRef.current.volume);
      }
    }
  }, [muted, videoRef]);

  useEffect(() => {
    if (videoRef.current) {
      setMuted(videoRef.current.muted);
      setVolume(videoRef.current.volume);
    }
  }, [videoRef]);

  return (
    <Container>
      <VolumeIcon onClick={toggleMute} />
      <VolumSliderBox>
        <VolumeSlider
          volume={volume}
          onClick={onChangeVolume}
          onMouseDown={onVolumeMouseDown}
        >
          <VolumeSliderHandle />
        </VolumeSlider>
      </VolumSliderBox>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;

  &:hover {
    & > div {
      width: 100px;
    }
  }
`;

const VolumSliderBox = styled.div`
  width: 0px;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 0.3s ease;
  overflow: hidden;
`;

interface IVolumeSlider {
  volume: number;
}

const VolumeSlider = styled.div<IVolumeSlider>`
  width: 80px;
  height: 6px;
  padding: 10px;

  position: relative;

  & > div {
    left: ${({ volume }) => `${volume * 100}%`};
  }
  &::before {
    content: "";
    width: 100%;
    height: 6px;

    position: absolute;
    left: 0;
    bottom: 50%;
    transform: translateY(50%);

    background-color: #3535359d;
    border-radius: 999px;
  }
  &::after {
    content: "";
    width: ${({ volume }) => `${volume * 100}%`};
    height: 6px;

    position: absolute;
    left: 0;
    bottom: 50%;
    transform: translateY(50%);

    background-color: white;
    border-radius: 999px;
  }

  cursor: pointer;
`;

const VolumeSliderHandle = styled.div`
  width: 10px;
  height: 10px;

  position: absolute;
  left: 50%;
  bottom: 50%;
  transform: translateY(50%) translateX(-50%);

  background-color: white;
  border-radius: 999px;

  pointer-events: none;

  cursor: pointer;
`;
