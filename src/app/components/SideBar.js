import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import * as React from "react";

export function SidebarMenu({ menus }) {
  const uniqueLabels = Array.from(new Set(menus.map(menu => menu.label)));

  return (
    <ScrollArea className="h-screen lg:w-48 sm:w-full rounded-md">
      <div className="md:px-4 sm:p-0 mt-5">
        {uniqueLabels.map((label, index) => (
          <React.Fragment key={label}>
            {label && (
              <p
                className={`mx-4 mb-3 text-xs text-left tracking-wider font-bold text-slate-300 ${
                  index > 0 ? "mt-10" : ""
                }`}
              >
                {label}
              </p>
            )}
            {menus
              .filter(menu => menu.label === label)
              .map(menu => (
                <React.Fragment key={menu.name}>
                  {menu.submenu && menu.submenu.length > 0 ? (
                    <Accordion
                      type="single"
                      className="mt-[-10px] mb-[-10px] p-0 font-normal"
                      collapsible
                    >
                      <AccordionItem
                        value="item-1"
                        className="m-0 p-0 font-normal"
                      >
                        <AccordionTrigger>
                          <a
                            className="w-full flex justify-start text-xs font-normal h-10 bg-background my-2 items-center p-4 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-background rounded-md"
                          >
                            <div className="flex justify-between w-full">
                              <div className="flex">{menu.name}</div>
                            </div>
                          </a>
                        </AccordionTrigger>
                        <AccordionContent>
                          {menu.submenu.map(submenu => (
                            <Link
                              key={submenu.name}
href={submenu.href}
  className="text-xs h-10 bg-background dark:bg-background dark:hover:bg-primary dark:hover:text-white hover:text-white my-2 flex items-center p-4 rounded-md"
                            >
                              {submenu.name}
                            </Link>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <div>
                      <Link
  href={menu.href}
  className="text-xs h-10 bg-background dark:bg-background dark:hover:bg-primary hover:text-white dark:hover:text-white my-2 flex items-center p-4 rounded-md text-white"
                      >
                        {menu.name}
                      </Link>
                    </div>
                  )}
                </React.Fragment>
              ))}
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  );
}
