import { PageContainer } from "~/components/layout/PageContainer";
import { Button } from "~/components/ui/button";
import { Title } from "~/components/ui/title";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { api } from "~/utils/api";
import { type GetServerSideProps } from "next";
import { HeadMetaData } from "~/components/layout/HeadMetaData";
import React from "react";
import { db } from "~/server/db";
import { Section } from "~/components/layout/Section";
import { QuestionCard } from "~/features/ask/components";

type UserPageProps = {
  username: string;
  name: string;
};

const UserPage: React.FC<UserPageProps> = ({ username, name }) => {
  const { data: user } = api.user.getUser.useQuery(
    {
      username,
    },
    {
      enabled: !!username,
    },
  );

  return (
    <PageContainer className="lg:max-w-screen-md">
      {/* TODO: Add OG image from user's profile picture, needs a bit of design */}
      <HeadMetaData title={`${name} (@${username})`} />

      <div className="grid grid-cols-12">
        {/* USER INFO SECTION */}
        <div className="col-span-full mb-4 flex h-fit flex-col gap-3 bg-background p-4 lg:mb-0 lg:border-x-2 lg:p-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-[100px] w-[100px] border-[2px]">
              <AvatarFallback className="bg-accent">
                <span className="text-4xl font-bold">
                  {user?.name?.charAt(0)}
                </span>
              </AvatarFallback>
              <AvatarImage src={user?.image ?? ""} />
            </Avatar>

            <div>
              <Title className="max-w-72 text-center">{user?.name}</Title>
              <p className="text-lg font-bold">@{user?.username}</p>
            </div>
          </div>

          {/* Bio */}
          {user?.bio && <p>{user.bio}</p>}

          {/* Social links */}
          {/* <SocialMediaButtons
            instagramUsername={"username"}
            youtubeUsername={"username"}
            tiktokUsername={"username"}
            twitterUsername={"username"}
            twitchUsername={"username"}
          /> */}
        </div>

        <div className="col-span-full border-t-2 lg:border-x-2">
          {/* ASK INPUT */}
          <Section title="Ask a question" className="w-full border-b-2 pb-8">
            <textarea
              placeholder="What do you think about..."
              className="w-full resize-none rounded-md border-2 bg-card p-2 outline-none"
              rows={3}
            />

            <Button className="mt-2 w-full">Send</Button>
          </Section>

          <Section title="Feed" className="border-b-0 px-0">
            <div className="flex flex-col gap-2 px-4 pb-4">
              <QuestionCard
                createdAt={new Date()}
                username="gaho"
                avatarUrl=""
                body="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Sit recusandae facere assumenda veniam quis, dolores maiores
              aspernatur minus autem! Non."
                upvotes={2100}
              />
            </div>
          </Section>
        </div>
      </div>
    </PageContainer>
  );
};

export const getServerSideProps: GetServerSideProps<
  UserPageProps,
  { username: string }
> = async ({ params }) => {
  if (!params?.username) {
    return {
      notFound: true,
    };
  }

  const profile = await db.user.findUnique({
    where: {
      username: params.username,
    },
    select: {
      username: true,
      name: true,
    },
  });

  if (!profile) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      username: profile.username ?? "",
      name: profile.name ?? "",
    },
  };
};

export default UserPage;
