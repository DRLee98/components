import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { timeNumberToString } from './utils';

interface ITimeText {
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const TimeText: React.FC<ITimeText> = ({ videoRef }) => {
  const [current, setDCurrent] = useState('00:00:00');
  const [duration, setDuration] = useState('00:00:00');

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('durationchange', e => {
        const { duration: videoDuration } = e.target as HTMLVideoElement;
        const strDuration = timeNumberToString(Math.floor(videoDuration));
        setDuration(strDuration);
      });
      videoRef.current.addEventListener('timeupdate', e => {
        const { currentTime } = e.target as HTMLVideoElement;
        const strCurrent = timeNumberToString(Math.floor(currentTime));
        setDCurrent(strCurrent);
      });
    }
  }, [videoRef]);

  return (
    <Container>
      <Text>{current}</Text>
      <Text>/</Text>
      <Text>{duration}</Text>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
`;

const Text = styled.span`
  font-family: 'Noto Sans KR';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;

  color: white;

  & + & {
    margin-left: 4px;
  }
`;
