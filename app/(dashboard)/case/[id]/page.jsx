import React from "react";
import DocMap from "../_components/DocMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocBlock from "../_components/DocBlock";

async function page({ params }) {
  const {id} = await params;

  const docs = [
    { name: "Supreme Court Judgment.pdf", date: "2023-10-01" },
    { name: "Protection of Rights.pdf", date: "2023-10-05" },
    { name: "Petition Filed by Shayara.pdf", date: "2023-10-10" },
    { name: "Law Board Statements.pdf", date: "2023-10-15" },
    { name: "National Law Journal Articles.pdf", date: "2023-10-20" },
  ];

  return (
    <div className="flex-1 h-full p-5 z-50 flex flex-col gap-2 overflow-y-auto">
      {/* <div className='flex-1 rounded-lg border border-gray-200 w-full h-full'>
        <DocMap />
      </div> */}

      <h1 className="font-michroma text-3xl">Shayara Bano v. Union of India (2017)</h1>
      <sub className="text-[13px] text-gray-500">
        <b>Case ID:</b> {id}
      </sub>

      <Tabs defaultValue="map" className="flex-1 w-full mt-6">
        <TabsList className={'w-full bg-white'}>
          <TabsTrigger value="map">Document Map</TabsTrigger>
          <TabsTrigger value="files">Case Files</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className={"bg-white w-full h-full rounded-lg"}>
          <DocMap />
        </TabsContent>

        <TabsContent value="files" className={"bg-white w-full h-full rounded-lg p-4"}>
          <div className="w-full flex items-center flex-wrap justify-between gap-4">
            {docs.map((doc, index) => (
              <DocBlock key={index} id={id} name={doc.name} date={doc.date} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="overview" className={"bg-white w-full h-full rounded-lg p-4"}>
          Overview of the case will be shown here.
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default page;
