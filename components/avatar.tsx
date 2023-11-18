"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
  Mail,
} from "lucide-react";
import useAppDispatch from "@/hooks/useAppDispatch";
import { logoutUser } from "@/services";
import { useRouter } from "next/navigation";
import { getUserById } from "@/services/profileServices";

type Props = {};

const AvatarComp = ({ user }: any) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [initial, setInitial] = useState("");
  const [name, setName] = useState("");

  function getInitials(name: string) {
    const words = name?.split(" ");
    const initials = words?.map((word) => word[0]).join("");
    return initials.toUpperCase();
  }

  useEffect(() => {
    if (user.name) {
      const initials = getInitials(user.name);
      setInitial(initials);
      setName(user.name);
    }

    if (user.firstName) {
      const initials = getInitials(`${user.firstName} ${user.lastName}`);
      setInitial(initials);
      setName(`${user.firstName} ${user.lastName}`);
    }
  }, [user]);

  console.log("AVATAR", user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={user.picture} />
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 -translate-x-8">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>{name}</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Mail className="mr-2 h-4 w-4" />
            <span>{user.email}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            logoutUser(router);
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarComp;
