import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function useCreateOrEditGroupSchema() {
  const schema = z.object({
    name: z.string().trim().min(1, "Group name is required"),
    description: z.string().trim().min(1, "Group description is required"),
  });
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    resolver: zodResolver(schema),
  });

  return { form };
}
