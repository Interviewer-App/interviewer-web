"use client";
import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { LuPaintbrush } from "react-icons/lu";
import { PiHandPointing, PiRankingBold } from "react-icons/pi";
import {
  imageUrls,
  musicEmoji,
  designerEmoji,
  accountantEmoji,
  developerEmoji,
} from "@/constants";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { FaArrowRight } from "react-icons/fa";
import { set } from "zod";
import { width } from "@mui/system";

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
  const [isAnimatingButton, setIsAnimatingButton] = useState(false);
  const [emojiArray, setEmojiArray] = useState(developerEmoji);
  const [glowingEffect, setGlowingEffect] = useState(false);
  // const [dragPosition, setDragPosition] = useState(null);
  const buttons = [
    {
      Category: "programmer",
      text: "<Programmer>",
      bgColor: "bg-black",
      textColor: "text-white",
      font: "font-kode_mono",
    },
    {
      category: "accountant",
      text: "Accountant",
      bgColor: "bg-[#4666F6]",
      textColor: "text-white",
      font: "font-jakarta",
    },
    {
      category: "designer",
      text: "Designer",
      bgColor: "bg-[#F6B546]",
      textColor: "text-black",
      font: "font-pacifico",
    },
    {
      category: "musician",
      text: "Musician",
      bgColor: "bg-[#C10505]",
      textColor: "text-white",
      font: "font-playfair",
    },
  ];
  const [currentButton, setCurrentButton] = useState(buttons[0].category);

  useEffect(() => {
    if (currentButton === "programmer") {
      setEmojiArray(developerEmoji);
    } else if (currentButton === "accountant") {
      setEmojiArray(accountantEmoji);
    } else if (currentButton === "designer") {
      setEmojiArray(designerEmoji);
    } else if (currentButton === "musician") {
      setEmojiArray(musicEmoji);
    }
  }, [currentButton]);

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
        window.innerWidth > 1024 ? 40 : window.innerWidth > 768 ? 40 : 25;
      const emojiScale = window.innerWidth > 1024 ? 0.13 : 0.13;
      const emojiOralScale = window.innerWidth > 1024 ? 35 : 25;
      const emojiForce = window.innerWidth > 1024 ? 0.01 : 0.003;
      setEmojiCount(emojiCount);
      setEmojiScale(emojiScale);
      setEmojiOralScale(emojiOralScale);
      setEmojiForce(emojiForce);

      const cornerWidth = window.innerWidth > 1024 ? 150 : 250;
      const cornerHeight = window.innerWidth > 1024 ? 200 : 50;
      // const bottomWidth = window.innerWidth > 1024 ? 260 : 150;
      // const bottomHeight = window.innerWidth > 1024 ? 80 : 50;
      const topRightWidth = window.innerWidth > 1024 ? 70 : 50;
      const topRightHeight = window.innerWidth > 1024 ? 70 : 100;
      // const cornerWidth = window.innerWidth > 1024 ? 70 : 50;
      // const cornerHeight = window.innerWidth > 1024 ? 70 : 100;
      const bottomWidth = window.innerWidth > 1024 ? 150 : 160;
      const bottomHeight = window.innerWidth > 1024 ? 110 : 100;
      // const topRightWidth = window.innerWidth > 1024 ? 150 : 300;
      // const topRightHeight = window.innerWidth > 1024 ? 200 : 50;

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
      const emoji = emojiArray[Math.floor(Math.random() * emojiArray.length)];
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
          // x > dimensions.width / 2 - bottomWidth / 2 &&
          // x < dimensions.width / 2 + bottomWidth / 2 &&
          // y > dimensions.height - bottomHeight;
          // x < cornerWidth && y < dimensions.height /2 - cornerHeight/2;
          x < cornerWidth && y > dimensions.height - bottomHeight / 2;

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
      0 + bottomWidth / 2,
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
        document.getElementById("matter-circle-stack").style.cursor = "pointer";
      } else {
        document.getElementById("matter-circle-stack").style.cursor = "default";
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
    //       const clickedEmoji = emojiArray.find(
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
    //     const clickedEmoji = emojiArray.find(
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
      // console.log("Mouseup event triggered", event); // Debugging
      // console.log("Mouse position:", event.mouse.position); // Debugging
      // console.log("Source body:", event.source.body); // Debugging

      const bodiesUnderMouse = Matter.Query.point(
        imageBodies,
        event.mouse.position
      );
      // console.log("Bodies under mouse:", bodiesUnderMouse); // Debugging

      if (bodiesUnderMouse.length > 0) {
        const clickedBody = bodiesUnderMouse[0]; // Use the first body under the mouse
        const clickedEmoji = emojiArray.find(
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
      document.getElementById("matter-circle-stack").style.cursor = "default";
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
  }, [
    isEmojiClicked,
    dimensions,
    topRightHeight,
    showResult,
    emojiArray,
    currentButton,
  ]);

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
  //     const emoji = emojiArray[Math.floor(Math.random() * emojiArray.length)];
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
  //       const clickedEmoji = emojiArray.find(emoji => emoji.url === body.render.sprite.texture);
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
      const randomIndex = Math.floor(Math.random() * emojiArray.length);
      const selectedEmoji = emojiArray[randomIndex];
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
      setLoading(false);
      setIsRankFinished(true);
    }, 2000);

    setTimeout(() => {
      setGlowingEffect(true);
    }, 3000);

    // setTimeout(() => {
    //   setAnimateRanking(true);
    // }, 3000);

    // setTimeout(() => {
    //   setFirstPlace(sortEmolis[0].url);
    //   setSecondPlace(sortEmolis[1].url);
    //   setThirdPlace(sortEmolis[2].url);
    // }, 4300);

    // setTimeout(() => {
    //   setIsRankFinished(true);
    // }, 5000);
  };

  const handleButtonClick = () => {
    setIsAnimatingButton(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % buttons.length);
      setCurrentButton(buttons[currentIndex].category);
      setIsAnimatingButton(false);
    }, 100);
  };

  const handleCloseRankWindow = () => {
    // setTimeout(() => {
    setAnimateRanking(true);
    // }, 3000);

    setTimeout(() => {
      setFirstPlace(selectedImage[0].url);
      setSecondPlace(selectedImage[1].url);
      setThirdPlace(selectedImage[2].url);
    }, 1500);

    setTimeout(() => {
      setShowResult(false);
      setAnimateRanking(false);
      // setIsRankFinished(false);
      // setLoading(false);
    }, 2000);
  };

  return (
    <div
      className="relative w-full h-full min-h-[480px] lg:min-h-[418px] rounded-xl"
      id="matter-circle-stack"
      ref={containerRef}
      style={{ backgroundColor: bgColor }}
    >
      <div ref={sceneRef} className="absolute inset-0" />
      {showResult && (
        <div
          // onClick={handleCloseRankWindow}
          className="absolute top-0 h-full w-full bg-black rounded-xl flex flex-col justify-center items-center !z-20"
        >
          <div
            onClick={handleCloseRankWindow}
            className=" bg-white h-8 aspect-square cursor-pointer rounded-full flex justify-center items-center absolute left-4 bottom-4"
          >
            <FaArrowRight size={15} color="#000000" />
          </div>

          {!analizing ? (
            <div className=" grid w-[90%] lg:w-[60%] grid-cols-3 gap-3 lg:ml-[10%]">
              {selectedImage.map((emoji, index) => (
                <motion.div
                  key={index}
                  className=" w-full "
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
                    className=" relative w-full bg-[#ffffff] border-2 border-white rounded-lg p-3 flex flex-col items-center"
                    animate={{
                      filter:
                        isRankFinished && index == 0
                          ? [
                              "drop-shadow(0px 0px 0px #E4AF1E)",
                              "drop-shadow(0px 0px 10px #E4AF1E)",
                              "drop-shadow(0px 0px 20px #E4AF1E)",
                              "drop-shadow(0px 0px 0px #E4AF1E)",
                            ]
                          : isRankFinished && index == 1
                          ? [
                              "drop-shadow(0px 0px 0px #C1C1C1)",
                              "drop-shadow(0px 0px 10px #C1C1C1)",
                              "drop-shadow(0px 0px 20px #C1C1C1)",
                              "drop-shadow(0px 0px 0px #C1C1C1)",
                            ]
                          : isRankFinished && index == 2
                          ? [
                              "drop-shadow(0px 0px 0px #DA875B)",
                              "drop-shadow(0px 0px 10px #DA875B)",
                              "drop-shadow(0px 0px 20px #DA875B)",
                              "drop-shadow(0px 0px 0px #DA875B)",
                            ]
                          : "none",
                    }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                  >
                    <motion.div
                      className={` ${
                        (index < 3 ? "block" : "hidden",
                        index == 0
                          ? "bg-[#E4AF1E]"
                          : index == 1
                          ? "bg-[#C1C1C1]"
                          : index == 2
                          ? "bg-[#DA875B]"
                          : "bg-transparent")
                      } absolute top-0 w-full h-full rounded-lg`}
                      animate={{
                        scale:
                          isRankFinished && index < 3 ? [1, 1.2, 0.5, 0] : 0,
                        opacity:
                          isRankFinished && index < 3 ? [0.1, 0.2, 0.1, 0] : 0,
                        filter:
                          isRankFinished && index == 0
                            ? [
                                "drop-shadow(0px 0px 100px #E4AF1E)",
                                "drop-shadow(0px 0px 100px #E4AF1E)",
                                "drop-shadow(0px 0px 200px #E4AF1E)",
                                "drop-shadow(0px 0px 0px #E4AF1E)",
                              ]
                            : isRankFinished && index == 1
                            ? [
                                "drop-shadow(0px 0px 0px #C1C1C1)",
                                "drop-shadow(0px 0px 100px #C1C1C1)",
                                "drop-shadow(0px 0px 200px #C1C1C1)",
                                "drop-shadow(0px 0px 0px #C1C1C1)",
                              ]
                            : isRankFinished && index == 2
                            ? [
                                "drop-shadow(0px 0px 0px #DA875B)",
                                "drop-shadow(0px 0px 100px #DA875B)",
                                "drop-shadow(0px 0px 200px #DA875B)",
                                "drop-shadow(0px 0px 0px #DA875B)",
                              ]
                            : "none",

                        // opacity: isRankFinished && index < 3 ? [1, 1, 0.9, 0] : 1,
                        // display:
                        //   isRankFinished && index < 3
                        //     ? ["block", "block", "block", "none"]
                        //     : "block",
                      }}
                      transition={{
                        duration: 3.5,
                        ease: "easeInOut",
                      }}
                    ></motion.div>
                    <div
                      className={` ${
                        index === 0
                          ? " bg-[#E4AF1E]"
                          : index === 1
                          ? "bg-[#C1C1C1]"
                          : index === 2
                          ? "bg-[#DA875B]"
                          : " text-black"
                      } absolute top-3 left-3 text-sm h-7 flex justify-center items-center aspect-square text-[8px] lg:text-[10px] font-semibold lg:font-bold bg-white rounded-full border-2 border-black`}
                    >
                      {index + 1}
                      <span className="text-[8px] lg:text-[10px]">
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
                      className=" mx-auto h-12 w-12 lg:h-14 lg:w-14 -mt-3 -mr-4"
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

                    <div className="space-y-1">
                      <div className=" w-full">
                        <div className="flex justify-between">
                          <span className="text-black text-[8px] font-semibold">
                            Technical
                          </span>
                          <span className="text-black text-[8px] font-semibold">
                            {emoji.technicalLevel}/100
                          </span>
                        </div>
                        <div className=" h-2 lg:h-[8px] bg-[#C2C2C2] border border-white text-[6px] text-white text-center rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full pt-[2px]"
                            style={{
                              width: `${emoji.technicalLevel}%`,
                              background: `black`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className=" w-full pb-2">
                        <div className="flex justify-between">
                          <span className="text-black text-[8px] font-semibold">
                            Behevioral
                          </span>
                          <span className="text-black text-[8px] font-semibold">
                            {emoji.behevioralLevel}/100
                          </span>
                        </div>
                        <div className=" h-2 lg:h-[8px] bg-[#C2C2C2] border text-[6px] text-white text-center border-white rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full pt-[2px]"
                            style={{
                              width: `${emoji.behevioralLevel}%`,
                              background: `black`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-[#C2C2C2] rounded-md p-2">
                        <div className="flex justify-between">
                          <span className="text-black text-[8px] font-semibold">
                            Overall Score
                          </span>
                          <span className="text-black text-[8px] font-semibold">
                            {emoji.skillLevel}/100
                          </span>
                        </div>
                        <div
                          style={{
                            background: `linear-gradient(to right, red, orange, yellow, green`,
                          }}
                          className="w-full h-2 lg:h-[7px] bg-gray-200 relative text-black font-extrabold text-[8px] text-center border border-black rounded-full overflow-hidden "
                        >
                          <div
                            className="h-full pt-[1px]"
                            // style={{
                            //   width: `${emoji.skillLevel}%`,
                            //   background: `linear-gradient(to right, red, ${
                            //     emoji.skillLevel <= 25
                            //       ? "red"
                            //       : emoji.skillLevel <= 65
                            //       ? "orange, yellow"
                            //       : emoji.skillLevel <= 80
                            //       ? "orange, yellow, green"
                            //       : "orange, yellow, green, green"
                            //   })`,
                            // }}
                            style={{
                              width: `${100 - emoji.skillLevel}%`,
                              backgroundColor: "#030303",
                              position: "absolute",
                              top: 0,
                              right: 0,
                              height: "100%",
                              transition: "width 0.5s ease-in-out",
                            }}
                          ></div>
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
          className="absolute top-0 h-full w-full bg-black rounded-xl text-8xl flex flex-col justify-center items-center"
        >
          <motion.div
            className=" w-[45%] lg:w-[40%] max-w-[200px] text-black min-w-[200px] lg:min-w-[250px] lg:max-w-[300px] bg-[#FFFFFF] border-2 border-white rounded-lg p-3 lg:p-5 flex flex-col items-center "
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
              className=" mx-auto w-16 h-16 lg:w-28 lg:h-28"
            />
            <div className=" w-full flex flex-col gap-3 justify-between items-center">
              <div className=" w-full text-[10px] lg:text-[12px] font-bold ">
                <div className=" w-full flex justify-between items-center">
                  <div>Soft skills</div>
                  <div>{selectedTechnicalLevel}/100</div>
                </div>
                <div className="  h-[8px] lg:h-[10px] text-white text-[7px] text-center bg-gray-200 border border-white rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${selectedTechnicalLevel}%`,
                      background: `black`,
                    }}
                  ></div>
                </div>
              </div>
              <div className=" w-full text-[10px] lg:text-[12px] font-bold text-black">
                <div className=" w-full flex justify-between items-center">
                  <div>Technical skills</div>
                  <div>{selectedBehavioralLevel}/100</div>
                </div>

                <div className="  h-[8px] lg:h-[10px] text-white text-[7px] text-center bg-gray-200 border border-white rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${selectedBehavioralLevel}%`,
                      background: `black`,
                    }}
                  ></div>
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
            <div className=" w-full mt-3 lg:mt-4 bg-[#E1E1E1] p-2 rounded-lg py-3">
              <div className=" w-full flex justify-between items-center text-[10px] lg:text-[12px] font-bold">
                <div>Overall score</div>
                <div>{selectedSkillLevel}/100</div>
              </div>
              <div
                style={{
                  background: `linear-gradient(to right, red, orange, yellow, green`,
                }}
                className="w-full h-[8px] mt-1 lg:h-[10px] bg-gray-200 border text-black font-extrabold relative text-[8px] text-center border-black rounded-full overflow-hidden"
              >
                <div
                  style={{
                    width: `${100 - selectedSkillLevel}%`,
                    backgroundColor: "#030303",
                    position: "absolute",
                    top: 0,
                    right: 0,
                    height: "100%",
                    transition: "width 0.5s ease-in-out",
                  }}
                  className={`h-full rounde pt-[2px]`}
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
          <PiHandPointing size={22} color="#FFFFFF" />
          {/* <LuPaintbrush size={22} color="#FFFFFF" /> */}
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
        <div className="absolute bottom-2 lg:bottom-3 left-3 transform flex flex-col justify-center items-center px-3 pb-3 bg-[#E7E5E5] rounded-lg">
          <h1 className=" text-xs font-semibold relative text-center my-2 w-full">
            Change Field
          </h1>
          <motion.button
            onClick={handleButtonClick}
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: isAnimatingButton ? 0.1 : 1,
              scale: isAnimatingButton ? 0.9 : 1,
            }}
            transition={{ duration: 0.001, ease: "easeInOut" }}
            className={` h-9 rounded-full cursor-pointer w-[110px] text-xs px-1  font-semibold shadow-lg border-[3px] border-black transition-all ${
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
        className="absolute top-1 left-1 lg:top-3 lg:left-3 p-1 lg:p-2 flex flex-row lg:flex-col justify-center items-center rounded-md lg:rounded-lg !z-20"
        // style={{ backgroundColor: buttonColor }}
      >
        <div className=" lg:mb-[2px] relative h-8 lg:h-10 flex justify-center items-center">
          {/* <div className="rounded-full z-50 absolute top-0 left-0 font-semibold lg:font-extrabold bg-[#FBC225] border-2 lg:border-[3px] border-black text-black text-center text-sm lg:text-lg flex justify-center items-center h-full aspect-square">
            1
            <span className=" align-super -top-1 relative text-[8px] lg:text-xs">
              st
            </span>
          </div> */}
          <div className=" mx-2 flex flex-row justify-start h-7 lg:h-9 w-[70px] lg:w-[110px] bg-[#EAEAEA] border-2 border-[#EAEAEA] items-center rounded-full gap-3">
            <div className="rounded-full z-50 font-semibold lg:font-extrabold bg-[#FBC225] border-2 lg:border-[3px] border-black text-black text-center text-sm lg:text-base flex justify-center items-center h-full aspect-square">
              1<span className=" text-[8px] lg:text-[12px]">st</span>
            </div>
            {firstPlace !== "?" ? (
              <img
                ref={firstPlaceDivRef}
                src={firstPlace}
                alt="First Place"
                className="lg:w-12 lg:h-12 h-12 w-12 absolute -top-2 right-1 lg:right-6"
              />
            ) : (
              <div
                ref={firstPlaceDivRef}
                className="w-[28px] mr-5 pr-3 lg:pr-0 text-black text-center text-base flex justify-center items-center font-semibold h-7 aspect-square"
              >
                ?
              </div>
            )}
          </div>
        </div>
        <div className=" lg:mb-[2px] relative h-8 lg:h-10 flex justify-center items-center">
          {/* <div className="rounded-full z-50 absolute top-0 left-0 font-semibold lg:font-extrabold bg-[#A6A6A6] border-2 lg:border-[3px] border-black text-black text-center text-sm lg:text-lg flex justify-center items-center h-full aspect-square">
            2
            <span className=" align-super -top-1 relative text-[8px] lg:text-xs">
              nd
            </span>
          </div> */}
          <div className=" mx-2 flex flex-row justify-start gap-3 h-7 lg:h-9 w-[70px] lg:w-[110px] bg-[#EAEAEA] border-2 border-[#EAEAEA] items-center rounded-full">
            <div className="rounded-full z-50 font-semibold lg:font-extrabold bg-[#A6A6A6] border-2 lg:border-[3px] border-black text-black text-center text-sm lg:text-base flex justify-center items-center h-full aspect-square">
              2<span className="text-[8px] lg:text-[12px]">nd</span>
            </div>
            {secondPlace !== "?" ? (
              <img
                ref={secondPlaceDivRef}
                src={secondPlace}
                alt="First Place"
                className="lg:w-12 lg:h-12 h-12 w-12 absolute -top-2 right-1 lg:right-6"
              />
            ) : (
              <div
                ref={secondPlaceDivRef}
                className="w-[28px] mr-0 pr-3 lg:pr-0 text-black text-center text-base flex justify-center items-center font-semibold h-7 aspect-square"
              >
                ?
              </div>
            )}
          </div>
        </div>
        <div className=" lg:mb-[4px] relative h-8 lg:h-10 flex justify-center items-center">
          {/* <div className="rounded-full z-50 absolute top-0 left-0 font-semibold lg:font-extrabold bg-[#BC712F] border-2 lg:border-[3px] border-black text-black text-center text-sm lg:text-lg flex justify-center items-center h-full aspect-square">
            3
            <span className=" align-super -top-1 relative text-[8px] lg:text-xs">
              rd
            </span>
          </div> */}
          <div className="flex flex-row justify-start gap-3 h-7 lg:h-9 w-[70px] lg:w-[110px] bg-[#EAEAEA] border-2 border-[#EAEAEA] items-center rounded-full">
            <div className="rounded-full z-50 font-semibold lg:font-extrabold bg-[#BC712F] border-2 lg:border-[3px] border-black text-black text-center text-sm lg:text-base flex justify-center items-center h-full aspect-square">
              3<span className=" text-[8px] lg:text-[12px]">rd</span>
            </div>
            {thirdPlace !== "?" ? (
              <img
                ref={thridPlaceDivRef}
                src={thirdPlace}
                alt="First Place"
                className="lg:w-12 lg:h-12 h-12 w-12 absolute -top-2 right-1 lg:right-4"
              />
            ) : (
              <div
                ref={thridPlaceDivRef}
                className="w-[28px] mr-5 pr-3 lg:pr-0 text-black text-center text-base flex justify-center items-center font-semibold h-7 aspect-square"
              >
                ?
              </div>
            )}
          </div>
        </div>
        {!animateRanking && (
          <div
            onClick={handleSearchClick}
            className={` hidden ${
              showResult || isEmojiClicked ? " bg-[#EAEAEA] text-black" : "bg-black text-white"
            } rounded-full font-semibold text-center text-xs w-[105px] cursor-pointer h-9 lg:flex justify-center items-center`}
          >
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Rank talents"
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatterCircleStack;
