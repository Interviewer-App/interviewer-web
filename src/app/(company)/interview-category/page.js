"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DataTable } from "@/components/ui/InterviewCategory-DataTable/Datatable";
import { interviewSessionTableColumns } from "@/components/ui/InterviewDataTable/column";
import InterviewCategoryModal from "../../../components/interviews/interviewCategoryModal";
import { fetchInterCategories } from "@/lib/api/interview-category";
import { columns } from "@/components/ui/InterviewCategory-DataTable/column";
import Loading from "@/app/loading";
import { usePathname, useRouter, redirect } from 'next/navigation';
import { useSession, getSession } from "next-auth/react"

const InterviewCategoryPage = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [totalsessions, setTotalSessions] = useState(0);
  const [loading, setLoading] = useState(false);
  const [interviewSessionsSort, setInterviewSessionsSort] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const handleNextPage = () => {
    if (page * limit < totalsessions) {
      setPage(page + 1);
    }
  };

  const handlePage = (page) => {
    if (page > 0 && page <= Math.ceil(totalsessions / limit)) {
      setPage(page);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const session = await getSession();
        const companyId = session?.user?.companyID;
        // console.log('compnayID',companyId);
        const response = await fetchInterCategories(companyId, page, limit)
        setCategories(response.data.categories);
        setTotalSessions(response.data.total);
      } catch (error) {
        console.log(error);
      }
    }

    fetchCategories();
  }, [page, limit, modalOpen])


  if (status === "loading") {
    return (
      <>
        <Loading />
      </>
    );
  } else {
    if (session.user.role !== 'COMPANY') {
      const loginURL = `/login?redirect=${encodeURIComponent(pathname)}`;
      redirect(loginURL);
    }
  }


  return (
    <>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Company</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Interview Categories</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="px-9 py-4 w-full max-w-[1500px] mx-auto h-full">
          <h1 className="text-3xl font-semibold">Categories</h1>
          <div className=" bg-slate-600/10 w-full h-fit p-9 rounded-lg mt-5">
            <div>
              <h1 className=" text-2xl font-semibold">Interview Categories</h1>
              <div className="flex mb-5 justify-end">
                <button
                  onClick={() => setModalOpen(true)}
                  className="rounded-lg bg-gradient-to-tr from-lightred to-darkred px-5 py-2"
                >
                  +Add category
                </button>
              </div>

              <div>
                {loading ? (
                  <div>Loading interview sessions...</div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={categories}

                  />

                )}
              </div>
              {modalOpen && <InterviewCategoryModal setModalOpen={setModalOpen} isUpdated={false} />}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => handlePreviousPage()} />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink onClick={() => handlePage(page + 1)}>
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink onClick={() => handlePage(page + 2)}>
                    {page + 2}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext onClick={() => handleNextPage()} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>

      </SidebarInset>
    </>
  );
};

export default InterviewCategoryPage;
