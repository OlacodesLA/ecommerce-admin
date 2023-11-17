import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import getUser from "@/lib/get-user";
import { getUserById, getUserDocuments } from "@/services/profileServices";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarComp from "./avatar";

const Navbar = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const stores = await getUserDocuments("store", user.uid);

  const me = await getUserById(user.uid);

  console.log("Me", me);

  return (
    <div className="border-b">
      <div className="flex justify-between items-center px-4">
        <div className="flex h-16 items-center ">
          <StoreSwitcher items={stores} />
          <MainNav className="mx-6" />
        </div>
        <div className="">
          <AvatarComp user={me} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
