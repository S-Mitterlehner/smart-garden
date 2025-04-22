import useActuator from "../../hooks/useActuator";
import { ActuatorRef } from "../../models/actuator";
import { ConnectionState } from "../../models/general";
import Card from "../Card";
import ActuatorActions from "./ActuatorActions";
import ActuatorStateIndicator from "./ActuatorStateIndicator";

export default function ActuatorCard({
  actuator: actuatorRef,
}: {
  actuator: ActuatorRef;
}) {
  const { actuator, state, startAction, canDoAction } = useActuator(
    actuatorRef.id
  );

  return (
    <Card title={actuator.name}>
      <div className="flex flex-col items-center gap-4">
        <ActuatorStateIndicator state={state} />
        <ActuatorActions
          disabled={!canDoAction}
          actions={actuator.actions}
          isConnected={state.connectionState === ConnectionState.Connected}
          onActionClick={startAction}
        />
      </div>
    </Card>
  );
}
