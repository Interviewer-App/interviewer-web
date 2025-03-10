"use client";
import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { LuPaintbrush } from "react-icons/lu";
import { PiRankingBold } from "react-icons/pi";
import { imageUrls } from "@/constants";
import { AnimatePresence, motion } from "framer-motion";
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
  const [emojiCount, setEmojiCount] = useState(200);
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
  const [cornerWidth, setCornerWidth] = useState(20);
  const [cornerHeight, setCornerHeight] = useState(20);
  const [bottomWidth, setBottomWidth] = useState(260);
  const [bottomHeight, setBottomHeight] = useState(80);
  const [topRightWidth, setTopRightWidth] = useState(70);
  const [topRightHeight, setTopRightHeight] = useState(70);
  const [emojiScale, setEmojiScale] = useState(0.18);
  const [emojiForce, setEmojiForce] = useState(0.01);
  const [emojiOralScale, setEmojiOralScale] = useState(40);
  const [analizing, setAnalizing] = useState(false);
  // const [dragPosition, setDragPosition] = useState(null);
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
    const updatePositions = () => {
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

      const emojiCount =
        window.innerWidth > 1024 ? 60 : window.innerWidth > 768 ? 40 : 25;
      const emojiScale = window.innerWidth > 1024 ? 0.18 : 0.13;
      const emojiOralScale = window.innerWidth > 1024 ? 35 : 25;
      const emojiForce = window.innerWidth > 1024 ? 0.01 : 0.003;
      setEmojiCount(emojiCount);
      setEmojiScale(emojiScale);
      setEmojiOralScale(emojiOralScale);
      setEmojiForce(emojiForce);

      const cornerWidth = window.innerWidth > 1024 ? 150 : 300;
      const cornerHeight = window.innerWidth > 1024 ? 200 : 50;
      const bottomWidth = window.innerWidth > 1024 ? 260 : 150;
      const bottomHeight = window.innerWidth > 1024 ? 80 : 50;
      const topRightWidth = window.innerWidth > 1024 ? 70 : 50;
      const topRightHeight = window.innerWidth > 1024 ? 70 : 100;

      setCornerWidth(cornerWidth);
      setCornerHeight(cornerHeight);
      setBottomWidth(bottomWidth);
      setBottomHeight(bottomHeight);
      setTopRightWidth(topRightWidth);
      setTopRightHeight(topRightHeight);
    };

    updatePositions();

    window.addEventListener("resize", updatePositions);

    const observer = new MutationObserver(updatePositions);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("resize", updatePositions);
      observer.disconnect();
    };
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

        if (renderRef.current) {
          if (renderRef.current.canvas) {
            Matter.Render.setPixelRatio(
              renderRef.current,
              window.devicePixelRatio
            );
            Matter.Render.setSize(renderRef.current, width, height);
          }

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
      return Bodies.circle(x, y, emojiOralScale, {
        restitution: 0.8,
        frictionAir: 0.05,
        render: {
          sprite: {
            texture: emoji.url,
            xScale: emojiScale,
            yScale: emojiScale,
          },
        },
      });
    };

    const imageBodies = [];
    for (let i = 0; i < emojiCount; i++) {
      let x, y;
      let isValidPosition = false;

      while (!isValidPosition) {
        x = Math.random() * dimensions.width;
        y = Math.random() * dimensions.height;

        // Check if position is inside the restricted areas
        const isInTopLeft = x < cornerWidth && y < cornerHeight;
        const isInTopRight =
          x > dimensions.width - topRightWidth && y < topRightHeight;
        const isInBottomCenter =
          x > dimensions.width / 2 - bottomWidth / 2 &&
          x < dimensions.width / 2 + bottomWidth / 2 &&
          y > dimensions.height - bottomHeight;

        if (!isInTopLeft && !isInBottomCenter && !isInTopRight) {
          isValidPosition = true;
        }
      }

      const body = createImageCircle(x, y);
      imageBodies.push(body);
    }

    // const imageBodies = [];
    // for (let i = 0; i < emojiCount; i++) {
    //   const x = Math.random() * dimensions.width;
    //   const y = Math.random() * dimensions.height;
    //   const body = createImageCircle(x, y);
    //   imageBodies.push(body);
    // }

    imageBodiesRef.current = imageBodies;
    World.add(world, imageBodies);

    const topLeftBoundary = Bodies.rectangle(
      cornerWidth / 2,
      cornerHeight / 2,
      cornerWidth,
      cornerHeight,
      { isStatic: true, render: { visible: false } }
    );

    const topRightBoundary = Bodies.rectangle(
      dimensions.width - topRightWidth / 2,
      topRightHeight / 2,
      topRightWidth,
      topRightHeight,
      { isStatic: true, render: { visible: false } }
    );

    const bottomCenterBoundary = Bodies.rectangle(
      dimensions.width / 2,
      dimensions.height - bottomHeight / 2,
      bottomWidth,
      bottomHeight,
      { isStatic: true, render: { visible: false } }
    );

    World.add(world, [topLeftBoundary, bottomCenterBoundary, topRightBoundary]);

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

    // Matter.Events.on(mouseConstraint, "startdrag", (event) => {
    //   const dragPosition = event.body.position;
    //   setDragPosition(dragPosition);
    // });

    // let dragDistance = null;

    // Matter.Events.on(mouseConstraint, "enddrag", (event) => {
    //   const dropPosition = event.body.position;

    //   console.log("Drag started at:", dragPosition);
    //   console.log("Drag ended at", dropPosition);

    //   const xDistance = Math.abs(Math.abs(dropPosition.x) - Math.abs(dragPosition.x));
    //   console.log("xDistance:", xDistance);
    //   const yDistance = Math.abs(Math.abs(dropPosition.y) - Math.abs(dragPosition.y));
    //   console.log("yDistance:", yDistance);
    //   dragDistance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
    //   console.log("Total drag distance:", dragDistance);
    // });

    // Matter.Events.on(mouseConstraint, "mouseup", (event) => {
    //   const bodiesUnderMouse = Matter.Query.point(
    //     imageBodies,
    //     event.mouse.position
    //   );

    //   console.log("dragDistance:", dragDistance);
    //   if (dragDistance > 180) {
    //     if (bodiesUnderMouse.length > 0) {
    //       const clickedBody = bodiesUnderMouse[0];
    //       const clickedEmoji = imageUrls.find(
    //         (emoji) => emoji.url === clickedBody.render.sprite.texture
    //       );
    //       if (clickedEmoji) {
    //         setIsEmojiClicked(true);
    //         setSelectedSkillLevel(clickedEmoji.skillLevel);
    //         setSelectedTechnicalLevel(clickedEmoji.technicalLevel);
    //         setSelectedBehavioralLevel(clickedEmoji.behevioralLevel);
    //         setSelectedEmoji(clickedEmoji.url);
    //       }
    //     }
    //   }
    // });

    // Matter.Events.on(mouseConstraint, "mouseup", (event) => {
    //   const { body } = event.source;

    //   if (imageBodies.includes(body)) {
    //     const clickedEmoji = imageUrls.find(
    //       (emoji) => emoji.url === body.render.sprite.texture
    //     );
    //     if (clickedEmoji) {
    //       setIsEmojiClicked(true);
    //       setSelectedSkillLevel(clickedEmoji.skillLevel);
    //       setSelectedTechnicalLevel(clickedEmoji.technicalLevel);
    //       setSelectedBehavioralLevel(clickedEmoji.behevioralLevel);
    //       setSelectedEmoji(clickedEmoji.url);
    //     }
    //   }
    // });

    Matter.Events.on(mouseConstraint, "mouseup", (event) => {
      console.log("Mouseup event triggered", event); // Debugging
      console.log("Mouse position:", event.mouse.position); // Debugging
      console.log("Source body:", event.source.body); // Debugging

      const bodiesUnderMouse = Matter.Query.point(
        imageBodies,
        event.mouse.position
      );
      console.log("Bodies under mouse:", bodiesUnderMouse); // Debugging

      if (bodiesUnderMouse.length > 0) {
        const clickedBody = bodiesUnderMouse[0]; // Use the first body under the mouse
        const clickedEmoji = imageUrls.find(
          (emoji) => emoji.url === clickedBody.render.sprite.texture
        );
        if (clickedEmoji) {
          setIsEmojiClicked(true);
          setSelectedSkillLevel(clickedEmoji.skillLevel);
          setSelectedTechnicalLevel(clickedEmoji.technicalLevel);
          setSelectedBehavioralLevel(clickedEmoji.behevioralLevel); // Fixed typo: behevioralLevel -> behavioralLevel
          setSelectedEmoji(clickedEmoji.url);
        }
      }
      document.body.style.cursor = "default";
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const floatingInterval = setInterval(() => {
      imageBodies.forEach((body) => {
        Matter.Body.applyForce(body, body.position, {
          x: (Math.random() - 0.5) * emojiForce,
          y: (Math.random() - 0.5) * emojiForce,
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
  }, [isEmojiClicked, dimensions, topRightHeight]);

  // useEffect(() => {
  //   if (!dimensions.width || !dimensions.height) return;

  //   const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } = Matter;

  //   const engine = Engine.create();
  //   engineRef.current = engine;
  //   const { world } = engine;
  //   worldRef.current = world;

  //   engine.world.gravity.y = 0;
  //   engine.world.gravity.x = 0;

  //   const render = Render.create({
  //     element: sceneRef.current,
  //     engine: engine,
  //     options: {
  //       width: dimensions.width,
  //       height: dimensions.height,
  //       wireframes: false,
  //       background: "transparent",
  //     },
  //   });
  //   renderRef.current = render;

  //   const createImageCircle = (x, y) => {
  //     const emoji = imageUrls[Math.floor(Math.random() * imageUrls.length)];
  //     return Bodies.circle(x, y, 30, {
  //       restitution: 0.8,
  //       frictionAir: 0.05,
  //       render: {
  //         sprite: {
  //           texture: emoji.url,
  //           xScale: 0.18,
  //           yScale: 0.18,
  //         },
  //       },
  //     });
  //   };

  //   const imageBodies = [];
  //   const cornerWidth = 150;  // Top-left restricted area width
  //   const cornerHeight = 200; // Top-left restricted area height
  //   const bottomWidth = 280;  // Bottom-center restricted width
  //   const bottomHeight = 80; // Bottom-center restricted height

  //   for (let i = 0; i < emojiCount; i++) {
  //     let x, y;
  //     let isValidPosition = false;

  //     while (!isValidPosition) {
  //       x = Math.random() * dimensions.width;
  //       y = Math.random() * dimensions.height;

  //       // Check if position is inside the restricted areas
  //       const isInTopLeft = x < cornerWidth && y < cornerHeight;
  //       const isInBottomCenter = x > (dimensions.width / 2 - bottomWidth / 2) &&
  //                                x < (dimensions.width / 2 + bottomWidth / 2) &&
  //                                y > (dimensions.height - bottomHeight);

  //       if (!isInTopLeft && !isInBottomCenter) {
  //         isValidPosition = true;
  //       }
  //     }

  //     const body = createImageCircle(x, y);
  //     imageBodies.push(body);
  //   }

  //   imageBodiesRef.current = imageBodies;
  //   World.add(world, imageBodies);

  //   // Create a static boundary for the top-left corner
  //   const topLeftBoundary = Bodies.rectangle(
  //     cornerWidth / 2, cornerHeight / 2, cornerWidth, cornerHeight,
  //     { isStatic: true, render: { visible: false } }
  //   );

  //   // Create a static boundary for the bottom-center area
  //   const bottomCenterBoundary = Bodies.rectangle(
  //     dimensions.width / 2, dimensions.height - bottomHeight / 2,
  //     bottomWidth, bottomHeight,
  //     { isStatic: true, render: { visible: false } }
  //   );

  //   // Add both restricted areas to the world
  //   World.add(world, [topLeftBoundary, bottomCenterBoundary]);

  //   const mouse = Mouse.create(render.canvas);
  //   const mouseConstraint = MouseConstraint.create(engine, {
  //     mouse: mouse,
  //     constraint: { stiffness: 0.5, render: { visible: false } },
  //   });

  //   World.add(world, mouseConstraint);

  //   Matter.Events.on(mouseConstraint, "mousemove", (event) => {
  //     const mousePosition = event.mouse.position;
  //     const hoveredBodies = Matter.Query.point(imageBodies, mousePosition);
  //     document.body.style.cursor = hoveredBodies.length > 0 ? "pointer" : "default";
  //   });

  //   Matter.Events.on(mouseConstraint, "mousedown", (event) => {
  //     const { body } = event.source;
  //     if (imageBodies.includes(body)) {
  //       const clickedEmoji = imageUrls.find(emoji => emoji.url === body.render.sprite.texture);
  //       if (clickedEmoji) {
  //         setIsEmojiClicked(true);
  //         setSelectedSkillLevel(clickedEmoji.skillLevel);
  //         setSelectedTechnicalLevel(clickedEmoji.technicalLevel);
  //         setSelectedBehavioralLevel(clickedEmoji.behavioralLevel);
  //         setSelectedEmoji(clickedEmoji.url);
  //       }
  //     }
  //   });

  //   Render.run(render);
  //   const runner = Runner.create();
  //   Runner.run(runner, engine);

  //   const floatingInterval = setInterval(() => {
  //     imageBodies.forEach(body => {
  //       Matter.Body.applyForce(body, body.position, {
  //         x: (Math.random() - 0.5) * 0.004,
  //         y: (Math.random() - 0.5) * 0.004,
  //       });
  //     });
  //   }, 50);

  //   return () => {
  //     clearInterval(floatingInterval);
  //     Render.stop(render);
  //     World.clear(world, false);
  //     Engine.clear(engine);
  //     render.canvas.remove();
  //     render.canvas = null;
  //     render.context = null;
  //     render.textures = {};
  //   };
  // }, [isEmojiClicked, dimensions]);

  const changeBackgroundColor = () => {
    const { bgColor, buttonColor } = getRandomLightColor();
    setBgColor(bgColor);
    setButtonColor(buttonColor);
  };

  const handleSearchClick = () => {
    setIsEmojiClicked(false);
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
    }, 100);
  };

  const handleCloseRankWindow = () => {
    setShowResult(false);
    setAnimateRanking(false);
    setIsRankFinished(false);
    setLoading(false);
  };

  return (
    <div
      className="relative w-full h-full rounded-[10px]"
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
            <div className=" grid w-[90%] lg:w-[60%] z-50 grid-cols-3 gap-3 lg:ml-[10%]">
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
                      } absolute top-3 left-3 text-sm lg:text-xl font-semibold lg:font-bold`}
                    >
                      {index + 1}
                      <span className=" align-super -top-1 relative text-[12px] lg:text-sm">
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
                      className="mx-auto h-12 w-12 lg:h-14 lg:w-14 mt-4 !z-50"
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
                      <div className=" w-[48%]">
                        <span className="text-white text-[8px]">
                          Score 1: {emoji.technicalLevel}%
                        </span>
                        <div className=" h-3 lg:h-[14px] bg-gray-200 border border-white text-[6px] text-white text-center rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full pt-[2px]"
                            style={{
                              width: `${emoji.technicalLevel}%`,
                              background: `black`,
                            }}
                          >
                            {emoji.technicalLevel}%
                          </div>
                        </div>
                      </div>
                      <div className=" w-[48%]">
                        <span className="text-white text-[8px]">
                          Score 1: {emoji.behevioralLevel}%
                        </span>
                        <div className=" h-3 lg:h-[14px] bg-gray-200 border text-[6px] text-white text-center border-white rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full pt-[2px]"
                            style={{
                              width: `${emoji.behevioralLevel}%`,
                              background: `black`,
                            }}
                          >
                            {emoji.behevioralLevel}%
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className=" text-[8px] mt-2 lg:mt-2 text-white ">
                        Total score:{emoji.skillLevel}%
                      </div>
                      <div className="w-full h-3 lg:h-[14px] bg-gray-200 relative text-black font-extrabold text-[8px] text-center border border-white rounded-full mb-3 lg:mb-4 overflow-hidden">
                        <div
                          className="h-full rounded-full pt-[1px]"
                          style={{
                            width: `${emoji.skillLevel}%`,
                            background: `linear-gradient(to right, red, ${
                              emoji.skillLevel <= 25
                                ? "red"
                                : emoji.skillLevel <= 65
                                ? "orange, yellow"
                                : emoji.skillLevel <= 80
                                ? "orange, yellow, green"
                                : "orange, yellow, green, green"
                            })`,
                          }}
                        >
                          {emoji.skillLevel}%
                        </div>
                      </div>
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
            className=" w-[45%] lg:w-[40%] max-w-[200px] lg:max-w-[300px] bg-[#FFFFFF1A] border-2 border-white rounded-lg p-3 lg:p-5 flex flex-col items-center "
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
              className=" mx-auto w-16 h-16 lg:w-32 lg:h-32"
            />
            <div className=" w-full flex justify-between items-center">
              <div className=" w-[47%] lg:w-[48%] text-[10px] text-white">
                <div>Score 1: {selectedBehavioralLevel}%</div>
                <div className="  h-3 lg:h-[16px]  text-white text-[7px] text-center bg-gray-200 border border-white rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full pt-[4px]"
                    style={{
                      width: `${selectedBehavioralLevel}%`,
                      background: `black`,
                    }}
                  >
                    <span>{selectedBehavioralLevel}%</span>
                  </div>
                </div>
              </div>
              <div className=" w-[47%] lg:w-[48%] text-[10px] text-white">
                <div>Score 2: {selectedTechnicalLevel}%</div>
                <div className="  h-3 lg:h-[16px]  text-white text-[7px] text-center bg-gray-200 border border-white rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full pt-[4px]"
                    style={{
                      width: `${selectedTechnicalLevel}%`,
                      background: `black`,
                    }}
                  >
                    <span>{selectedTechnicalLevel}%</span>
                  </div>
                </div>
              </div>
              {/* <div className="  h-3 lg:h-[16px] text-white text-[7px] text-center bg-gray-200 border border-white rounded-full mt-3 lg:mt-4 overflow-hidden">
                <div
                  className="h-full rounded-full pt-[4px]"
                  style={{
                    width: `${selectedTechnicalLevel}%`,
                    background: `black`,
                  }}
                >
                  <span>{selectedTechnicalLevel}%</span>
                </div>
              </div> */}
            </div>
            <div className=" w-full mt-3 lg:mt-4">
              <div className=" text-[10px] text-white">
                Total score: {selectedSkillLevel}%
              </div>
              <div className="w-full h-3 mt-1 lg:h-[14px] bg-gray-200 border text-black font-extrabold relative text-[8px] text-center border-white rounded-full mb-3 lg:mb-5 overflow-hidden">
                <div
                  className={`h-full rounded-full pt-[2px]`}
                  style={{
                    width: `${selectedSkillLevel}%`,
                    background: `linear-gradient(to right, red, ${
                      selectedSkillLevel <= 25
                        ? "red"
                        : selectedSkillLevel <= 65
                        ? "orange, yellow"
                        : selectedSkillLevel <= 80
                        ? "orange, yellow, green"
                        : "orange, yellow, green, green"
                    })`,
                  }}
                >
                  {selectedSkillLevel}%
                </div>
                {/* <div className=" absolute top-[2px] left-1/2 -translate-x-1/2 ">
                {selectedSkillLevel}%
              </div> */}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="absolute top-1 right-1 lg:top-3 lg:right-3 flex flex-col justify-start items-center">
        <button
          onClick={changeBackgroundColor}
          className="p-3 rounded-full shadow-lg hover:bg-gray-100 transition"
          style={{ backgroundColor: buttonColor }}
        >
          <LuPaintbrush size={22} color="#FFFFFF" />
        </button>
        {!animateRanking && (
          <button
            onClick={handleSearchClick}
            className=" block lg:hidden p-3 rounded-full shadow-lg mt-1 hover:bg-gray-100 transition"
            style={{ backgroundColor: buttonColor }}
          >
            {loading ? (
              <LoaderCircle className="animate-spin text-white" />
            ) : (
              <PiRankingBold size={22} color="#FFFFFF" />
            )}
          </button>
        )}
      </div>

      {!(isEmojiClicked || showResult) && (
        <div className="absolute bottom-2 lg:bottom-4 left-1/2 transform -translate-x-1/2 w-fit">
          <motion.button
            onClick={handleButtonClick}
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: isAnimatingButton ? 0.1 : 1,
              scale: isAnimatingButton ? 0.9 : 1,
            }}
            transition={{ duration: 0.001, ease: "easeInOut" }}
            className={` h-11 lg:h-14 px-5 lg:px-10 mx-auto rounded-full cursor-pointer text-base lg:text-xl font-semibold shadow-lg border-4 border-black transition-all ${
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
        className="absolute bg-white top-1 left-1 lg:top-3 lg:left-3 p-1 lg:p-2 flex flex-row lg:flex-col justify-center items-center rounded-md lg:rounded-lg"
        // style={{ backgroundColor: buttonColor }}
      >
        <div className=" lg:mb-1 relative h-8 lg:h-10 flex justify-center items-center">
          <div className="rounded-full z-50 absolute top-0 left-0 font-semibold lg:font-extrabold bg-[#FBC225] border-2 lg:border-[3px] border-black text-black text-center text-sm lg:text-lg flex justify-center items-center h-full aspect-square">
            1
            <span className=" align-super -top-1 relative text-[8px] lg:text-xs">
              st
            </span>
          </div>
          <div className=" mx-2 pl-8 flex flex-row justify-center h-7 lg:h-9 w-[70px] lg:w-[100px] bg-white items-center border-2 lg:border-[3px] border-black lg:rounded-lg rounded-sm">
            {firstPlace !== "?" ? (
              <img
                ref={firstPlaceDivRef}
                src={firstPlace}
                alt="First Place"
                className="lg:w-14 lg:h-14 h-12 w-12 absolute -top-2 right-2 lg:right-6"
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
        <div className=" lg:mb-1 relative h-8 lg:h-10 flex justify-center items-center">
          <div className="rounded-full z-50 absolute top-0 left-0 font-semibold lg:font-extrabold bg-[#A6A6A6] border-2 lg:border-[3px] border-black text-black text-center text-sm lg:text-lg flex justify-center items-center h-full aspect-square">
            2
            <span className=" align-super -top-1 relative text-[8px] lg:text-xs">
              nd
            </span>
          </div>
          <div className=" mx-2 pl-8 flex flex-row justify-center h-7 lg:h-9 w-[70px] lg:w-[100px] bg-white items-center border-2 lg:border-[3px] border-black lg:rounded-lg rounded-sm">
            {secondPlace !== "?" ? (
              <img
                ref={secondPlaceDivRef}
                src={secondPlace}
                alt="First Place"
                className="lg:w-14 lg:h-14 h-12 w-12 absolute -top-2 right-2 lg:right-6"
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
        <div className=" lg:mb-1 relative h-8 lg:h-10 flex justify-center items-center">
          <div className="rounded-full z-50 absolute top-0 left-0 font-semibold lg:font-extrabold bg-[#BC712F] border-2 lg:border-[3px] border-black text-black text-center text-sm lg:text-lg flex justify-center items-center h-full aspect-square">
            3
            <span className=" align-super -top-1 relative text-[8px] lg:text-xs">
              rd
            </span>
          </div>
          <div className=" ml-2 mr-1 lg:mx-2 pl-8 flex flex-row justify-center h-7 lg:h-9 w-[70px] lg:w-[100px] bg-white items-center border-2 lg:border-[3px] border-black lg:rounded-lg rounded-sm">
            {thirdPlace !== "?" ? (
              <img
                ref={thridPlaceDivRef}
                src={thirdPlace}
                alt="First Place"
                className="lg:w-14 lg:h-14 h-12 w-12 absolute -top-2 right-2 lg:right-6"
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
            className=" hidden bg-black rounded-lg font-semibold text-white text-center text-sm w-[105px] cursor-pointer h-9 lg:flex justify-center items-center"
          >
            {loading ? <LoaderCircle className="animate-spin" /> : "Rank"}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatterCircleStack;
