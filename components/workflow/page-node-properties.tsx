import { useDesigner } from "@/hooks/use-designer-store";
import { Elements } from "./workflow-components";
import { Button } from "../ui/button";
import { Link, Trash2, X } from "lucide-react";
import { Separator } from "../ui/separator";
import { useParams } from "next/navigation";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function PageNodeProperties({
  name,
  setName,
}: {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
}) {
  const { selectedElement, setSelectedElement, removeElement } = useDesigner();

  if (!selectedElement) {
    return (
      <div className="md:col-span-2">
        <Tabs defaultValue="page">
          <TabsList>
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
            <TabsTrigger value="page">Page</TabsTrigger>
          </TabsList>
          <TabsContent value="page">
            <PageMeta name={name} setName={setName} />
          </TabsContent>
          <TabsContent value="widgets">
            <WidgetTree />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  const PropertiesForm = Elements[selectedElement.type].propertiesComponent;
  const { label } = Elements[selectedElement.type].designerBtnElement;

  return (
    <div className="md:col-span-2 py-2 px-4 flex flex-col justify-between h-full gap-4">
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <p className="text-sm text-foreground/70">{label} Properties</p>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setSelectedElement(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Separator className="mb-4" />
        <PropertiesForm elementInstance={selectedElement} />
      </div>
      <div className="flex flex-col gap-2 items-start">
        <p className="text-sm font-medium">Utilities</p>
        <Button
          variant="ghost"
          onClick={() => {
            removeElement(selectedElement.id);
            setSelectedElement(null);
          }}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

const PageMeta = ({
  name,
  setName,
}: {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
}) => {
  const params = useParams();
  return (
    <div className="flex flex-col gap-4 py-2">
      <h3 className="capitalize text-muted-foreground text-base font-bold">
        Page node
      </h3>
      <Badge variant="secondary" className="max-w-fit">
        ID: {params.slug}
      </Badge>
      <div className="space-y-3">
        <div className="flex flex-col gap-2">
          <Label>Page name</Label>
          <Input
            placeholder="Enter page name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Title</Label>
          <div className="flex gap-2 items-center">
            <Input placeholder="Enter page title" />
            <Link className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

const WidgetTree = () => {
  const { elements } = useDesigner();

  return (
    <div className="cols-span-2 space-y-4 py-2">
      <h3 className="capitalize text-base font-semibold">Widget Tree</h3>
      <div className="space-y-4">
        {elements.map((el) => {
          const { icon: Icon, label } = Elements[el.type].designerBtnElement;
          return (
            <div
              key={el.id}
              className={cn(
                "flex gap-2 items-center py-2 px-4 w-full  rounded-xl"
              )}
            >
              <Icon className="h-4 w-4" />
              <p className="text-sm font-medium">{label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
