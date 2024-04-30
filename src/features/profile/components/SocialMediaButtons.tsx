import Link from "next/link";
import React, { PropsWithChildren } from "react";
import {
  InstagramLogoIcon,
  TiktokLogoIcon,
  TwitchLogoIcon,
  TwitterLogoIcon,
  YoutubeLogoIcon,
} from "~/components/icons";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type SocialMediaButtonsProps = {
  instagramUsername?: string | null;
  youtubeUsername?: string | null;
  tiktokUsername?: string | null;
  twitchUsername?: string | null;
  twitterUsername?: string | null;
};

type SocialMediaLinkButtonProps = {
  url: string;
};

const SocialMediaLinkButton: React.FC<
  PropsWithChildren & SocialMediaLinkButtonProps
> = ({ url, children }) => {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        buttonVariants({ variant: "ghost", size: "default" }),
        "flex-1",
      )}
    >
      {children}
    </Link>
  );
};

export const SocialMediaButtons: React.FC<SocialMediaButtonsProps> = ({
  instagramUsername,
  tiktokUsername,
  twitchUsername,
  twitterUsername,
  youtubeUsername,
}) => {
  const instagramUrl = `https://instagram.com/${instagramUsername}`;
  const youtubeUrl = `https://youtube.com/@${youtubeUsername?.replace("@", "")}`;
  const tiktokUrl = `https://tiktok.com/@${tiktokUsername?.replace("@", "")}`;
  const twitterUrl = `https://twitter.com/${twitterUsername}`;
  const twitchUrl = `https://twitch.tv/${twitchUsername}`;

  return (
    <div className="grid grid-cols-3 gap-4 lg:grid-cols-6">
      {instagramUsername && (
        <SocialMediaLinkButton url={instagramUrl}>
          <InstagramLogoIcon className="h-6 w-6" />
        </SocialMediaLinkButton>
      )}
      {youtubeUsername && (
        <SocialMediaLinkButton url={youtubeUrl}>
          <YoutubeLogoIcon className="h-6 w-6" />
        </SocialMediaLinkButton>
      )}
      {tiktokUsername && (
        <SocialMediaLinkButton url={tiktokUrl}>
          <TiktokLogoIcon className="h-6 w-6" />
        </SocialMediaLinkButton>
      )}
      {twitterUsername && (
        <SocialMediaLinkButton url={twitterUrl}>
          <TwitterLogoIcon className="h-6 w-6" />
        </SocialMediaLinkButton>
      )}
      {twitchUsername && (
        <SocialMediaLinkButton url={twitchUrl}>
          <TwitchLogoIcon className="h-6 w-6" />
        </SocialMediaLinkButton>
      )}
    </div>
  );
};
