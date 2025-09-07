import useWindowInfo from './useWindowInfo';

export default function useIsMobile() {
  const { isMobile } = useWindowInfo();
  return isMobile;
}


