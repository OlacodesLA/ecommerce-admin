import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import getUser from "@/lib/get-user";
import { getUserDocuments } from "@/services/profileServices";
import { redirect } from "next/navigation";

const Navbar = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const stores = await getUserDocuments("store", user.uid);

  console.log();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4 ">
          <div className="rounded-full w-12 h-12 bg-black"></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
