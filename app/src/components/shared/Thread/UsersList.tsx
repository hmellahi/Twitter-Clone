import { User } from "@prisma/client";
import { ProfileImg } from "../ProfileImg";

export function UsersList({ users, className = "" }: { users: User[]; className?: string }) {
  return (
    <div className={`inline-flex row-reverse h-7 ${className}`}>
      {users?.map((user, index) => (
        <ProfileImg
          key={index}
          user={user}
          index={index}
          className="-ml-[.5rem]"
          size={17}
        ></ProfileImg>
      ))}
    </div>
  );
}
