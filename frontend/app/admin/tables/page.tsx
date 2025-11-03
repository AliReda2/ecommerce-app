import ComponentCard from "@/components/admin/common/ComponentCard";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import BasicTableOne from "@/components/admin/tables/BasicTables/BasicTableOne";
import { Product } from "@/lib/types/product";

export default function BasicTables({ data }: { data: Product[] }) {
  return (
    <>
      <PageBreadcrumb pageTitle="Basic Tables" />
      <div className="space-y-6">
        <ComponentCard>
          <BasicTableOne data={data} />
        </ComponentCard>
      </div>
    </>
  );
}
