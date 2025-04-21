import { Controller } from "../../models/controller";
import Card from "../Card";

export default function ControllerCard({
  controller,
}: {
  controller: Controller;
}) {
  return (
    <Card title={controller.name}>
      <div className="flex flex-col items-center gap-2">
        TODO: add controller status & actions
      </div>
    </Card>
  );
}
