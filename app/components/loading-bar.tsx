import { useEffect, useRef } from "react";
import { useNavigation } from "react-router";
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar";

export default function LoadingBarComponent() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  const ref = useRef<LoadingBarRef>(null);

  useEffect(() => {
    if (isNavigating) {
      ref.current?.continuousStart();
    } else {
      ref.current?.complete();
    }
  }, [isNavigating]);

  return (
    <LoadingBar
      ref={ref}
      height={3.3}
      color="#008fbb"
      shadow={false}
      style={{ borderRadius: "8px" }}
    />
  );
}
