import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import type { FC } from "react";
import { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Alert, Animated, Dimensions, StyleSheet, View } from "react-native";
import ReanimatedAnimated, {
  runOnJS,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  type CreateFilterInput,
  createFilterInputSchema,
  type Filter,
  useCreateFilterMutation,
  useDeleteFilterMutation,
  useUpdateFilterMutation,
} from "@/entities/filter";
import { pinFilterWidget } from "@/features/pin-filter-widget";
import { colors } from "@/shared/ui";
import { getDefaultFilterFormValues } from "../model/getDefaultFilterFormValues";
import { UpsertFilterFormStepOne } from "./UpsertFilterFormStepOne";
import { UpsertFilterFormStepTwo } from "./UpsertFilterFormStepTwo";

const SCREEN_WIDTH = Dimensions.get("window").width;
const STEP_ANIMATION_DURATION_MS = 260;

type UpsertFilterFormProps = {
  initialFilter?: Filter;
  onSaved: () => void;
  onCancel: () => void;
};

export const UpsertFilterForm: FC<UpsertFilterFormProps> = ({
  initialFilter,
  onSaved,
  onCancel,
}) => {
  const navigation = useNavigation();
  const db = useSQLiteContext();
  const form = useForm<CreateFilterInput>({
    resolver: zodResolver(createFilterInputSchema),
    defaultValues: getDefaultFilterFormValues(initialFilter),
  });

  const translateX = useRef(new Animated.Value(0)).current;
  const stepRef = useRef<0 | 1>(0);
  const hasSavedRef = useRef(false);
  const isLeavingRef = useRef(false);
  const exitTranslateX = useSharedValue(0);
  const exitStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: exitTranslateX.value }],
  }));

  const createMutation = useCreateFilterMutation();
  const updateMutation = useUpdateFilterMutation();
  const deleteMutation = useDeleteFilterMutation();

  const goToStep = (nextStep: 0 | 1) => {
    stepRef.current = nextStep;

    Animated.timing(translateX, {
      toValue: -nextStep * SCREEN_WIDTH,
      duration: STEP_ANIMATION_DURATION_MS,
      useNativeDriver: true,
    }).start();
  };

  const handleSave = form.handleSubmit((values) => {
    hasSavedRef.current = true;

    if (initialFilter === undefined) {
      createMutation.mutate(values, { onSuccess: onSaved });
    } else {
      updateMutation.mutate(
        { filter: initialFilter, input: values },
        { onSuccess: onSaved },
      );
    }
  });

  const handlePlaceOnHomeScreen = form.handleSubmit((values) => {
    hasSavedRef.current = true;

    if (initialFilter === undefined) {
      createMutation.mutate(values, {
        onSuccess: (createdFilter) => {
          pinFilterWidget(db, createdFilter.id).then(onSaved);
        },
      });
    } else {
      updateMutation.mutate(
        { filter: initialFilter, input: values },
        {
          onSuccess: () => {
            pinFilterWidget(db, initialFilter.id).then(onSaved);
          },
        },
      );
    }
  });

  const handleDelete = () => {
    if (initialFilter === undefined) {
      return;
    }

    Alert.alert(
      "Delete this filter?",
      `"${initialFilter.title}" will be removed from your widgets.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            hasSavedRef.current = true;
            deleteMutation.mutate(initialFilter.id, { onSuccess: onSaved });
          },
        },
      ],
    );
  };

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        const leave = () => {
          isLeavingRef.current = true;
          exitTranslateX.value = withTiming(
            SCREEN_WIDTH,
            { duration: STEP_ANIMATION_DURATION_MS },
            (finished) => {
              if (finished) {
                runOnJS(navigation.dispatch)(e.data.action);
              }
            },
          );
        };

        if (isLeavingRef.current) {
          return;
        }

        if (stepRef.current === 1 && !hasSavedRef.current) {
          e.preventDefault();
          stepRef.current = 0;
          Animated.timing(translateX, {
            toValue: 0,
            duration: STEP_ANIMATION_DURATION_MS,
            useNativeDriver: true,
          }).start();
          return;
        }

        if (form.formState.isDirty && !hasSavedRef.current) {
          e.preventDefault();
          Alert.alert(
            "Discard changes?",
            "Your changes to this filter won't be saved.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Discard",
                style: "destructive",
                onPress: leave,
              },
            ],
          );
          return;
        }

        e.preventDefault();
        leave();
      }),
    [navigation, form.formState.isDirty, translateX, exitTranslateX],
  );

  return (
    <FormProvider {...form}>
      <ReanimatedAnimated.View
        style={[styles.viewport, exitStyle]}
        entering={SlideInRight}
      >
        <Animated.View style={[styles.pager, { transform: [{ translateX }] }]}>
          <View style={styles.page}>
            <UpsertFilterFormStepOne
              onBack={onCancel}
              onContinue={() => goToStep(1)}
            />
          </View>
          <View style={styles.page}>
            <UpsertFilterFormStepTwo
              onBack={() => goToStep(0)}
              onSubmit={handleSave}
              onPlaceOnHomeScreen={handlePlaceOnHomeScreen}
              onDelete={initialFilter === undefined ? undefined : handleDelete}
              isSubmitting={
                createMutation.isPending || updateMutation.isPending
              }
            />
          </View>
        </Animated.View>
      </ReanimatedAnimated.View>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  viewport: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: colors.background,
  },
  pager: {
    flex: 1,
    flexDirection: "row",
    width: SCREEN_WIDTH * 2,
    backgroundColor: colors.background,
  },
  page: {
    width: SCREEN_WIDTH,
    backgroundColor: colors.background,
  },
});
