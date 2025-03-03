"use client";
import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { LuPaintbrush } from "react-icons/lu";
import { imageUrls } from "@/constants";
import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";

const getRandomLightColor = () => {
  const r = Math.random();
  const g = Math.random();
  const b = Math.random();

  const darkr = Math.floor(80 + r * 65);
  const darkg = Math.floor(80 + g * 65);
  const darkb = Math.floor(80 + b * 65);

  const lightr = Math.floor(200 + r * 55);
  const lightg = Math.floor(200 + g * 55);
  const lightb = Math.floor(200 + b * 55);

  return {
    buttonColor: `rgb(${darkr}, ${darkg}, ${darkb})`,
    bgColor: `rgb(${lightr}, ${lightg}, ${lightb})`,
  };
};

const MatterCircleStack = () => {
  const sceneRef = useRef(null);
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const worldRef = useRef(null);
  const renderRef = useRef(null);
  const imageBodiesRef = useRef([]);
  const firstPlaceDivRef = useRef(null);
  const secondPlaceDivRef = useRef(null);
  const thridPlaceDivRef = useRef(null);
  const emojiRefs = useRef([]);

  const [bgColor, setBgColor] = useState("rgb(255, 255, 255)");
  const [firstPlace, setFirstPlace] = useState("?");
  const [secondPlace, setSecondPlace] = useState("?");
  const [thirdPlace, setThirdPlace] = useState("?");
  const [selectedImage, setSelectedImage] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [buttonColor, setButtonColor] = useState("#FFFFFF");
  const [selectedSkillLevel, setSelectedSkillLevel] = useState(50);
  const [selectedTechnicalLevel, setSelectedTechnicalLevel] = useState(80);
  const [selectedBehavioralLevel, setSelectedBehavioralLevel] = useState(20);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [isEmojiClicked, setIsEmojiClicked] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [animateRanking, setAnimateRanking] = useState(false);
  const [firstBoxPosition, setFirstBoxPosition] = useState({ x: 0, y: 0 });
  const [secondBoxPosition, setSecondBoxPosition] = useState({ x: 0, y: 0 });
  const [thridBoxPosition, setThridBoxPosition] = useState({ x: 0, y: 0 });
  const [positions, setPositions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRankFinished, setIsRankFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analizing, setAnalizing] = useState(false);
  const buttons = [
    {
      text: "<Programmer>",
      bgColor: "bg-black",
      textColor: "text-white",
      font: "font-kode_mono",
    },
    {
      text: "Accountant",
      bgColor: "bg-[#4666F6]",
      textColor: "text-white",
      font: "font-jakarta",
    },
    {
      text: "Designer",
      bgColor: "bg-[#F6B546]",
      textColor: "text-black",
      font: "font-pacifico",
    },
    {
      text: "Musician",
      bgColor: "bg-[#C10505]",
      textColor: "text-white",
      font: "font-playfair",
    },
  ];

  useEffect(() => {
    if (firstPlaceDivRef.current) {
      const rect = firstPlaceDivRef.current.getBoundingClientRect();
      setFirstBoxPosition({ x: rect.x, y: rect.y });
    }

    if (secondPlaceDivRef.current) {
      const rect = secondPlaceDivRef.current.getBoundingClientRect();
      setSecondBoxPosition({ x: rect.x, y: rect.y });
    }

    if (thridPlaceDivRef.current) {
      const rect = thridPlaceDivRef.current.getBoundingClientRect();
      setThridBoxPosition({ x: rect.x, y: rect.y });
    }
  }, [firstPlace, dimensions]);

  useEffect(() => {
    const updatedPositions = emojiRefs.current.map((emoji) => {
      if (emoji) {
        const rect = emoji.getBoundingClientRect();
        return { x: rect.left, y: rect.top };
      }
      return { x: 0, y: 0 };
    });

    setPositions(updatedPositions);
  }, [selectedImage, animateRanking]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });

        // Update renderer if it exists
        if (renderRef.current) {
          if (renderRef.current.canvas) {
            Matter.Render.setPixelRatio(
              renderRef.current,
              window.devicePixelRatio
            );
            Matter.Render.setSize(renderRef.current, width, height);
          }
          // Update boundary walls
          if (worldRef.current) {
            // Remove old walls
            const bodies = Matter.Composite.allBodies(worldRef.current);
            const walls = bodies.filter((body) => body.isStatic);
            Matter.World.remove(worldRef.current, walls);

            // Add new walls
            const ground = Matter.Bodies.rectangle(
              width / 2,
              height + 50,
              width * 2,
              100,
              {
                isStatic: true,
                render: { visible: false },
              }
            );
            const leftWall = Matter.Bodies.rectangle(
              -50,
              height / 2,
              100,
              height * 2,
              {
                isStatic: true,
                render: { visible: false },
              }
            );
            const rightWall = Matter.Bodies.rectangle(
              width + 50,
              height / 2,
              100,
              height * 2,
              {
                isStatic: true,
                render: { visible: false },
              }
            );
            const topWall = Matter.Bodies.rectangle(
              width / 2,
              -50,
              width * 2,
              100,
              {
                isStatic: true,
                render: { visible: false },
              }
            );

            Matter.World.add(worldRef.current, [
              ground,
              leftWall,
              rightWall,
              topWall,
            ]);
          }
        }
      }
    };

    const handleResize = () => {
      updateDimensions();
    };

    window.addEventListener("resize", handleResize);
    // Initial setup
    updateDimensions();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const { bgColor, buttonColor } = getRandomLightColor();
    setBgColor(bgColor);
    setButtonColor(buttonColor);
  }, []);

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;

    const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } =
      Matter;

    const engine = Engine.create();
    engineRef.current = engine;
    const { world } = engine;
    worldRef.current = world;

    engine.world.gravity.y = 0;
    engine.world.gravity.x = 0;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: dimensions.width,
        height: dimensions.height,
        wireframes: false,
        background: "transparent",
      },
    });
    renderRef.current = render;

    const createImageCircle = (x, y) => {
      const emoji = imageUrls[Math.floor(Math.random() * imageUrls.length)];
      return Bodies.circle(x, y, 15, {
        restitution: 0.8,
        frictionAir: 0.05,
        render: {
          sprite: {
            texture: emoji.url,
            xScale: 0.18,
            yScale: 0.18,
          },
        },
      });
    };

    const imageBodies = [];
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * dimensions.width;
      const y = Math.random() * dimensions.height;
      const body = createImageCircle(x, y);
      imageBodies.push(body);
    }

    imageBodiesRef.current = imageBodies;
    World.add(world, imageBodies);

    const ground = Matter.Bodies.rectangle(
      dimensions.width / 2,
      dimensions.height + 50,
      dimensions.width * 2,
      100,
      {
        isStatic: true,
        render: { visible: false },
      }
    );
    const leftWall = Matter.Bodies.rectangle(
      -50,
      dimensions.height / 2,
      100,
      dimensions.height * 2,
      {
        isStatic: true,
        render: { visible: false },
      }
    );
    const rightWall = Matter.Bodies.rectangle(
      dimensions.width + 50,
      dimensions.height / 2,
      100,
      dimensions.height * 2,
      {
        isStatic: true,
        render: { visible: false },
      }
    );
    const topWall = Matter.Bodies.rectangle(
      dimensions.width / 2,
      -50,
      dimensions.width * 2,
      100,
      {
        isStatic: true,
        render: { visible: false },
      }
    );

    World.add(world, [ground, leftWall, rightWall, topWall]);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });

    World.add(world, mouseConstraint);

    Matter.Events.on(mouseConstraint, "mousemove", (event) => {
      const mousePosition = event.mouse.position;
      const hoveredBodies = Matter.Query.point(imageBodies, mousePosition);

      if (hoveredBodies.length > 0) {
        document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "default";
      }
    });

    Matter.Events.on(mouseConstraint, "mousedown", (event) => {
      const { body } = event.source;

      if (imageBodies.includes(body)) {
        const clickedEmoji = imageUrls.find(
          (emoji) => emoji.url === body.render.sprite.texture
        );
        if (clickedEmoji) {
          setIsEmojiClicked(true);
          setSelectedSkillLevel(clickedEmoji.skillLevel);
          setSelectedTechnicalLevel(clickedEmoji.technicalLevel);
          setSelectedBehavioralLevel(clickedEmoji.behevioralLevel);
          setSelectedEmoji(clickedEmoji.url);
        }
      }
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const floatingInterval = setInterval(() => {
      imageBodies.forEach((body) => {
        Matter.Body.applyForce(body, body.position, {
          x: (Math.random() - 0.5) * 0.0002,
          y: (Math.random() - 0.5) * 0.0002,
        });
      });
    }, 50);

    return () => {
      clearInterval(floatingInterval);
      Render.stop(render);
      World.clear(world, false);
      Engine.clear(engine);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, [isEmojiClicked, dimensions]);

  const changeBackgroundColor = () => {
    const { bgColor, buttonColor } = getRandomLightColor();
    setBgColor(bgColor);
    setButtonColor(buttonColor);
  };

  const handleSearchClick = () => {
    setLoading(true);
    setAnalizing(true);
    setFirstPlace("?");
    setSecondPlace("?");
    setThirdPlace("?");

    setTimeout(() => {
      setAnalizing(false);
    }, 2000);

    const selectedEmojis = [];
    while (selectedEmojis.length < 6) {
      const randomIndex = Math.floor(Math.random() * imageUrls.length);
      const selectedEmoji = imageUrls[randomIndex];
      if (!selectedEmojis.includes(selectedEmoji)) {
        selectedEmojis.push(selectedEmoji);
      }
    }

    const sortEmolis = selectedEmojis.sort((a, b) => {
      return b.skillLevel - a.skillLevel;
    });

    setSelectedImage(sortEmolis);
    setShowResult(true);

    setTimeout(() => {
      setAnimateRanking(true);
    }, 3000);

    setTimeout(() => {
      setFirstPlace(sortEmolis[0].url);
      setSecondPlace(sortEmolis[1].url);
      setThirdPlace(sortEmolis[2].url);
    }, 4300);

    setTimeout(() => {
      setIsRankFinished(true);
    }, 5000);
  };

  const [isAnimatingButton, setIsAnimatingButton] = useState(false);
  const handleButtonClick = () => {
    setIsAnimatingButton(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % buttons.length);
      setIsAnimatingButton(false);
    }, 500);
  };

  const handleCloseRankWindow = () => {
    setShowResult(false);
    setAnimateRanking(false);
    setIsRankFinished(false);
    setLoading(false);
  };

  return (
    <div
      className="relative w-full h-full"
      ref={containerRef}
      style={{ backgroundColor: bgColor }}
    >
      <div ref={sceneRef} className="absolute inset-0" />
      {showResult && (
        <div
          onClick={handleCloseRankWindow}
          className="absolute top-0 h-full w-full bg-black/90 flex flex-col justify-center items-center"
        >
          {!analizing ? (
            <div className=" grid w-[60%] z-50 grid-cols-3 gap-3 ml-[10%]">
              {selectedImage.map((emoji, index) => (
                <motion.div
                  key={index}
                  className=" w-full"
                  animate={{
                    opacity: [0, 1],
                    scale: [0.5, 1],
                    rotateX: [90, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                  }}
                >
                  <motion.div
                    className=" relative w-full bg-[#FFFFFF1A] border-2 border-white rounded-lg p-3 flex flex-col items-center"
                    animate={{
                      rotateY: isRankFinished && index < 3 ? [0, 360] : 0,
                      opacity: isRankFinished && index < 3 ? [1, 1, 0.9, 0] : 1,
                      display:
                        isRankFinished && index < 3
                          ? ["block", "block", "block", "none"]
                          : "block",
                    }}
                    transition={{
                      duration: 1,
                      ease: "easeInOut",
                    }}
                  >
                    <div
                      className={` ${
                        index === 0
                          ? " text-[#FBC225]"
                          : index === 1
                          ? "text-[#B5B5B5]"
                          : index === 2
                          ? "text-[#CD8648]"
                          : " text-white"
                      } absolute top-3 left-3 text-xl font-bold`}
                    >
                      {index + 1}
                      <span className=" align-super -top-1 relative text-sm">
                        {index === 0
                          ? "st"
                          : index === 1
                          ? "nd"
                          : index === 2
                          ? "rd"
                          : index === 3
                          ? "th"
                          : "th"}
                      </span>
                    </div>

                    <motion.img
                      ref={(el) => (emojiRefs.current[index] = el)}
                      src={emoji.url}
                      alt="Selected Image"
                      className="mx-auto h-14 w-14 mt-4 !z-50"
                      animate={{
                        x:
                          animateRanking && index === 0
                            ? firstBoxPosition.x - positions[0]?.x
                            : animateRanking && index === 1
                            ? secondBoxPosition.x - positions[1]?.x
                            : animateRanking && index === 2
                            ? thridBoxPosition.x - positions[2]?.x
                            : 0,
                        y:
                          animateRanking && index === 0
                            ? firstBoxPosition.y - positions[0]?.y
                            : animateRanking && index === 1
                            ? secondBoxPosition.y - positions[1]?.y
                            : animateRanking && index === 2
                            ? thridBoxPosition.y - positions[2]?.y
                            : 0,
                        scale:
                          animateRanking && index < 3 ? [1, 1.2, 0.8, 1] : 1,
                        opacity:
                          animateRanking && index < 3 ? [1, 1, 0.9, 0] : 1,
                        zIndex: 1000,
                        filter:
                          animateRanking && index < 3
                            ? [
                                "drop-shadow(0px 0px 0px gold)",
                                "drop-shadow(0px 0px 10px gold)",
                                "drop-shadow(0px 0px 20px gold)",
                                "drop-shadow(0px 0px 0px gold)",
                              ]
                            : "none",
                      }}
                      transition={{
                        duration: 1.5,
                        ease: "easeInOut",
                      }}
                    />

                    <div className=" w-full flex justify-between items-center">
                      <div className="w-[48%] h-2 bg-gray-200 border border-white rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${emoji.technicalLevel}%`,
                            background: `black`,
                          }}
                        ></div>
                      </div>
                      <div className="w-[48%] h-2 bg-gray-200 border border-white rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${emoji.behevioralLevel}%`,
                            background: `black`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-200 border border-white rounded-full mt-2 mb-2 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${emoji.skillLevel}%`,
                          background: `linear-gradient(to right, red, yellow, green)`,
                        }}
                      ></div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className=" text-white"
              animate={{
                opacity: [1, 0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
              Analyzing...
            </motion.div>
          )}
        </div>
      )}

      {isEmojiClicked && (
        <div
          onClick={() => setIsEmojiClicked(false)}
          className="absolute top-0 h-full w-full bg-black/95 text-8xl flex flex-col justify-center items-center"
        >
          <motion.div
            className=" w-[40%] bg-[#FFFFFF1A] border-2 border-white rounded-lg p-5 flex flex-col items-center "
            animate={{
              opacity: [0, 1],
              scale: [0.5, 1],
              rotateX: [90, 0],
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
          >
            <img
              src={selectedEmoji}
              alt="Selected Image"
              className=" mx-auto w-32 h-32"
            />
            <div className=" w-full flex justify-between items-center">
              <div className="w-[48%] h-4  bg-gray-200 border border-white rounded-full mt-5 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${selectedBehavioralLevel}%`,
                    background: `black`,
                  }}
                ></div>
              </div>
              <div className="w-[48%] h-4 bg-gray-200 border border-white rounded-full mt-5 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${selectedTechnicalLevel}%`,
                    background: `black`,
                  }}
                ></div>
              </div>
            </div>
            <div className="w-full h-4 bg-gray-200 border border-white rounded-full mt-5 mb-5 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${selectedSkillLevel}%`,
                  background: `linear-gradient(to right, red, yellow, green)`,
                }}
              ></div>
            </div>
          </motion.div>
        </div>
      )}

      <button
        onClick={changeBackgroundColor}
        className="p-3 absolute top-3 right-3 rounded-full shadow-lg hover:bg-gray-100 transition"
        style={{ backgroundColor: buttonColor }}
      >
        <LuPaintbrush size={24} color="#FFFFFF" />
      </button>

      {!(isEmojiClicked || showResult) && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-fit">
          <motion.button
            onClick={handleButtonClick}
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: isAnimatingButton ? 0 : 1,
              scale: isAnimatingButton ? 0.1 : 1,
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={` h-14 px-10 mx-auto rounded-full cursor-pointer text-xl font-semibold shadow-lg border-4 border-black transition-all ${
              buttons[currentIndex].bgColor
            } ${buttons[currentIndex].textColor} ${
              buttons[currentIndex].font || ""
            }`}
          >
            {buttons[currentIndex].text}
          </motion.button>
        </div>
      )}

      <div
        className="absolute top-3 left-3 p-2 flex flex-col justify-center !z-10 items-center rounded-lg"
        style={{ backgroundColor: buttonColor }}
      >
        <div className=" mb-1 relative h-10 flex justify-center items-center">
          <div className="rounded-full z-50 absolute top-0 left-0 font-extrabold bg-[#FBC225] border-[3px] border-black text-white text-center text-lg flex justify-center items-center h-full aspect-square">
            1<span className=" align-super -top-1 relative text-xs">st</span>
          </div>
          <div className=" mx-2 pl-8  flex flex-row justify-center h-9 w-[100px] bg-white items-center border-[3px] border-black rounded-lg">
            {firstPlace !== "?" ? (
              <img
                ref={firstPlaceDivRef}
                src={firstPlace}
                alt="First Place"
                className="w-14 h-14 absolute -top-2 right-6"
              />
            ) : (
              <div
                ref={firstPlaceDivRef}
                className="w-[28px] mr-5 text-black text-center text-base flex justify-center items-center font-semibold h-7 aspect-square"
              >
                ?
              </div>
            )}
          </div>
        </div>
        <div className=" mb-1 relative h-10 flex justify-center items-center">
          <div className="rounded-full z-50 absolute top-0 left-0 font-extrabold bg-[#A6A6A6] border-[3px] border-black text-white text-center text-lg flex justify-center items-center h-full aspect-square">
            2<span className=" align-super -top-1 relative text-xs">nd</span>
          </div>
          <div className=" mx-2 pl-8  flex flex-row justify-center h-9 w-[100px] bg-white items-center border-[3px] border-black rounded-lg">
            {secondPlace !== "?" ? (
              <img
                ref={secondPlaceDivRef}
                src={secondPlace}
                alt="First Place"
                className="w-14 h-14 absolute -top-2 right-6"
              />
            ) : (
              <div
                ref={secondPlaceDivRef}
                className="w-[28px] mr-5 text-black text-center text-base flex justify-center items-center font-semibold h-7 aspect-square"
              >
                ?
              </div>
            )}
          </div>
        </div>
        <div className=" mb-1 relative h-10 flex justify-center items-center">
          <div className="rounded-full z-50 absolute top-0 left-0 font-extrabold bg-[#BC712F] border-[3px] border-black text-white text-center text-lg flex justify-center items-center h-full aspect-square">
            3<span className=" align-super -top-1 relative text-xs">rd</span>
          </div>
          <div className=" mx-2 pl-8  flex flex-row justify-center h-9 w-[100px] bg-white items-center border-[3px] border-black rounded-lg">
            {thirdPlace !== "?" ? (
              <img
                ref={thridPlaceDivRef}
                src={thirdPlace}
                alt="First Place"
                className="w-14 h-14 absolute -top-2 right-6"
              />
            ) : (
              <div
                ref={thridPlaceDivRef}
                className="w-[28px] mr-5 text-black text-center text-base flex justify-center items-center font-semibold h-7 aspect-square"
              >
                ?
              </div>
            )}
          </div>
        </div>
        {!animateRanking && (
          <div
            onClick={handleSearchClick}
            className=" bg-black rounded-lg font-semibold text-white text-center text-sm w-[105px] cursor-pointer h-9 flex justify-center items-center"
          >
            {loading ? <LoaderCircle className="animate-spin" /> : "Rank"}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatterCircleStack;
