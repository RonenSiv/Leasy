import React, { useState } from "react";
import { InputCta } from "@/app/components/Forms/InputCta";
import { ChatBubble } from "@/app/components/Chat/ChatBubble";
import { ExpendableCard } from "@/app/components/ui/cards/ExpendableCard";

//TODO: implement on chat response
const splitTextToLetters = (text: string) => text.split("");

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function ChatBot({ expanded = false }: { expanded?: boolean }) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [chatHeight, setChatHeight] = useState("45");
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setResponse(data.choices[0].text);
  };

  const onExpand = () => {
    setChatHeight(chatHeight === "45" ? "100" : "45");
  };
  const responseLetters = splitTextToLetters(response);
  const animateResponse = responseLetters.map(
    (letter: string, index: number) => (
      //TODO implement motion
      // <motion.span key={index} variants={letterVariants}>
      //   {letter}
      // </motion.span>
      <span key={index}>{letter}</span>
    ),
  );

  return (
    <>
      <div className={`${chatHeight === "100" ? "hidden" : ""} flex h-[5vh]`} />
      <div
        style={{
          height: `${chatHeight}vh`,
          maxHeight: "50vh",
        }}
      >
        <ExpendableCard
          stretchVertically
          stretchHorizontally
          className={`pb-2 ${expanded ? "mx-0" : ""}`}
          onExpand={onExpand}
        >
          <div
            className={`relative flex flex-col h-full justify-between overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-white dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800 px-2`}
          >
            <div className={"flex flex-col gap-4"}>
              <ChatBubble
                text={
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus at tellus ultricies, fermentum tellus eu, interdum magna. Suspendisse vehicula erat non fermentum malesuada. Aenean sed nisl a sapien congue tincidunt ut sed ex. Curabitur ante mauris, lacinia non nibh vel, feugiat lobortis metus. Maecenas sed ultrices diam. Vivamus sollicitudin ex nec tellus tempor, a condimentum neque finibus. Quisque condimentum, tortor vitae blandit eleifend, augue neque tristique libero, posuere cursus nibh tortor eget dui. Praesent ullamcorper purus non elit vulputate, vel bibendum ipsum pretium. Praesent sollicitudin, odio ut consectetur mattis, tellus purus congue dolor, nec rhoncus lectus nisi sit amet sapien. Aliquam vitae diam nec odio vulputate mattis vitae non nibh.\n" +
                  "\n" +
                  "Quisque a blandit lorem, quis rhoncus est. Ut congue ligula eget ex rutrum gravida. Donec euismod auctor arcu nec convallis. Donec vitae erat non sapien efficitur aliquet in non tellus. Sed interdum feugiat tortor eu pulvinar. Nam convallis purus orci, finibus ultricies ligula mollis quis. Vivamus sit amet interdum ex. Nulla massa metus, fermentum vel sem eu, pretium egestas sapien. Pellentesque placerat condimentum ante, non eleifend quam sagittis quis. Nam dapibus rhoncus eros sed pharetra.\n" +
                  "\n" +
                  "Ut sit amet leo nulla. Maecenas ex eros, pulvinar vel sem vel, mattis malesuada justo. Morbi at ligula nisl. Nam mattis diam sit amet maximus tempor. Duis lectus sapien, euismod in velit at, interdum placerat augue. Donec at ex sed nulla ornare semper sed a ligula. Ut eu rhoncus diam. Nam elementum pharetra vestibulum. Sed efficitur fermentum lectus at gravida. Aliquam erat volutpat. Sed ullamcorper vel lectus sit amet aliquam. Integer efficitur interdum massa non tempus.\n" +
                  "\n" +
                  "Aliquam volutpat quam id neque aliquet congue. Integer sed tincidunt ante, sit amet commodo sapien. Aenean eu mattis eros. Quisque in tellus eu diam porttitor finibus a at ligula. Pellentesque elementum volutpat tincidunt. Vivamus quis scelerisque lorem. In congue feugiat mauris quis suscipit. Etiam vulputate fringilla fermentum. Nam vel nisl feugiat, placerat lacus et, efficitur mi. Donec placerat tempor arcu quis laoreet. Vestibulum tincidunt fringilla felis, et euismod erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.\n" +
                  "\n" +
                  "Maecenas quis nunc at diam gravida iaculis. Vestibulum laoreet metus id urna elementum lacinia. Donec vehicula tristique turpis ac accumsan. Maecenas non augue et eros pharetra efficitur ut egestas tellus. In sagittis nunc sed velit auctor, a malesuada metus dignissim. Nullam at bibendum erat. Vivamus imperdiet sodales commodo. Curabitur ac dui eu augue vulputate varius. Fusce vitae nisi id elit posuere hendrerit a tristique dolor. Sed quam tortor, semper mollis convallis quis, blandit non est."
                }
              />
              <ChatBubble
                text={
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus at tellus ultricies, fermentum tellus eu, interdum magna. Suspendisse vehicula erat non fermentum malesuada. Aenean sed nisl a sapien congue tincidunt ut sed ex. Curabitur ante mauris, lacinia non nibh vel, feugiat lobortis metus. Maecenas sed ultrices diam. Vivamus sollicitudin ex nec tellus tempor, a condimentum neque finibus. Quisque condimentum, tortor vitae blandit eleifend, augue neque tristique libero, posuere cursus nibh tortor eget dui. Praesent ullamcorper purus non elit vulputate, vel bibendum ipsum pretium. Praesent sollicitudin, odio ut consectetur mattis, tellus purus congue dolor, nec rhoncus lectus nisi sit amet sapien. Aliquam vitae diam nec odio vulputate mattis vitae non nibh.\n" +
                  "\n" +
                  "Quisque a blandit lorem, quis rhoncus est. Ut congue ligula eget ex rutrum gravida. Donec euismod auctor arcu nec convallis. Donec vitae erat non sapien efficitur aliquet in non tellus. Sed interdum feugiat tortor eu pulvinar. Nam convallis purus orci, finibus ultricies ligula mollis quis. Vivamus sit amet interdum ex. Nulla massa metus, fermentum vel sem eu, pretium egestas sapien. Pellentesque placerat condimentum ante, non eleifend quam sagittis quis. Nam dapibus rhoncus eros sed pharetra.\n" +
                  "\n" +
                  "Ut sit amet leo nulla. Maecenas ex eros, pulvinar vel sem vel, mattis malesuada justo. Morbi at ligula nisl. Nam mattis diam sit amet maximus tempor. Duis lectus sapien, euismod in velit at, interdum placerat augue. Donec at ex sed nulla ornare semper sed a ligula. Ut eu rhoncus diam. Nam elementum pharetra vestibulum. Sed efficitur fermentum lectus at gravida. Aliquam erat volutpat. Sed ullamcorper vel lectus sit amet aliquam. Integer efficitur interdum massa non tempus.\n" +
                  "\n" +
                  "Aliquam volutpat quam id neque aliquet congue. Integer sed tincidunt ante, sit amet commodo sapien. Aenean eu mattis eros. Quisque in tellus eu diam porttitor finibus a at ligula. Pellentesque elementum volutpat tincidunt. Vivamus quis scelerisque lorem. In congue feugiat mauris quis suscipit. Etiam vulputate fringilla fermentum. Nam vel nisl feugiat, placerat lacus et, efficitur mi. Donec placerat tempor arcu quis laoreet. Vestibulum tincidunt fringilla felis, et euismod erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.\n" +
                  "\n" +
                  "Maecenas quis nunc at diam gravida iaculis. Vestibulum laoreet metus id urna elementum lacinia. Donec vehicula tristique turpis ac accumsan. Maecenas non augue et eros pharetra efficitur ut egestas tellus. In sagittis nunc sed velit auctor, a malesuada metus dignissim. Nullam at bibendum erat. Vivamus imperdiet sodales commodo. Curabitur ac dui eu augue vulputate varius. Fusce vitae nisi id elit posuere hendrerit a tristique dolor. Sed quam tortor, semper mollis convallis quis, blandit non est."
                }
                from={"user"}
              />
              <ChatBubble
                text={
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus at tellus ultricies, fermentum tellus eu, interdum magna. Suspendisse vehicula erat non fermentum malesuada. Aenean sed nisl a sapien congue tincidunt ut sed ex. Curabitur ante mauris, lacinia non nibh vel, feugiat lobortis metus. Maecenas sed ultrices diam. Vivamus sollicitudin ex nec tellus tempor, a condimentum neque finibus. Quisque condimentum, tortor vitae blandit eleifend, augue neque tristique libero, posuere cursus nibh tortor eget dui. Praesent ullamcorper purus non elit vulputate, vel bibendum ipsum pretium. Praesent sollicitudin, odio ut consectetur mattis, tellus purus congue dolor, nec rhoncus lectus nisi sit amet sapien. Aliquam vitae diam nec odio vulputate mattis vitae non nibh.\n" +
                  "\n" +
                  "Quisque a blandit lorem, quis rhoncus est. Ut congue ligula eget ex rutrum gravida. Donec euismod auctor arcu nec convallis. Donec vitae erat non sapien efficitur aliquet in non tellus. Sed interdum feugiat tortor eu pulvinar. Nam convallis purus orci, finibus ultricies ligula mollis quis. Vivamus sit amet interdum ex. Nulla massa metus, fermentum vel sem eu, pretium egestas sapien. Pellentesque placerat condimentum ante, non eleifend quam sagittis quis. Nam dapibus rhoncus eros sed pharetra.\n" +
                  "\n" +
                  "Ut sit amet leo nulla. Maecenas ex eros, pulvinar vel sem vel, mattis malesuada justo. Morbi at ligula nisl. Nam mattis diam sit amet maximus tempor. Duis lectus sapien, euismod in velit at, interdum placerat augue. Donec at ex sed nulla ornare semper sed a ligula. Ut eu rhoncus diam. Nam elementum pharetra vestibulum. Sed efficitur fermentum lectus at gravida. Aliquam erat volutpat. Sed ullamcorper vel lectus sit amet aliquam. Integer efficitur interdum massa non tempus.\n" +
                  "\n" +
                  "Aliquam volutpat quam id neque aliquet congue. Integer sed tincidunt ante, sit amet commodo sapien. Aenean eu mattis eros. Quisque in tellus eu diam porttitor finibus a at ligula. Pellentesque elementum volutpat tincidunt. Vivamus quis scelerisque lorem. In congue feugiat mauris quis suscipit. Etiam vulputate fringilla fermentum. Nam vel nisl feugiat, placerat lacus et, efficitur mi. Donec placerat tempor arcu quis laoreet. Vestibulum tincidunt fringilla felis, et euismod erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.\n" +
                  "\n" +
                  "Maecenas quis nunc at diam gravida iaculis. Vestibulum laoreet metus id urna elementum lacinia. Donec vehicula tristique turpis ac accumsan. Maecenas non augue et eros pharetra efficitur ut egestas tellus. In sagittis nunc sed velit auctor, a malesuada metus dignissim. Nullam at bibendum erat. Vivamus imperdiet sodales commodo. Curabitur ac dui eu augue vulputate varius. Fusce vitae nisi id elit posuere hendrerit a tristique dolor. Sed quam tortor, semper mollis convallis quis, blandit non est."
                }
              />
              <ChatBubble
                text={
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus at tellus ultricies, fermentum tellus eu, interdum magna. Suspendisse vehicula erat non fermentum malesuada. Aenean sed nisl a sapien congue tincidunt ut sed ex. Curabitur ante mauris, lacinia non nibh vel, feugiat lobortis metus. Maecenas sed ultrices diam. Vivamus sollicitudin ex nec tellus tempor, a condimentum neque finibus. Quisque condimentum, tortor vitae blandit eleifend, augue neque tristique libero, posuere cursus nibh tortor eget dui. Praesent ullamcorper purus non elit vulputate, vel bibendum ipsum pretium. Praesent sollicitudin, odio ut consectetur mattis, tellus purus congue dolor, nec rhoncus lectus nisi sit amet sapien. Aliquam vitae diam nec odio vulputate mattis vitae non nibh.\n" +
                  "\n" +
                  "Quisque a blandit lorem, quis rhoncus est. Ut congue ligula eget ex rutrum gravida. Donec euismod auctor arcu nec convallis. Donec vitae erat non sapien efficitur aliquet in non tellus. Sed interdum feugiat tortor eu pulvinar. Nam convallis purus orci, finibus ultricies ligula mollis quis. Vivamus sit amet interdum ex. Nulla massa metus, fermentum vel sem eu, pretium egestas sapien. Pellentesque placerat condimentum ante, non eleifend quam sagittis quis. Nam dapibus rhoncus eros sed pharetra.\n" +
                  "\n" +
                  "Ut sit amet leo nulla. Maecenas ex eros, pulvinar vel sem vel, mattis malesuada justo. Morbi at ligula nisl. Nam mattis diam sit amet maximus tempor. Duis lectus sapien, euismod in velit at, interdum placerat augue. Donec at ex sed nulla ornare semper sed a ligula. Ut eu rhoncus diam. Nam elementum pharetra vestibulum. Sed efficitur fermentum lectus at gravida. Aliquam erat volutpat. Sed ullamcorper vel lectus sit amet aliquam. Integer efficitur interdum massa non tempus.\n" +
                  "\n" +
                  "Aliquam volutpat quam id neque aliquet congue. Integer sed tincidunt ante, sit amet commodo sapien. Aenean eu mattis eros. Quisque in tellus eu diam porttitor finibus a at ligula. Pellentesque elementum volutpat tincidunt. Vivamus quis scelerisque lorem. In congue feugiat mauris quis suscipit. Etiam vulputate fringilla fermentum. Nam vel nisl feugiat, placerat lacus et, efficitur mi. Donec placerat tempor arcu quis laoreet. Vestibulum tincidunt fringilla felis, et euismod erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.\n" +
                  "\n" +
                  "Maecenas quis nunc at diam gravida iaculis. Vestibulum laoreet metus id urna elementum lacinia. Donec vehicula tristique turpis ac accumsan. Maecenas non augue et eros pharetra efficitur ut egestas tellus. In sagittis nunc sed velit auctor, a malesuada metus dignissim. Nullam at bibendum erat. Vivamus imperdiet sodales commodo. Curabitur ac dui eu augue vulputate varius. Fusce vitae nisi id elit posuere hendrerit a tristique dolor. Sed quam tortor, semper mollis convallis quis, blandit non est."
                }
                from={"user"}
              />
            </div>
            <div
              className={
                "sticky md:bottom-[-1px] bottom-0 left-0 w-[100%] py-4 bg-white dark:bg-gray-800"
              }
            >
              <form onSubmit={handleSubmit}>
                <InputCta />
              </form>
            </div>
          </div>
        </ExpendableCard>
      </div>
    </>
  );
}
