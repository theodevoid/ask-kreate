import { useFormContext } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { type CreateSessionFormSchema } from "../forms/create-session";

type CreateSessionFormInnerProps = {
  onCreateSession: (values: CreateSessionFormSchema) => void;
  isLoading?: boolean;
};

export const CreateSessionFormInner = (props: CreateSessionFormInnerProps) => {
  const form = useFormContext<CreateSessionFormSchema>();

  return (
    <form
      onSubmit={form.handleSubmit(props.onCreateSession)}
      className="flex flex-col gap-y-4"
    >
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem as="div">
            <FormLabel>Session Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter session title" {...field} />
            </FormControl>
            <FormDescription>
              Give your Q&A session a descriptive title.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem as="div">
            <FormLabel>Start Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="endDate"
        render={({ field }) => (
          <FormItem as="div">
            <FormLabel>End Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem
            as="div"
            className="flex flex-row items-center justify-between gap-x-4 rounded-lg border p-4"
          >
            <div className="space-y-0.5">
              <FormLabel className="text-base">Active Status</FormLabel>
              <FormDescription>
                Set whether this session will be immediately active or not.
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
      <Button
        type="submit"
        disabled={form.formState.isSubmitting || props.isLoading}
      >
        Create Session
      </Button>
    </form>
  );
};
