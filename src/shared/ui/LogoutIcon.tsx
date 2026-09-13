import type { FC } from "react";
import { StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

type LogoutIconProps = {
  size?: number;
  color: string;
};

export const LogoutIcon: FC<LogoutIconProps> = ({ size = 24, color }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={styles.logoutIcon}
  >
    <Path
      d="M9.00195 7C9.01406 4.82497 9.11051 3.64706 9.87889 2.87868C10.7576 2 12.1718 2 15.0002 2L16.0002 2C18.8286 2 20.2429 2 21.1215 2.87868C22.0002 3.75736 22.0002 5.17157 22.0002 8L22.0002 16C22.0002 18.8284 22.0002 20.2426 21.1215 21.1213C20.2429 22 18.8286 22 16.0002 22H15.0002C12.1718 22 10.7576 22 9.87889 21.1213C9.11051 20.3529 9.01406 19.175 9.00195 17"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M15 12L2 12M2 12L5.5 9M2 12L5.5 15"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const styles = StyleSheet.create({
  logoutIcon: {
    position: "relative",
    right: 1, // offset for visual centering of the icon
  },
});
