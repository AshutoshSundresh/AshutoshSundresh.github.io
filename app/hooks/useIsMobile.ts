import { useEffect, useState } from 'react';
import useWindowInfo from './useWindowInfo';

export default function useIsMobile() {
  const { isMobile } = useWindowInfo();
  return isMobile;
}


