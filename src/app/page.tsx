"use client";
import { FaArrowUpLong } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaUser } from "react-icons/fa";
import { SiGoogleassistant } from "react-icons/si";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Image from "next/image";
import HeroImage from "@/images/4.png";

interface message {
  User?: string;
  Model?: string;
}

const samples = [
  "What amenities are available with the properties in Banjara Hills?",
  "I want to buy a villa with a large lawn and a swimming pool.",
  "Can you list all properties that are close to schools and parks?",
  "What is the average cost per square foot in Hyderabad?",
  "Can foreigners buy property in Hyderabad?",
  "How can I calculate my home loan eligibility?",
];
export default function Home() {
  const LoadingText = "Please Wait";
  const [Loading, setLoading] = useState(false);
  const [InputValue, setInputValue] = useState("");
  const [Chat, setChat] = useState<message[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const GetResponse = async (query: string) => {
    await axios
      .post("/api/ask", { User_Input: query })
      .then(async (res) => {
        setChat((prevMessages: message[]) => {
          const updatedArray = [
            ...prevMessages.slice(0, -1),
            { Model: res.data },
          ];
          return updatedArray;
        });
        setLoading(false);
      })
      .catch(() => {
        return { data: { success: false } };
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const SendMessageToUI = (UserMessage: string) => {
    setChat((prevMessages: message[]): message[] => [
      ...prevMessages,
      { User: UserMessage },
      { Model: LoadingText },
    ]);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const FaqClick = async (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    setLoading(true);
    const Faq = event.currentTarget.innerText;
    console.log(Faq);
    SendMessageToUI(Faq);
    await GetResponse(Faq || "");
  };

  const handleClick = async () => {
    setLoading(true);
    const UserInput = inputRef.current?.value;
    if (UserInput) SendMessageToUI(UserInput);
    setInputValue("");
    await GetResponse(UserInput || "");
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight; 
    }
  }, [Chat]); 


  return (
    <div className=" sm:w-[60%] md:w-[50%] xl:w-[30%] mx-auto h-screen ">
      <h2 className="font-bold text-center p-2 border-2 sticky top-0 z-10 CPLMainBG underline text-xl md:text-2xl xl:3xl">
        Welcome to LEO-REALTORS
      </h2>
      <div
        id="messages "
        className="md:h-[87vh] lg:h-[88vh] sm:h-[88vh] h-full overflow-y-auto MainBG space-y-2"
        ref={chatBoxRef}
      >
        <div className="space-y-2 flex flex-col ">
          <Image
            alt="Image"
            src={HeroImage}
            height={1000}
            width={1000}
            className="mx-auto rounded-xl w-[80%]"
          />
          <div className="grid grid-flow-row grid-cols-2 space-y-2">
            {samples.map((query, index) => {
              return (
                <Button
                  className="border text-left p-3 w-[90%] mx-auto rounded-xl font-semibold h-fit text-wrap"
                  onClick={FaqClick}
                  key={index}
                >
                  {query}
                </Button>
              );
            })}
          </div>
        </div>
        {Chat.map((message, index) => {
          if (message.User)
            return (
              <div key={index} className="w-full p-2 flex justify-end">
                <div className="max-w-[80%] w-fit text-wrap text-right   rounded-xl  p-2 flex UserMessage justify-between">
                  <p className="w-full text-left"> {message.User}</p>
                  <FaUser className=" rounded-xl ml-2 mt-1  " />
                </div>
              </div>
            );
          else if (message.Model)
            return (
              <div key={index} className="w-full p-2 flex h-fit">
                <div className="max-w-[80%] w-fit  rounded-xl  p-5 flex text-wrap overflow-x-auto ModelMessage">
                  <SiGoogleassistant className=" rounded-xl min-w-fit mr-2 mt-1 " />
                  <Markdown
                    className={"flex-col"}
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {message.Model}
                  </Markdown>
                </div>
              </div>
            );
        })}
      </div>
      <div className="flex border-2 rounded-xl sticky bottom-0 z-10  CPLMainBG ">
        <Input
          className=" placeholder:italic"
          ref={inputRef}
          onChange={handleChange}
          value={InputValue}
          placeholder="Ask anything...."
        />
        <Button onClick={handleClick} className="z-20 " disabled={Loading}>
          <FaArrowUpLong />
        </Button>
      </div>
    </div>
  );
}


