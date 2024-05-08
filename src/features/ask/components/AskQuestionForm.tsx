import { useForm } from "react-hook-form";
import { askQuestionFormSchema, type AskQuestionFormSchema } from "../forms";
import { Section } from "~/components/layout/Section";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "~/lib/utils";

type AskQuestionFormProps = {
  onSubmit: (input: AskQuestionFormSchema) => void;
  loading?: boolean;
};

export const AskQuestionForm: React.FC<AskQuestionFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const form = useForm<AskQuestionFormSchema>({
    resolver: zodResolver(askQuestionFormSchema),
    defaultValues: {
      body: "",
    },
  });

  const submitHandler = (values: AskQuestionFormSchema) => {
    onSubmit(values);
    form.resetField("body");
  };

  return (
    <Section
      title="Ask a question"
      className="w-full border-b-2 pb-8 lg:border-x-2"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitHandler)}>
          <FormField
            control={form.control}
            name="body"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <textarea
                    {...field}
                    placeholder="What do you think about..."
                    className="w-full resize-none rounded-md border-2 bg-card p-2 outline-none"
                    rows={3}
                  />
                </FormControl>
                <FormDescription
                  className={cn(
                    fieldState.error &&
                      field.value.length > 1 &&
                      "text-destructive",
                  )}
                >
                  {field.value.length}/280
                </FormDescription>
              </FormItem>
            )}
          />

          <Button
            disabled={loading || !form.formState.isValid}
            type="submit"
            className="mt-2 w-full"
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </form>
      </Form>
    </Section>
  );
};
