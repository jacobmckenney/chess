import React from "react";
import type { PublicUserInfo } from "../../types/board";

interface Props {
  user: PublicUserInfo;
}
// TODO: add profile photo and link to their public profile
const ProfileBadge: React.FC<Props> = ({ user }) => {
  const { name, elo } = user;
  return (
    <div className="rounded-lg bg-black p-2">
      {name} - {elo}
    </div>
  );
};

export default ProfileBadge;
