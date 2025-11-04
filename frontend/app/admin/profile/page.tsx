import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import UserAddressCard from "@/app/admin/profile/components/UserAddressCard";
import UserInfoCard from "@/app/admin/profile/components/UserInfoCard";
import UserMetaCard from "@/app/admin/profile/components/UserMetaCard";

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
