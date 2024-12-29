import { Calendar, Ellipsis, Hash, MessageCircle } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Form } from "~/components/ui/form";
import { CreateSessionFormInner } from "./CreateSessionFormInner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSessionFormSchema,
  type CreateSessionFormSchema,
} from "../forms/create-session";
import { useState } from "react";
import { api } from "~/utils/api";
import { propagateServerField } from "next/dist/server/lib/render-server";

interface QnASessionCardProps {
  title: string;
  questionCount: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  code: string;
  id: string;
  onEdit: (values: CreateSessionFormSchema & { id: string }) => void;
}

export const QnASessionCard = ({
  title,
  questionCount,
  startDate,
  endDate,
  isActive,
  code,
  id,
  onEdit,
}: QnASessionCardProps) => {
  const formatDate = (date: Date) => format(date, "MMM dd");

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-4 flex flex-col space-y-2">
          <div className="flex items-center">
            <Hash className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-sm font-medium">{code}</span>
          </div>
          <div className="flex items-center">
            <MessageCircle className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-sm font-medium">
              {questionCount} {questionCount === 1 ? "Question" : "Questions"}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-sm font-medium">
              {formatDate(startDate)} - {formatDate(endDate)}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger onClick={(e) => e.preventDefault()}>
            <Button size="icon" variant="ghost">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit({
                  endDate: endDate.toISOString().split("T")[0]!,
                  id,
                  isActive,
                  startDate: startDate.toISOString().split("T")[0]!,
                  title,
                });
              }}
            >
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};
