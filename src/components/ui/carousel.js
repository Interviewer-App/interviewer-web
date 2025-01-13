import { useState } from 'react';

const Carousel = () => {
  const [currDeg, setCurrDeg] = useState(0);

  const rotate = (direction) => {
    let newDeg = currDeg;
    if (direction === 'n') {
      newDeg = newDeg - 60;
    } else if (direction === 'p') {
      newDeg = newDeg + 60;
    }

    setCurrDeg(newDeg);
  };

  return (
    <>
      <div className="container">
        <div className="carousel" style={{ transform: `rotateY(${currDeg}deg)` }}>
          <div className="a">
            <div className="item">A</div>
          </div>
          <div className="b">
            <div className="item">B</div>
          </div>
          <div className="c">
            <div className="item">C</div>
          </div>
          <div className="d">
            <div className="item">D</div>
          </div>
          <div className="e">
            <div className="item">E</div>
          </div>
          <div className="f">
            <div className="item">F</div>
          </div>
          <div className="g">
            <div className="item">JUS</div>
          </div>
          <div className="h">
            <div className="item">ERNEST</div>
          </div>
          <div className="i">
            <div className="item">HOLA</div>
          </div>
          <div className="j">
            <div className="item">QUE</div>
          </div>
          <div className="k">
            <div className="item">TAL</div>
          </div>
        </div>
      </div>

      <div className="next" onClick={() => rotate('n')}>Next</div>
      <div className="prev" onClick={() => rotate('p')}>Prev</div>

      <style jsx>{`
        body {
          background: #333;
          padding: 70px 0;
          font: 15px/20px Arial, sans-serif;
        }

        .container {
          margin: 0 auto;
          width: 250px;
          height: 200px;
          position: relative;
          perspective: 1000px;
        }

        .carousel {
          height: 100%;
          width: 100%;
          position: absolute;
          transform-style: preserve-3d;
          transition: transform 1s;
        }

        .carousel div {
          transform-style: preserve-3d;
        }

        .item {
          display: block;
          position: absolute;
          background: #000;
          width: 250px;
          height: 200px;
          line-height: 200px;
          font-size: 5em;
          text-align: center;
          color: #FFF;
          opacity: 0.95;
          border-radius: 10px;
          transition: transform 1s;
        }

        .a {
          transform: rotateY(0deg) translateZ(250px);
        }
        .a .item {
          background: #ed1c24;
        }
        .b {
          transform: rotateY(60deg) translateZ(250px) rotateY(-60deg);
        }
        .b .item {
          background: #0072bc;
        }
        .c {
          transform: rotateY(120deg) translateZ(250px) rotateY(-120deg);
        }
        .c .item {
          background: #39b54a;
        }
        .d {
          transform: rotateY(180deg) translateZ(250px) rotateY(-180deg);
        }
        .d .item {
          background: #f26522;
        }
        .e {
          transform: rotateY(240deg) translateZ(250px) rotateY(-240deg);
        }
        .e .item {
          background: #630460;
        }
        .f {
          transform: rotateY(300deg) translateZ(250px) rotateY(-300deg);
        }
        .f .item {
          background: #8c6239;
        }

        .next, .prev {
          color: #444;
          position: absolute;
          top: 100px;
          padding: 1em 2em;
          cursor: pointer;
          background: #CCC;
          border-radius: 5px;
          border-top: 1px solid #FFF;
          box-shadow: 0 5px 0 #999;
          transition: box-shadow 0.1s, top 0.1s;
        }

        .next:hover, .prev:hover { color: #000; }
        .next:active, .prev:active {
          top: 104px;
          box-shadow: 0 1px 0 #999;
        }
        .next { right: 5em; }
        .prev { left: 5em; }
      `}</style>
    </>
  );
};

export default Carousel;
