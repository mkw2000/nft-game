import kaboom from "kaboom";
import * as React from "react";

export const Game: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // just make sure this is only run once on mount so your game state is not messed up
  React.useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const k = kaboom({
      // if you don't want to import to the global namespace
      global: false,
      // if you don't want kaboom to create a canvas and insert under document.body
      canvas: canvasRef.current,
    });

    k.add([k.text("oh hi"), k.pos(40, 20)]);

    // write all your kaboom code here
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};
