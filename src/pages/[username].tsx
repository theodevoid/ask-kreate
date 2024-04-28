import { PageContainer } from "~/components/layout/PageContainer";
import { buttonVariants } from "~/components/ui/button";
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
import Link from "next/link";
import { cn } from "~/lib/utils";

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

      <div className="grid grid-cols-12">
        <div className="bg-background col-span-full mx-4 mt-16 flex flex-col gap-3 rounded-md border-2 p-4 lg:col-span-4 lg:p-8">
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
