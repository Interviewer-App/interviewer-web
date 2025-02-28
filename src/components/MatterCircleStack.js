"use client";
import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { LuPaintbrush } from "react-icons/lu";

const imageUrls = [
  "/icons/emoji1.png",
  "/icons/emoji2.png",
  "/icons/emoji3.png",
  "/icons/emoji4.png",
  "/icons/emoji5.png",
  "/icons/emoji6.png",
  "/icons/emoji7.png",
  "/icons/emoji8.png",
  "/icons/emoji9.png",
  "/icons/emoji10.png",
  "/icons/emoji11.png",
  "/icons/emoji12.png",
  "/icons/emoji13.png",
  "/icons/emoji14.png",
  "/icons/emoji15.png",
  "/icons/emoji16.png",
  "/icons/emoji17.png",
  "/icons/emoji18.png",
  "/icons/emoji19.png",
  "/icons/emoji20.png",
  "/icons/emoji21.png",
  "/icons/emoji22.png",
  "/icons/emoji23.png",
  "/icons/emoji24.png",
  "/icons/emoji25.png",
  "/icons/emoji26.png",
  "/icons/emoji27.png",
  "/icons/emoji28.png",
  "/icons/emoji29.png",
  "/icons/emoji30.png",
  "/icons/emoji31.png",
  "/icons/emoji32.png",
  "/icons/emoji33.png",
  "/icons/emoji34.png",
  "/icons/emoji35.png",
  "/icons/emoji36.png",
  "/icons/emoji37.png",
  "/icons/emoji38.png",
  "/icons/emoji39.png",
  "/icons/emoji40.png",
  "/icons/emoji41.png",
  "/icons/emoji42.png",
  "/icons/emoji43.png",
  "/icons/emoji44.png",
];

// Move getRandomLightColor outside the component
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
  const [clickCount, setClickCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [buttonColor, setButtonColor] = useState("#FFFFFF");
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const engineRef = useRef(null);
  const worldRef = useRef(null);
  const renderRef = useRef(null);
  const imageBodiesRef = useRef([]);
  const shuffleIntervalRef = useRef(null);

  // Update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        
        // Update renderer if it exists
        if (renderRef.current) {
          Matter.Render.setPixelRatio(renderRef.current, window.devicePixelRatio);
          Matter.Render.setSize(renderRef.current, width, height);
          
          // Update boundary walls
          if (worldRef.current) {
            // Remove old walls
            const bodies = Matter.Composite.allBodies(worldRef.current);
            const walls = bodies.filter(body => body.isStatic);
            Matter.World.remove(worldRef.current, walls);
            
            // Add new walls
            const ground = Matter.Bodies.rectangle(width / 2, height + 50, width * 2, 100, {
              isStatic: true,
              render: { visible: false },
            });
            const leftWall = Matter.Bodies.rectangle(-50, height / 2, 100, height * 2, {
              isStatic: true,
              render: { visible: false },
            });
            const rightWall = Matter.Bodies.rectangle(width + 50, height / 2, 100, height * 2, {
              isStatic: true,
              render: { visible: false },
            });
            const topWall = Matter.Bodies.rectangle(width / 2, -50, width * 2, 100, {
              isStatic: true,
              render: { visible: false },
            });
            
            Matter.World.add(worldRef.current, [ground, leftWall, rightWall, topWall]);
          }
        }
      }
    };

    const handleResize = () => {
      updateDimensions();
    };

    window.addEventListener('resize', handleResize);
    // Initial setup
    updateDimensions();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const { bgColor, buttonColor } = getRandomLightColor();
    setBgColor(bgColor);
    setButtonColor(buttonColor);
  }, []);

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;

    const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } = Matter;

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
        pixelRatio: window.devicePixelRatio
      },
    });
    renderRef.current = render;

    const createImageCircle = (x, y) => {
      const imageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
      return Bodies.circle(x, y, 15, {
        restitution: 0.8,
        frictionAir: 0.05,
        render: {
          sprite: {
            texture: imageUrl,
            xScale: 0.15,
            yScale: 0.15,
          },
        },
      });
    };

    // Create random positioned image circles - adjusted for screen size
    const imageBodies = [];
    const particleCount = Math.min(Math.max(30, Math.floor((dimensions.width * dimensions.height) / 4800)), 150);
    
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * dimensions.width;
      const y = Math.random() * dimensions.height;
      imageBodies.push(createImageCircle(x, y));
    }

    imageBodiesRef.current = imageBodies;
    World.add(world, imageBodies);

    // Create boundary walls
    const ground = Bodies.rectangle(dimensions.width / 2, dimensions.height + 50, dimensions.width * 2, 100, {
      isStatic: true,
      render: { visible: false },
    });
    const leftWall = Bodies.rectangle(-50, dimensions.height / 2, 100, dimensions.height * 2, {
      isStatic: true,
      render: { visible: false },
    });
    const rightWall = Bodies.rectangle(dimensions.width + 50, dimensions.height / 2, 100, dimensions.height * 2, {
      isStatic: true,
      render: { visible: false },
    });
    const topWall = Bodies.rectangle(dimensions.width / 2, -50, dimensions.width * 2, 100, {
      isStatic: true,
      render: { visible: false },
    });

    World.add(world, [ground, leftWall, rightWall, topWall]);

    // Mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });

    World.add(world, mouseConstraint);

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const floatingInterval = setInterval(() => {
      imageBodies.forEach((body) => {
        Matter.Body.applyForce(body, body.position, {
          x: (Math.random() - 0.5) * 0.00013,
          y: (Math.random() - 0.5) * 0.00013,
        });
      });
    }, 50);

    return () => {
      clearInterval(floatingInterval);
      if (shuffleIntervalRef.current) {
        clearInterval(shuffleIntervalRef.current);
      }
      Render.stop(render);
      World.clear(world, false);
      Engine.clear(engine);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
      renderRef.current = null;
    };
  }, [dimensions]);

  const changeBackgroundColor = () => {
    const { bgColor, buttonColor } = getRandomLightColor();
    setBgColor(bgColor);
    setButtonColor(buttonColor);
  };

  const handleSearchClick = () => {
    if (!imageBodiesRef.current || imageBodiesRef.current.length === 0) return;

    // Apply random forces for continuous shuffling
    shuffleIntervalRef.current = setInterval(() => {
      imageBodiesRef.current.forEach((body) => {
        Matter.Body.applyForce(body, body.position, {
          x: (Math.random() - 0.5) * 0.2,
          y: (Math.random() - 0.5) * 0.2,
        });
      });
    }, 100);

    // Stop shuffling after 3 seconds
    setTimeout(() => {
      clearInterval(shuffleIntervalRef.current);
      const newImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
      setSelectedImage(newImageUrl);
      setShowResult(true);

      setClickCount((prev) => {
        if (prev % 3 === 0) {
          setFirstPlace(newImageUrl);
        } else if (prev % 3 === 1) {
          setSecondPlace(newImageUrl);
        } else {
          setThirdPlace(newImageUrl);
        }
        return prev + 1;
      });
    }, 3000);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full" 
      style={{ backgroundColor: bgColor }}
    >
      <div ref={sceneRef} className="absolute inset-0" />
      
      {showResult && (
        <div className="absolute inset-0 bg-black/90 text-8xl flex flex-col justify-center items-center">
          <img
            src={selectedImage}
            alt="Selected Image"
            className="drop-shadow-[0_0_80px_rgba(255,215,0,0.8)] w-32 h-32"
          />
          <button
            onClick={() => setShowResult(false)}
            className="hover:bg-white text-white hover:text-black hover:border-black text-sm border-2 border-white rounded-lg px-4 py-1 mt-5"
          >
            Continue
          </button>
        </div>
      )}

      <button
        onClick={changeBackgroundColor}
        className="p-3 absolute top-5 right-5 rounded-full shadow-lg hover:bg-gray-100 transition"
        style={{ backgroundColor: buttonColor }}
      >
        <LuPaintbrush size={24} color="#FFFFFF" />
      </button>
      
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
        <button
          onClick={handleSearchClick}
          className="py-3 px-10 bg-black text-white rounded-full shadow-lg hover:bg-gray-900 transition"
        >
          Examine
        </button>
      </div>

      <div className="absolute top-5 left-5">
        <div className="mb-1 flex flex-row justify-start bg-white gap-5 items-center border-2 border-black rounded-full">
          <div className="rounded-full bg-amber-500 text-black text-center text-base flex justify-center items-center font-semibold h-7 aspect-square">
            1
          </div>
          {firstPlace !== "?" ? (
            <img
              src={firstPlace}
              alt="First Place"
              className="w-[28px] h-[28px] object-cover rounded-full"
            />
          ) : (
            <div className="w-[28px] mr-5 text-black text-center text-base flex justify-center items-center font-semibold h-7 aspect-square">
              ?
            </div>
          )}
        </div>
        <div className="mb-1 flex flex-row justify-start bg-white gap-5 items-center border-2 border-black rounded-full">
          <div className="rounded-full bg-gray-400 text-black text-center text-base flex justify-center items-center font-semibold h-7 aspect-square">
            2
          </div>
          {secondPlace !== "?" ? (
            <img
              src={secondPlace}
              alt="Second Place"
              className="w-[28px] h-[28px] object-cover rounded-full"
            />
          ) : (
            <div className="w-[28px] mr-5 text-black text-center text-base flex justify-center items-center font-semibold h-7 aspect-square">
              ?
            </div>
          )}
        </div>
        <div className="mb-2 flex flex-row justify-start bg-white gap-5 items-center border-2 border-black rounded-full">
          <div className="rounded-full bg-amber-800 text-black text-center text-base flex justify-center items-center font-semibold h-7 aspect-square">
            3
          </div>
          {thirdPlace !== "?" ? (
            <img
              src={thirdPlace}
              alt="Third Place"
              className="w-[28px] h-[28px] mr-5 object-cover rounded-full"
            />
          ) : (
            <div className="w-[28px] mr-5 text-black text-center text-base flex justify-center items-center font-semibold h-7 aspect-square">
              ?
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatterCircleStack;