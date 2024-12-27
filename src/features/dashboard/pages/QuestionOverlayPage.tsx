import { formatDistance } from "date-fns";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent } from "~/components/ui/card";
import { supabaseDefaultClient } from "~/lib/supabase/client";
import { QuestionEvent } from "~/lib/supabase/events";
import { api } from "~/utils/api";

const QuestionOverlayPage = () => {
  const router = useRouter();

  const getPinnedQuestionQuery =
    api.questionSession.getPinnedQuestionByStreamKey.useQuery(
      {
        streamKey: router.query.streamKey as string,
      },
      {
        enabled: !!router.query.streamKey,
      },
    );

  const refetchPinnedQuestion = useCallback(async () => {
    await getPinnedQuestionQuery.refetch();
  }, [getPinnedQuestionQuery]);

  useEffect(() => {
    if (typeof window !== "undefined" && router.isReady) {
      const key = router.query.streamKey as string;
      const overlayChannel = supabaseDefaultClient.channel(`overlay:${key}`);

      overlayChannel
        .on(
          "broadcast",
          {
            event: QuestionEvent.PINNED,
          },
          () => {
            void refetchPinnedQuestion();
          },
        )
        .subscribe();
    }
  }, [router.isReady, router.query.streamKey, refetchPinnedQuestion]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <div className="flex-1 space-y-1">
            <p className="text-2xl font-medium leading-none">
              {getPinnedQuestionQuery.data?.name
                ? getPinnedQuestionQuery.data?.name
                : "Anonymous"}
            </p>
            <p className="text-3xl">{getPinnedQuestionQuery.data?.body}</p>
            <p className="text-xl text-muted-foreground">
              {getPinnedQuestionQuery.data &&
                formatDistance(
                  getPinnedQuestionQuery.data.createdAt,
                  new Date(),
                  { addSuffix: true },
                )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionOverlayPage;
