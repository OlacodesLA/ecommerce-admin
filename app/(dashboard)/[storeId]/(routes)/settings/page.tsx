import getUser from "@/lib/get-user";
import { getFirstDocument } from "@/services/profileServices";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}
interface StoreData {
  name: string;
  id: string;
  // Add other properties if needed
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const store = await getFirstDocument("store", user.uid, params.storeId);
  console.log(store);

  if (!store) {
    redirect(`/`);
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store as StoreData} />
      </div>
    </div>
  );
};

export default SettingsPage;
