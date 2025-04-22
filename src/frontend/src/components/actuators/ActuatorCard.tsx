import useActuator from "../../hooks/useActuator";
import { ActuatorRef, ActuatorState } from "../../models/actuator";
import Card from "../Card";
import ActuatorActions from "./ActuatorActions";
import ActuatorStateIndicator from "./ActuatorStateIndicator";

export default function ActuatorCard({
  actuator: actuatorRef,
}: {
  actuator: ActuatorRef;
}) {
  const { actuator, state, startAction } = useActuator(actuatorRef.id);

  return (
    <Card title={actuator.name}>
      <div className="flex flex-col items-center gap-4">
        <ActuatorStateIndicator state={state} />
        <ActuatorActions
          actions={actuator.actions}
          isConnected={state !== ActuatorState.NotConnected}
          onActionClick={startAction}
        />
      </div>
    </Card>
  );
}
