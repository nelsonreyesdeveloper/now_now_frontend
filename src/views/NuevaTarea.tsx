import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const NuevaTarea = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>NUEVA TAREA</CardTitle>
        <CardDescription>
          <p className="mt-3"> En esta seccion podras ver tus tareas.</p>
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default NuevaTarea;
