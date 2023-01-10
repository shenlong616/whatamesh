import "./App.css";
import "normalize.css";
import { useControls, button } from "leva";
import { Gradient } from "whatamesh";
import { useEffect, useId, useState, useRef } from "react";
import noiseGif from "./assets/noise.gif";

export default function () {
  const idCanvas = useId();
  const ref1 = useRef(new Gradient());
  const [state1, setState1] = useState([
    "#000000",
    "#111111",
    "#222222",
    "#333333",
  ]);

  const control1 = useControls("Custom color", {
    color1: state1[0],
    color2: state1[1],
    color3: state1[2],
    color4: state1[3],
  });

  const control2 = useControls("Other settings", {
    bgNoise: true,
    darkenTop: false,
  });

  const control3 = useControls({
    GitHub: button(() =>
      window.open("https://github.com/shenlong616/whatamesh", "_blank")
    ),
  });

  const Fn = {
    handle: {
      whatamesh: {
        init: function () {
          ref1.current.initGradient(`[id="${idCanvas}"]`);
        },
      },
      controls: {
        1: function (parameter1, parameter2) {
          return useEffect(() => {
            if (control1[parameter1] !== state1[parameter2]) {
              let state1Copy = Array.from(state1);
              state1Copy[parameter2] = control1[parameter1];

              setState1(state1Copy);
            }
          }, [control1[parameter1]]);
        },
      },
    },
  };

  useEffect(() => {
    ref1.current.amp = new Date().getSeconds() % 2 === 0 ? 2e2 : 3e2;
    ref1.current.seed = new Date().getSeconds();
  }, []);

  Object.keys(control1).forEach((element, index) =>
    Fn.handle.controls[1](element, index)
  );

  useEffect(() => {
    Fn.handle.whatamesh.init();
  }, [state1, control2.darkenTop]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "100vh",
        touchAction: "none",
      }}
    >
      {control2.bgNoise ? (
        <div
          style={{
            pointerEvents: "none",
            position: "absolute",
            top: "0px",
            right: "0px",
            bottom: "0px",
            left: "0px",
            overflow: "hidden",
            opacity: ".03",
            backgroundSize: "auto",
            backgroundPosition: "center",
            backgroundImage: `url("${noiseGif}")`,
          }}
        />
      ) : undefined}
      <canvas
        id={idCanvas}
        style={{
          minHeight: "100vh",
          "--gradient-color-1": state1[0],
          "--gradient-color-2": state1[1],
          "--gradient-color-3": state1[2],
          "--gradient-color-4": state1[3],
        }}
        // https://github.com/jordienr/whatamesh/blob/c4dda98a1f72091817bbbb0c317e84e6bfce9a1d/src/components/editor.vue#L186
        data-js-darken-top={control2.darkenTop ? "" : undefined}
        data-transition-in=""
      />
    </div>
  );
}
