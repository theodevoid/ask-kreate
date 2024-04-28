import { PageContainer } from "~/components/layout/PageContainer";
import { Button, buttonVariants } from "~/components/ui/button";
import { Title } from "~/components/ui/title";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import Image from "next/image";
import { api } from "~/utils/api";
import { SocialMediaButtons } from "~/features/profile/components";
import { GetServerSideProps } from "next";
import { HeadMetaData } from "~/components/layout/HeadMetaData";
import React from "react";
import { db } from "~/server/db";

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
    <PageContainer>
      {/* TODO: Add OG image from user's profile picture, needs a bit of design */}
      <HeadMetaData title={`${name} (@${username})`} />

      <div className="mx-4 grid grid-cols-12 gap-x-4">
        {/* USER INFO SECTION */}
        <div className="bg-background col-span-full mt-16 flex h-fit flex-col gap-3 rounded-md border-2 p-4 lg:col-span-4 lg:p-8">
          <Avatar className="-mt-16 h-[100px] w-[100px] border-[2px] lg:-mt-20">
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

          {/* Bio */}
          {user?.bio && <p>{user.bio}</p>}

          {/* Social links */}
          <SocialMediaButtons
            instagramUsername={"username"}
            youtubeUsername={"username"}
            tiktokUsername={"username"}
            twitterUsername={"username"}
            twitchUsername={"username"}
          />
        </div>

        <div className="col-span-full mt-8 lg:col-span-8 lg:mt-16">
          {/* ASK INPUT */}
          <div className="flex h-fit w-full flex-col rounded-md border-2 p-4 ">
            <div className="bg-accent -mt-8 mb-4 w-fit self-center rounded-md border-2 px-4 text-center text-lg font-bold">
              Ask a question
            </div>

            <textarea
              placeholder="What do you think about..."
              className="resize-none rounded-md border-2 bg-white p-2 outline-none"
            />

            <Button className="mt-2 w-full">Send</Button>
          </div>

          <div className="mt-8 flex h-fit w-full flex-col rounded-md border-2">
            <div className="bg-accent -mt-4 mb-4 w-fit self-center rounded-md border-2 px-4 text-center text-lg font-bold">
              Feed
            </div>
          </div>
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
