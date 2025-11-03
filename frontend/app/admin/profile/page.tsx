import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import UserAddressCard from "@/components/admin/UserProfile/UserAddressCard";
import UserInfoCard from "@/components/admin/UserProfile/UserInfoCard";
import UserMetaCard from "@/components/admin/UserProfile/UserMetaCard";


export default function UserProfiles() {
  return (
    <>
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">

        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard />
        </div>
      </div>
    </>
  );
}
