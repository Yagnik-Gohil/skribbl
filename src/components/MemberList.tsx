import React, { useEffect, useState } from "react";
import Member from "./Member";
import { ILike, IUser } from "../types";
import { getSocket } from "../services/socket";

const MemberList = ({
  currentUser,
  memberList,
  currentTurn,
}: {
  currentUser: IUser;
  memberList: IUser[];
  currentTurn: IUser;
}) => {
  const [reactionBy, setReactionBy] = useState<IUser | null>(null);
  const [isLiked, setIsLiked] = useState<boolean | null>(null);

  useEffect(() => {
    const socket = getSocket();

    if (socket) {
      socket.on("like", (data: ILike) => {
        setReactionBy(data.user);
        setIsLiked(data.isLiked);

        const timeout = setTimeout(() => {
          setReactionBy(null);
          setIsLiked(null);
        }, 2000); // Use a 2-second delay for visibility of reaction

        return () => clearTimeout(timeout); // Clear the timeout on cleanup
      });

      return () => {
        socket.off("like");
      };
    }
  }, []);

  return (
    <div className="overflow-hidden h-full relative">
      <div className="flex flex-col gap-2 p-2 overflow-y-auto max-h-[670px]">
        {memberList.map((member) => (
          <div className="relative" key={member.id}>
            <Member
              isMe={currentUser.id === member.id}
              member={member}
              isCurrentTurn={member.id === currentTurn.id}
            />

            {/* Floating reaction icon */}
            {reactionBy?.id === member.id && (
              <div
                className={`absolute right-[10px] top-[50%] translate-y-[-50%] flex items-center justify-center h-8 w-8 rounded-full text-white shadow-lg ${
                  isLiked ? "bg-[#16a34a]" : "bg-theme-red"
                }`}
                style={{ zIndex: 9999 }}
              >
                {isLiked ? "👍" : "👎"}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberList;
