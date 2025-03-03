"use client";
import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { LuPaintbrush } from "react-icons/lu";
import { imageUrls } from "@/constants";

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

  const engineRef = useRef(null);
  const worldRef = useRef(null);
  const renderRef = useRef(null);
  const imageBodiesRef = useRef([]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });

        // Update renderer if it exists
        if (renderRef.current) {
          Matter.Render.setPixelRatio(
            renderRef.current,
            window.devicePixelRatio
          );
          Matter.Render.setSize(renderRef.current, width, height);

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
  }, []); // Empty dependency array to run only once

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
        pixelRatio: window.devicePixelRatio,
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

    // Create random positioned image circles
    const imageBodies = [];
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 800;
      const y = Math.random() * 600;
      const body = createImageCircle(x, y);
      imageBodies.push(body);
    }

    imageBodiesRef.current = imageBodies;
    World.add(world, imageBodies);

    const ground = Bodies.rectangle(
      dimensions.width / 2,
      dimensions.height + 50,
      dimensions.width * 2,
      100,
      {
        isStatic: true,
        render: { visible: false },
      }
    );
    const leftWall = Bodies.rectangle(
      -50,
      dimensions.height / 2,
      100,
      dimensions.height * 2,
      {
        isStatic: true,
        render: { visible: false },
      }
    );
    const rightWall = Bodies.rectangle(
      dimensions.width + 50,
      dimensions.height / 2,
      100,
      dimensions.height * 2,
      {
        isStatic: true,
        render: { visible: false },
      }
    );
    const topWall = Bodies.rectangle(
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

    // Mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });

    World.add(world, mouseConstraint);

    Matter.Events.on(mouseConstraint, "mousemove", (event) => {
      const mousePosition = event.mouse.position;

      // Find the body at the mouse position
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

    // Floating animation: continuously apply small random forces
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
    // Randomly select 6 unique emojis from the imageUrls array
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

    // Set the selected emojis to the selectedImage state
    setSelectedImage(sortEmolis);
    setFirstPlace(sortEmolis[0].url);
    setSecondPlace(sortEmolis[1].url);
    setThirdPlace(sortEmolis[2].url);
    setShowResult(true);
  };

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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleButtonClick = () => {
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % buttons.length);
      setIsAnimating(false);
    }, 500);
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
          onClick={() => setShowResult(false)}
          className="absolute top-0 h-full w-full bg-black/90 flex flex-col justify-center items-center"
        >
          <div className=" grid w-[60%] grid-cols-3 gap-3 ml-[10%]">
            {selectedImage.map((emoji, index) => (
              <div
                key={index}
                className=" relative w-full bg-[#FFFFFF1A] border-2 border-white rounded-lg p-3 flex flex-col items-center"
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
                <img
                  src={emoji.url}
                  alt="Selected Image"
                  className=" mx-auto h-14 w-14 mt-4"
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
              </div>
            ))}
          </div>
        </div>
      )}

      {isEmojiClicked && (
        <div
          onClick={() => setIsEmojiClicked(false)}
          className="absolute top-0 h-full w-full bg-black/95 text-8xl flex flex-col justify-center items-center"
        >
          <div className=" w-[40%] bg-[#FFFFFF1A] border-2 border-white rounded-lg p-5 flex flex-col items-center">
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
          </div>
        </div>
      )}

      <button
        onClick={changeBackgroundColor}
        className="p-3 absolute top-5 right-5 rounded-full shadow-lg hover:bg-gray-100 transition"
        style={{ backgroundColor: buttonColor }}
      >
        <LuPaintbrush size={24} color="#FFFFFF" />
      </button>

      {!(isEmojiClicked || showResult) && (
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-fit">
          <button
            onClick={handleButtonClick}
            className={`py-2 px-10 mx-auto rounded-full text-xl font-semibold shadow-lg border-4 border-black transition-all ${
              buttons[currentIndex].bgColor
            } ${buttons[currentIndex].textColor} ${
              buttons[currentIndex].font || ""
            } ${isAnimating ? "animate-swipe-out" : "animate-swipe-in"}`}
          >
            {buttons[currentIndex].text}
          </button>
        </div>
      )}

      <div className="absolute top-5 left-5 bg-[#ffffffc0] p-2 flex flex-col justify-center items-center rounded-lg">
        <div className=" mb-1 relative h-10 flex justify-center items-center">
          <div className="rounded-full z-50 absolute top-0 left-0 font-bold bg-[#FBC225] text-stroke border-2 border-black text-white text-center text-lg flex justify-center items-center h-full aspect-square">
            1<span className=" align-super -top-1 relative text-xs">st</span>
          </div>
          <div className=" mx-2 pl-8  flex flex-row justify-center h-9 w-[100px] bg-white items-center border-2 border-black rounded-lg">
            {firstPlace !== "?" ? (
              <img
                src={firstPlace}
                alt="First Place"
                className="w-14 h-14 absolute -top-2 right-6"
              />
            ) : (
              <div className="w-[28px] mr-5 text-black text-center text-base flex justify-center items-center font-semibold h-7 aspect-square">
                ?
              </div>
            )}
          </div>
        </div>
        <div className=" mb-1 relative h-10 flex justify-center items-center">
          <div className="rounded-full z-50 absolute top-0 left-0 font-bold bg-[#A6A6A6] text-stroke border-2 border-black text-white text-center text-lg flex justify-center items-center h-full aspect-square">
            2<span className=" align-super -top-1 relative text-xs">nd</span>
          </div>
          <div className=" mx-2 pl-8  flex flex-row justify-center h-9 w-[100px] bg-white items-center border-2 border-black rounded-lg">
            {secondPlace !== "?" ? (
              <img
                src={secondPlace}
                alt="First Place"
                className="w-14 h-14 absolute -top-2 right-6"
              />
            ) : (
              <div className="w-[28px] mr-5 text-black text-center text-base flex justify-center items-center font-semibold h-7 aspect-square">
                ?
              </div>
            )}
          </div>
        </div>
        <div className=" mb-1 relative h-10 flex justify-center items-center">
          <div className="rounded-full z-50 absolute top-0 left-0 font-bold bg-[#BC712F] text-stroke border-2 border-black text-white text-center text-lg flex justify-center items-center h-full aspect-square">
            3<span className=" align-super -top-1 relative text-xs">rd</span>
          </div>
          <div className=" mx-2 pl-8  flex flex-row justify-center h-9 w-[100px] bg-white items-center border-2 border-black rounded-lg">
            {thirdPlace !== "?" ? (
              <img
                src={thirdPlace}
                alt="First Place"
                className="w-14 h-14 absolute -top-2 right-6"
              />
            ) : (
              <div className="w-[28px] mr-5 text-black text-center text-base flex justify-center items-center font-semibold h-7 aspect-square">
                ?
              </div>
            )}
          </div>
        </div>
        <div
          onClick={handleSearchClick}
          className=" bg-black rounded-lg text-white text-center text-sm w-[105px] h-9 flex justify-center items-center"
        >
          Rank
        </div>
      </div>
    </div>
  );
};

export default MatterCircleStack;
