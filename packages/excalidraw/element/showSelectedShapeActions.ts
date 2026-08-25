import type { NonDeletedExcalidrawElement } from "./types";
import { getSelectedElements } from "../scene";
import type { UIAppState } from "../types";

export const showSelectedShapeActions = (
  appState: UIAppState,
  elements: readonly NonDeletedExcalidrawElement[],
) => {
  const selected = getSelectedElements(elements, appState);
  if (
    selected.length > 0 &&
    selected.every((el) => el.customData?.showShapeActions === false)
  ) {
    return false;
  }
  return Boolean(
    !appState.viewModeEnabled &&
      appState.openDialog?.name !== "elementLinkSelector" &&
      ((appState.activeTool.type !== "custom" &&
        (appState.editingTextElement ||
          (appState.activeTool.type !== "selection" &&
            appState.activeTool.type !== "eraser" &&
            appState.activeTool.type !== "hand" &&
            appState.activeTool.type !== "laser"))) ||
        selected.length),
  );
};
