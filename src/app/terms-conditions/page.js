"use client";
import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

import { useEffect, useRef, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { PiHandPointing } from "react-icons/pi";
import logo from "../../assets/landing_page/logo.png";

export default function TermsAndConditions() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect");;
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [theme, setTheme] = useState('default');
    const [currentThemeIndex, setCurrentThemeIndex] = useState(0);


    const themes = ['default', 'theme2', 'theme3', 'theme4', 'theme5', 'dark'];
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'default';
        document.documentElement.setAttribute('data-theme', savedTheme);
        setTheme(savedTheme);

        const currentThemeIndex = themes.indexOf(localStorage.getItem('theme'));
        setCurrentThemeIndex(currentThemeIndex);
        if (savedTheme === "dark") {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        } else if ((savedTheme === "default") || (savedTheme === "theme1") || (savedTheme === "theme2") || (savedTheme === "theme3") || (savedTheme === "theme4") || (savedTheme === "theme5")) {
            setIsDarkMode(false);
            document.documentElement.classList.remove("dark");
        } else {
            const prefersDarkMode = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
            setIsDarkMode(prefersDarkMode);
            document.documentElement.classList.toggle("dark", prefersDarkMode);
            if (prefersDarkMode) {
                setTheme('dark');
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                setTheme(savedTheme);
                document.documentElement.setAttribute('data-theme', savedTheme);
            }

        }
    }, []);






    const toggleTheme = () => {
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
    };

    const handleThemeChange = (newTheme) => {
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.toggle("dark");
            setIsDarkMode(true);
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove("dark");
        }
        setTheme(newTheme);
    };

    const handleThemeChangeMobile = () => {
        const currentThemeIndexNew = (currentThemeIndex + 1) % themes.length;
        const newTheme = themes[currentThemeIndexNew];
        setCurrentThemeIndex(currentThemeIndexNew);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        if (newTheme === 'dark') {
            document.documentElement.classList.add("dark");
            setIsDarkMode(true);
        } else {
            document.documentElement.classList.remove("dark");
            setIsDarkMode(false);
        }

        setTheme(newTheme);
    };


    const requestDemo = async () => {
        router.push("https://tally.so/r/wQko91");
    };

    const pageRedirection = async (path) => {
        router.push(`${path}`);
    };

    const getButtonBgColor = () => {
        const themeColors = {
            default: '#ffe582',
            theme2: '#a6e197',
            theme3: '#d3b4ff',
            theme4: '#ffb3b5',
            theme5: '#82dbff',
            dark: '#82e0ff',
        };
        return themeColors[theme] || '#ffffff';
    };



    return (
        <div className=" w-full">
            <div className=" w-full text-black bg-background dark:text-white">
                <header className=" w-full ">
                    <div className=" w-[90%] max-w-[1500px] flex items-center justify-between pt-14 md:pt-20 pb-[30px] md:pb-12 mx-auto">
                        <div>
                            <div className="hidden md:block">
                                {isDarkMode ? (
                                    <Image
                                        src="/landing_page/logo-dark.png"
                                        alt="logo"
                                        width={464}
                                        height={82}
                                        onClick={() => { pageRedirection('/') }}
                                        className="cursor-pointer"
                                    />
                                ) : (
                                    <Image
                                        src="/landing_page/logo.png"
                                        alt="logo"
                                        width={464}
                                        height={82}
                                        onClick={() => { pageRedirection('/') }}
                                        className="cursor-pointer"
                                    />
                                )}
                            </div>

                            <div className="block md:hidden">
                                {isDarkMode ? (
                                    <Image
                                        src="/landing_page/logo_mobile_dark.png"
                                        alt="logo"
                                        width={200}
                                        height={50}
                                    />
                                ) : (
                                    <Image
                                        src="/landing_page/logo_mobile_light.png"
                                        alt="logo"
                                        width={200}
                                        height={50}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center items-center">
                            <div className="sm:flex justify-center items-center gap-4 mt-4 hidden ">
                                <button
                                    onClick={() => handleThemeChange('default')}
                                    className={`w-8 h-8 rounded-full bg-[#ffffff] ${theme === 'default' ? 'border-2 border-gray-400' : ''}`}
                                ></button>
                                <button
                                    onClick={() => handleThemeChange('theme2')}
                                    className={`w-8 h-8 rounded-full bg-[#D1F8FF] ${theme === 'theme2' ? 'border-2 border-gray-400' : ''}`}
                                ></button>
                                <button
                                    onClick={() => handleThemeChange('theme3')}
                                    className={`w-8 h-8 rounded-full bg-[#DDFFD1] ${theme === 'theme3' ? 'border-2 border-gray-400' : ''}`}
                                ></button>
                                <button
                                    onClick={() => handleThemeChange('theme4')}
                                    className={`w-8 h-8 rounded-full bg-[#FFF8D1] ${theme === 'theme4' ? 'border-2 border-gray-400' : ''}`}
                                ></button>
                                <button
                                    onClick={() => handleThemeChange('theme5')}
                                    className={`w-8 h-8 rounded-full bg-[#FEDBDB] ${theme === 'theme5' ? 'border-2 border-gray-400' : ''}`}
                                ></button>
                                <button
                                    onClick={() => handleThemeChange('dark')}
                                    className={`w-8 h-8 rounded-full bg-[#161618] ${theme === 'dark' ? 'border-2 border-gray-400' : ''}`}
                                ></button>
                            </div>

                            <button
                                onClick={() => handleThemeChangeMobile()}
                                className="w-11 h-11 md:w-16 md:h-16 rounded-full flex justify-center items-center transition-all duration-300 sm:hidden "
                                style={{ backgroundColor: getButtonBgColor() }}
                            >
                                <PiHandPointing size={24} color="#000" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="space-y-7 md:w-[90%] md:max-w-[1500px] mx-auto  text-black  dark:text-white px-6">
                    <h1 className="text-2xl font-bold">Terms and Conditions for SkillChecker</h1>

                    <p className="mt-5">Effective Date: March 13, 2025</p>

                    <section>
                        <h2 className="font-bold mb-2 text-base">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using SkillChecker &#40;&apos;Service&apos;&#41;, a product of Coullax &#40;&apos;Company,&apos; &apos;we,&apos; &apos;our,&apos; or &apos;us&apos;&#41;, you &#40;,&apos;User,&apos; &apos;you&apos;&#41; agree to be bound by these Terms and Conditions &#40;&apos;Terms&apos;&#41;. If you do not agree with any part of these Terms, you must not use our Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold mb-2 text-base">2. User Responsibilities</h2>
                        <p>
                            Account Security: You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                        </p>
                        <p>
                            Prohibited Conduct: You agree not to misuse the Service, including but not limited to:
                        </p>
                        <p>
                            Violating any applicable laws or regulations.
                        </p>
                        <p>
                            Infringing upon the intellectual property rights of others.
                        </p>
                        <p>
                            Introducing malicious software or code.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold mb-2 text-base">3. Payment Terms</h2>
                        <p>
                            Subscription Fees: Access to certain features of the Service may require a subscription. You agree to pay all applicable fees as described at the time of subscription.
                        </p>
                        <p>
                            Billing: Subscription fees will be billed in advance on a recurring basis as per the selected plan.
                        </p>
                        <p>
                            Refunds: All payments are non-refundable unless otherwise stated by the Company.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold mb-2 text-base">4. Intellectual Property</h2>
                        <p>
                            Ownership: The Service and its original content, features, and functionality are and will remain the exclusive property of Coullax and its licensors.
                        </p>
                        <p>
                            License: We grant you a limited, non-exclusive, non-transferable license to use the Service in accordance with these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold mb-2 text-base">5. Data Privacy</h2>
                        <p>
                            Your privacy is important to us. Please refer to our Privacy Policy for information on how we collect, use, and disclose your personal information.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold mb-2 text-base">6. Service Availability</h2>
                        <p>
                            We strive to keep the Service available 24/7 but do not guarantee uninterrupted access. We may suspend or restrict access to the Service to perform maintenance or address technical issues.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold mb-2 text-base">7. Limitation of Liability</h2>
                        <p>
                            To the fullest extent permitted by law, Coullax shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
                        </p>
                        <p>
                            Your use or inability to use the Service.
                        </p>
                        <p>
                            Any unauthorized access to or use of our servers and/or any personal information stored therein.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold mb-2 text-base">8. Governing Law</h2>
                        <p>
                            These Terms shall be governed and construed in accordance with the laws of Sri Lanka, without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold mb-2 text-base">9. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant changes by posting the new Terms on our website. Your continued use of the Service after such changes constitutes your acceptance of the new Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold mb-2 text-base">10. Contact Information</h2>
                        <p>
                            If you have any questions about these Terms, please contact us at support@skillchecker.ai.
                        </p>
                    </section>

                    <p className="font-medium mt-8">
                        By using SkillChecker, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
                    </p>
                </main>
            </div>








            <div className=" w-full bg-background relative overflow-hidden pt-3 md:pt-10 ">
                    <div className=" md:w-[90%] md:max-w-[1500px] md:mx-auto bg-footer-background rounded-full text-black mb-4">
                      <div className="flex justify-center md:justify-between py-6 px-20 flex-wrap flex-col md:flex-row items-center ">
                        <div className="flex flex-col justify-center items-center">
                          <div className="flex justify-center md:justify-start text-sm text-center w-full cursor-pointer">
                            <Image
                              src={logo}
                              alt="logo"
                              width="180"
                              height="24"
                              onClick={() => {
                                pageRedirection("/");
                              }}
                            />
                          </div>
                          <span className="text-xs text-center inline-block mt-2 ">
                            <span
                              className="mr-2 cursor-pointer hover:underline"
                              onClick={() => {
                                pageRedirection("/terms-conditions");
                              }}
                            >
                              Terms and conditions{" "}
                              <FiArrowUpRight
                                className=" inline-block"
                                onClick={() => {
                                  pageRedirection("/privacy-policy");
                                }}
                              />
                            </span>
            
                            <span
                              className="cursor-pointer hover:underline"
                              onClick={() => {
                                pageRedirection("/privacy-policy");
                              }}
                            >
                              Privacy policy <FiArrowUpRight className=" inline-block" />
                            </span>
                          </span>
                        </div>
            
                        <div className="flex gap-3 mt-3 md:mt-0 flex-col md:flex-row items-center justify-center md:justify-between">
                          <button
                            onClick={requestDemo}
                            className="bg-[#ffffff] text-black py-[12px] px-[20px] rounded-full text-xs md:text-base font-bold  shadow-[4px_4px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all border-2 border-black"
                          >
                            Request a Demo
                          </button>
                        </div>
                      </div>
                    </div>
            
                    <div className=" w-[80%] mx-auto mt-16 mb-20 ">
                      <span className="flex justify-center items-center text-sm text-center w-full text-black dark:text-white">
                        2025&nbsp;Skillchecker.ai&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;All
                        rights reserved
                      </span>
                    </div>
                  </div>
        </div>
    );
}


