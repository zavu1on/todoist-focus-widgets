"use no memo";

import type { FC } from "react";
import { FlexWidget, SvgWidget, TextWidget } from "react-native-android-widget";
import type { FilterCardViewModel } from "@/entities/filter";
import { colors, fonts } from "@/shared/ui";

type PinWidgetProps =
  | { viewModel: FilterCardViewModel; errorMessage?: undefined }
  | { viewModel?: undefined; errorMessage: string };

const asHexColor = (value: string) => value as `#${string}`;

export const PinWidget: FC<PinWidgetProps> = ({ viewModel, errorMessage }) => {
  if (errorMessage !== undefined) {
    return (
      <FlexWidget
        style={{
          height: "match_parent",
          width: "match_parent",
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 20,
          backgroundColor: colors.surface,
          padding: 16,
        }}
      >
        <TextWidget
          text={errorMessage}
          maxLines={4}
          truncate="END"
          style={{
            fontFamily: fonts.dmSansRegular,
            fontSize: 14,
            color: colors.textSecondary,
          }}
        />
      </FlexWidget>
    );
  }

  const clickProps =
    viewModel.taskUrl !== null
      ? {
          clickAction: "OPEN_URI",
          clickActionData: { uri: viewModel.taskUrl },
        }
      : {};

  return (
    <FlexWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        flexDirection: "row",
        borderRadius: 20,
        backgroundColor: colors.surface,
      }}
      {...clickProps}
    >
      <FlexWidget
        style={{
          width: 10,
          height: "match_parent",
          backgroundColor: asHexColor(
            viewModel.taskTitle !== null
              ? viewModel.priorityColor
              : colors.neutral,
          ),
        }}
      />
      <FlexWidget
        style={{
          flex: 1,
          height: "match_parent",
          flexDirection: "column",
          padding: 16,
        }}
      >
        <FlexWidget style={{ flexDirection: "row", width: "match_parent" }}>
          <FlexWidget style={{ flex: 1 }}>
            <TextWidget
              text={viewModel.taskTitle ?? "All clear."}
              maxLines={3}
              truncate="END"
              style={{
                fontFamily: fonts.poppinsBold,
                fontSize: 20,
                color: colors.textPrimary,
              }}
            />
          </FlexWidget>
          <FlexWidget
            clickAction="RELOAD"
            style={{
              width: 32,
              height: 32,
              borderRadius: 11,
              backgroundColor: colors.surfaceMuted,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SvgWidget
              svg={require("@/assets/images/widget-reload-icon.svg")}
              style={{ width: 16, height: 16 }}
            />
          </FlexWidget>
        </FlexWidget>
        {viewModel.projectName !== null && (
          <FlexWidget
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <FlexWidget
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: asHexColor(
                  viewModel.projectColor ?? colors.textSecondary,
                ),
              }}
            />
            <TextWidget
              text={viewModel.projectName}
              style={{
                marginLeft: 6,
                fontFamily: fonts.dmSansRegular,
                fontSize: 13,
                color: colors.textSecondary,
              }}
            />
          </FlexWidget>
        )}
        <FlexWidget style={{ flex: 1 }} />
        {viewModel.remainingCount > 0 && (
          <TextWidget
            text={`+${viewModel.remainingCount} more`}
            style={{
              fontFamily: fonts.dmSansRegular,
              fontSize: 13,
              color: colors.textMuted,
            }}
          />
        )}
      </FlexWidget>
    </FlexWidget>
  );
};
