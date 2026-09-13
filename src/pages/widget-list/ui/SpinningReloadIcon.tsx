import type { FC } from "react";
import { useEffect } from "react";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { ReloadIcon } from "@/shared/ui";

type SpinningReloadIconProps = {
  size: number;
  color: string;
  spinning: boolean;
};

export const SpinningReloadIcon: FC<SpinningReloadIconProps> = ({
  size,
  color,
  spinning,
}) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (spinning) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 800, easing: Easing.linear }),
        -1,
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = 0;
    }
  }, [spinning, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <ReloadIcon size={size} color={color} />
    </Animated.View>
  );
};
