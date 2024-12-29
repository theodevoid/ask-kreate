import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "~/components/layout/DashboardLayout";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Form } from "~/components/ui/form";
import { type NextPageWithLayout } from "~/pages/_app";
import { QnASessionCard } from "../components/QnASessionCard";
import {
  createSessionFormSchema,
  type CreateSessionFormSchema,
} from "../forms/create-session";
import { CreateSessionFormInner } from "../components/CreateSessionFormInner";
import { api } from "~/utils/api";
import { toast } from "sonner";
import Link from "next/link";

const MainDashboardPage: NextPageWithLayout = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState("");

  const form = useForm<CreateSessionFormSchema>({
    resolver: zodResolver(createSessionFormSchema),
  });

  const editForm = useForm<CreateSessionFormSchema>({
    resolver: zodResolver(createSessionFormSchema),
  });

  const createQuestionSession = api.questionSession.createSession.useMutation({
    onSuccess: async () => {
      toast.success("Session created!");
      setDialogIsOpen(false);
      form.reset();
      await questionSessionQuery.refetch();
    },
  });

  const questionSessionQuery = api.questionSession.getAllSessions.useQuery();

  const updateSessionMutation = api.questionSession.updateSession.useMutation({
    onSuccess: async () => {
      setEditDialogIsOpen(false);
      editForm.reset();
      await questionSessionQuery.refetch();
    },
  });

  const handleUpdateSession = (
    values: CreateSessionFormSchema & { id: string },
  ) => {
    updateSessionMutation.mutate({
      ...values,
      endDate: new Date(values.endDate),
      startDate: new Date(values.startDate),
      sessionId: values.id,
    });
  };

  const handleEditModal = (
    values: CreateSessionFormSchema & { id: string },
  ) => {
    editForm.setValue("endDate", values.endDate);
    editForm.setValue("title", values.title);
    editForm.setValue("isActive", values.isActive);
    editForm.setValue("startDate", values.startDate);
    setEditingSessionId(values.id);

    setEditDialogIsOpen(true);
  };

  const handleCreateSession = (values: CreateSessionFormSchema) => {
    createQuestionSession.mutate({
      ...values,
      endDate: new Date(values.endDate),
      startDate: new Date(values.startDate),
    });
  };

  return (
    <div className="grid grid-cols-1 gap-8">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Sessions</h3>
          <Button onClick={() => setDialogIsOpen(true)}>
            <Plus /> Create a session
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {questionSessionQuery.data?.map((session) => {
            return (
              <Link key={session.id} href={"/dashboard/session/" + session.id}>
                <QnASessionCard
                  code={session.code}
                  title={session.title}
                  startDate={session.startDate}
                  endDate={session.endDate}
                  isActive={session.isActive}
                  questionCount={session.estimatedQuestionCount}
                  id={session.id}
                  onEdit={handleEditModal}
                />
              </Link>
            );
          })}
        </div>
      </div>

      <Dialog onOpenChange={setEditDialogIsOpen} open={editDialogIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Session</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <CreateSessionFormInner
              isLoading={updateSessionMutation.isPending}
              onCreateSession={(values) =>
                handleUpdateSession({ ...values, id: editingSessionId })
              }
              buttonText="Edit Session"
            />
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={setDialogIsOpen} open={dialogIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a session</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <CreateSessionFormInner
              isLoading={createQuestionSession.isPending}
              onCreateSession={handleCreateSession}
            />
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

MainDashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default MainDashboardPage;
