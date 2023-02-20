import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as GearIcon } from './assets/gear.svg';
import { ReactComponent as ArrowIcon } from './assets/arrow_left.svg';
import { IVideoLink } from '.';

interface ISettings {
  videoRef: React.RefObject<HTMLVideoElement>;
  links: IVideoLink[];
}

export const Settings: React.FC<ISettings> = ({ videoRef, links }) => {
  const [speed, setSpeed] = useState<number>(1);
  const [quality, setQuality] = useState<IVideoLink>();
  const [open, setOpen] = useState<boolean>(false);
  const [selectMenu, setSelectMenu] = useState<'speed' | 'quality'>();

  const toggleOpen = () => {
    setOpen(prev => !prev);
    if (selectMenu) resetMenu();
  };

  const resetMenu = () => setSelectMenu(undefined);

  const speedSet = (s: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = s;
      setSpeed(s);
      setOpen(false);
    }
  };

  const qualitySet = (src: string) => {
    if (videoRef.current) {
      videoRef.current.src = `${src}#t=${videoRef.current.currentTime}`;
      const currentLink = links.find(({ link }) => link === src);
      setQuality(currentLink);
      setOpen(false);
    }
  };

  const RenderMenu = () => {
    if (selectMenu === 'speed') {
      const speedList = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
      return (
        <MenuList>
          <MenuTitle onClick={resetMenu}>
            <ArrowIcon />
            재생 속도
          </MenuTitle>
          {speedList.map(s => (
            <MenuItem
              key={`settings_speed_${s}`}
              onClick={() => speedSet(s)}
              current={speed === s}
            >
              <MenuText>{s}x</MenuText>
            </MenuItem>
          ))}
        </MenuList>
      );
    }
    if (selectMenu === 'quality') {
      return (
        <MenuList>
          <MenuTitle onClick={resetMenu}>
            <ArrowIcon />
            화질
          </MenuTitle>
          {links.map(({ link, rendition }) => (
            <MenuItem
              key={`settings_quality_${rendition}`}
              onClick={() => qualitySet(link)}
              current={quality?.link === link}
            >
              <MenuText>{rendition}</MenuText>
            </MenuItem>
          ))}
        </MenuList>
      );
    }
    return (
      <MenuList>
        <MenuItem onClick={() => setSelectMenu('speed')}>
          <MenuText>재생 속도</MenuText>
          <MenuText>{speed}x</MenuText>
        </MenuItem>
        <MenuItem onClick={() => setSelectMenu('quality')}>
          <MenuText>화질</MenuText>
          <MenuText>{quality?.rendition}</MenuText>
        </MenuItem>
      </MenuList>
    );
  };

  useEffect(() => {
    if (videoRef.current) {
      setSpeed(videoRef.current.playbackRate);
      //   videoRef.current.addEventListener('ratechange', e => {
      //     const { playbackRate } = e.target as HTMLVideoElement;
      //     setSpeed(playbackRate);
      //     setOpen(false);
      //   });
      //   videoRef.current.addEventListener('loadeddata', e => {
      //     const { currentSrc } = e.target as HTMLVideoElement;
      //     const currentLink = links.find(
      //       ({ link }) => link === currentSrc.split('#')[0],
      //     );
      //     setQuality(currentLink);
      //     setOpen(false);
      //   });
    }
  }, [videoRef]);

  return (
    <Container open={open}>
      <GearIcon onClick={toggleOpen} />
      {open && (
        <SettingBox>
          <RenderMenu />
        </SettingBox>
      )}
    </Container>
  );
};

interface IContainer {
  open: boolean;
}

const Container = styled.div<IContainer>`
  position: relative;
  display: flex;
  & > svg {
    transform: rotate(${({ open }) => (open ? '30' : '0')}deg);
    transition: transform 0.2s ease;
  }
`;

const SettingBox = styled.div`
  min-width: 150px;

  position: absolute;
  top: -30px;
  right: -55px;
  transform: translateY(-100%);

  background-color: #2a2a2abf;
  color: white;
`;

const MenuList = styled.ul``;

interface IMenuItem {
  current?: boolean;
}

const MenuTitle = styled.button`
  all: unset;
  box-sizing: border-box;

  display: flex;
  gap: 8px;

  width: 100%;
  padding: 10px 20px;

  border-bottom: 1px solid rgb(255 255 255 / 20%);

  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 154.52%;

  text-align: left;

  cursor: pointer;
`;

const MenuItem = styled.li<IMenuItem>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: ${({ current }) =>
    current ? 'rgb(255 255 255 / 30%)' : 'unset'};
  padding: 10px 20px;
  &:hover {
    background-color: rgb(255 255 255 / 20%);
  }

  cursor: pointer;
`;

const MenuText = styled.span`
  font-family: 'Noto Sans KR';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
`;
