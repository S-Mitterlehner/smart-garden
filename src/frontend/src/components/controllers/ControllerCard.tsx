import useController from "../../hooks/useController";
import { ControllerRef, ControllerState } from "../../models/controller";
import Card from "../Card";
import ControllerActions from "./ControllerActions";
import ControllerStateIndicator from "./ControllerStateIndicator";

export default function ControllerCard({
  controller: controllerRef,
}: {
  controller: ControllerRef;
}) {
  const { controller, state, startAction } = useController(controllerRef.id);

  return (
    <Card title={controller.name}>
      <div className="flex flex-col items-center gap-4">
        <ControllerStateIndicator state={state} />
        <ControllerActions
          actions={controller.actions}
          isConnected={state !== ControllerState.NOT_CONNECTED}
          onActionClick={startAction}
        />
      </div>
    </Card>
  );
}
