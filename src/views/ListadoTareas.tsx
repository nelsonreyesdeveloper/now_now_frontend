import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ListadoTareas = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>LISTADO DE TAREAS</CardTitle>
        <CardDescription>
          <p className="mt-3"> En esta seccion podras ver tus tareas.</p>
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default ListadoTareas;
