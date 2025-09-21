import React from "react";
import Image from "next/image";
import Blob from "@/components/blob";
import { LoginForm } from "./_components/loginComponent";

function page() {
  return (
    <div className="h-screen">
      <div className="bg-white h-full w-full rounded-lg shadow-lg flex flex-col items-center justify-center">
        <div className="flex  w-full h-full">
          <div className="w-[45%] p-4 relative overflow-hidden z-0 flex flex-col justify-center gap-4 px-24">
            <div className="w-full h-full absolute -top-5 -left-5 flex flex-col -space-y-40 bg-gray-100/20 ">
              <div className="flex items-center justify-between -z-10">
                <Blob className="bg-green-200/60" />
                <Blob className="bg-pink-100/60" />
              </div>
              <div className="flex items-center justify-end">
                <Blob className="bg-blue-200/60 ml-20" />
              </div>
              <div className="flex items-center justify-start">
                <Blob className="bg-pink-200/60" />
              </div>
            </div>

            <div className="absolute top-24 left-24 z-10">
              <div className="border-2 border-black/90 rounded-lg px-3 pt-2 w-fit aspect-square">
                <Image
                  src={"/dochive_logo.png"}
                  alt="Logo"
                  width={30}
                  height={30}
                  className="relative z-10"
                />
              </div>
            </div>

            <div className="relative z-10 text-4xl font-bold text-gray-800">
              <h1>DocHive</h1>
            </div>
            <div className="z-10">
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae
                mollitia recusandae ducimus distinctio accusantium dignissimos
                est! Assumenda optio reiciendis officiis dicta voluptatem ipsam,
                quasi sint earum id cupiditate recusandae labore.
              </p>
            </div>
          </div>

          <div className="flex-1 p-4  flex flex-col justify-center items-center w-full">
            <LoginForm className={"w-3/5"} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
