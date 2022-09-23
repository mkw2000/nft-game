import kaboom from "kaboom";
import * as React from "react";
import { useWindowDimensions } from "./useWindowDimensions";

export const Game: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { width, height } = useWindowDimensions();

  const FLOOR_HEIGHT = 48;
  const JUMP_FORCE = 800;
  const SPEED = 480;

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

    k.loadSprite(
      "bean",
      "https://res.cloudinary.com/dwyr6duxy/image/upload/v1663816505/nft-game/bean_pnh2ou.png"
    );

    k.scene("game", () => {
      // define gravity
      k.gravity(2400);

      // add a game object to screen
      const player = k.add([
        // list of components
        k.sprite("bean"),
        k.pos(80, 40),
        k.area(),
        k.body(),
      ]);

      // floor
      k.add([
        k.rect(k.width(), FLOOR_HEIGHT),
        k.outline(4),
        k.pos(0, k.height()),
        k.origin("botleft"),
        k.area(),
        k.solid(),
        k.color(127, 200, 255),
      ]);

      function jump() {
        if (player.isGrounded()) {
          player.jump(JUMP_FORCE);
        }
      }

      // jump when user press space
      k.onKeyPress("space", jump);
      k.onClick(jump);

      function spawnTree() {
        // add tree obj
        k.add([
          k.rect(48, k.rand(32, 96)),
          k.area(),
          k.outline(4),
          k.pos(k.width(), k.height() - FLOOR_HEIGHT),
          k.origin("botleft"),
          k.color(255, 180, 255),
          k.move(k.LEFT, SPEED),
          "tree",
        ]);

        // wait a random amount of time to spawn next tree
        k.wait(k.rand(0.5, 1.5), spawnTree);
      }

      // start spawning trees
      spawnTree();

      // lose if player collides with any game obj with tag "tree"
      player.onCollide("tree", () => {
        // go to "lose" scene and pass the score
        k.go("lose", score);
        k.burp();
        k.addKaboom(player.pos);
      });

      // keep track of score
      let score = 0;

      const scoreLabel: any = k.add([k.text(String(score)), k.pos(24, 24)]);

      // increment score every frame
      k.onUpdate(() => {
        score++;
        scoreLabel.text = score;
      });
    });

    k.scene("lose", (score) => {
      k.add([
        k.sprite("bean"),
        k.pos(k.width() / 2, k.height() / 2 - 80),
        k.scale(2),
        k.origin("center"),
      ]);

      // display score
      k.add([
        k.text(score),
        k.pos(k.width() / 2, k.height() / 2 + 80),
        k.scale(2),
        k.origin("center"),
      ]);

      // go back to game with space is pressed
      k.onKeyPress("space", () => go("game"));
      k.onClick(() => k.go("game"));
    });

    k.go("game");

    // write all your kaboom code here
  }, []);

  return (
    <canvas height={height * 0.9} width={width * 0.9} ref={canvasRef}></canvas>
  );
};
