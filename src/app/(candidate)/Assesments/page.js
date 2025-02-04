import React from 'react';
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
const Assesments = () => {
    const assessments = [
        {
            id: 1,
            title: "Software Engineering Test",
            category: "Technical",
            description: "This is a sample description for the software engineering assessments.",
            image: "https://picsum.photos/200/300",
            views: "1.2K",
            comments: "6",
            link: "/test/1"
        },
        {
            id: 2,
            title: "Full Stack Developer Exam",
            category: "Technical",
            description: "This is an assessment for Full Stack Developer positions.",
            image: "https://picsum.photos/201/300",
            views: "2.3K",
            comments: "12",
            link: "/test/2"
        },
        {
            id: 3,
            title: "Data Science Assessment",
            category: "Technical",
            description: "Evaluate your knowledge in data science, including machine .",
            image: "https://picsum.photos/202/300",
            views: "800",
            comments: "4",
            link: "/test/3"
        },
        {
            id: 4,
            title: "DevOps Engineer Certification",
            category: "Operations",
            description: "Test your understanding of DevOps principles, continuous tools.",
            image: "https://picsum.photos/203/300",
            views: "1.5K",
            comments: "15",
            link: "/test/4"
        },
        {
            id: 5,
            title: "Cloud Architect Exam",
            category: "Technical",
            description: "Assess your ability to design and implement scalable cloud infrastructure solutions.",
            image: "https://picsum.photos/204/300",
            views: "2.0K",
            comments: "8",
            link: "/test/5"
        },
        {
            id: 6,
            title: "Mobile App Development Challenge",
            category: "Technical",
            description: "Test your knowledge and skills in building mobile applications for both Andr.",
            image: "https://picsum.photos/205/300",
            views: "1.8K",
            comments: "20",
            link: "/test/6"
        },
        {
            id: 7,
            title: "Cybersecurity Fundamentals Exam",
            category: "Security",
            description: "Assess your understanding of the fundamentals of cybersecurity, threa.",
            image: "https://picsum.photos/206/300",
            views: "1.0K",
            comments: "3",
            link: "/test/7"
        },
        {
            id: 8,
            title: "Artificial Intelligence (AI) Assessment",
            category: "Technical",
            description: "Evaluate your expertise in AI concepts, including neural networks, deep learning,.",
            image: "https://picsum.photos/207/300",
            views: "2.5K",
            comments: "25",
            link: "/test/8"
        },
        {
            id: 9,
            title: "Blockchain Developer Test",
            category: "Technical",
            description: "Test your knowledge of blockchain technology, smart contracts, and decentralized application.",
            image: "https://picsum.photos/208/300",
            views: "1.3K",
            comments: "9",
            link: "/test/9"
        },
        {
            id: 10,
            title: "Product Manager Certification",
            category: "Management",
            description: "This assessment tests your ability to manage and deliver successful products.",
            image: "https://picsum.photos/209/300",
            views: "3.0K",
            comments: "30",
            link: "/test/10"
        }
    ];


    return (

        <>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block cursor-pointer">
                                    <BreadcrumbPage>Assesments Tests</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="px-9 py-4 w-full max-w-[1500px] mx-auto h-full text-white">
                    <h1 className="text-3xl font-semibold">Assesments</h1>
                    <div className=" bg-slate-600/10 w-full h-fit  p-9 rounded-lg mt-5">
                        <div>
                            <h1 className=" text-2xl font-semibold mb-6">Candidate Assesments Tests</h1>

                            <div className=" grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {assessments.map((assessment) => (
                                    <div key={assessment.id} className="h-auto border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                                        <img className="h-48 w-full object-cover object-center" src={assessment.image} alt="blog" />
                                        <div className="p-6">
                                            <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">{assessment.category}</h2>
                                            <h1 className="title-font text-lg font-medium text-white mb-3">{assessment.title}</h1>
                                            <p className="leading-relaxed mb-3">{assessment.description}</p>
                                            <div className="flex items-center flex-wrap">
                                                <a href={assessment.link} className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">
                                                    Enter the Test
                                                    <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"
                                                        strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M5 12h14"></path>
                                                        <path d="M12 5l7 7-7 7"></path>
                                                    </svg>
                                                </a>
                                                <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                                                    <svg className="w-4 h-4 mr-1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                        <circle cx="12" cy="12" r="3"></circle>
                                                    </svg>
                                                    {assessment.views}
                                                </span>
                                                <span className="text-gray-400 inline-flex items-center leading-none text-sm">
                                                    <svg className="w-4 h-4 mr-1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                                                    </svg>
                                                    {assessment.comments}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>


                        </div>
                    </div>
                </div>
            </SidebarInset>

        </>
    );
};

export default Assesments;
