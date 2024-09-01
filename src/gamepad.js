function main() {
  const MOUSE_MULTIPLIER = 2.0
  console.log("gamepad-emulator-addon: main function started");
  let config = null;
  window.addEventListener(
    "startConfig",
    function (e) {
      //console.log("startConfig event received", e.detail);
      config = e.detail;
      setupTS();
    },
    false,
  );

  const setupTS = function () {
    //console.log("setupTS function called");
    const startTime = Date.now();
    let pointerLocked = false;

    const emulatedGamepad = {
      id: "Keyboard/Mouse Emulated Gamepad",
      index: 0,
      connected: true,
      timestamp: 0,
      mapping: "standard",
      axes: [0, 0, 0, 0],
      left_stick: [
        {
          keys: ["w"],
        },
        {
          keys: ["a"],
        },
        {
          keys: ["s"],
        },
        {
          keys: ["d"],
        },
      ],
      buttons: [
        // 0: A
        {
          // Activate
          keys: ["e"],
        },
        // 1: B
        {
          // Sneak, Back
          keys: ["c", "Escape", "b"],
        },
        // 2: X
        {
          // Reload
          keys: ["r", "x"],
        },
        // 3: Y
        {
          // Jump
          keys: [" ", "y"],
        },
        // 4: L1
        {
          // Flashlight | Scanner
          keys: ["1"],
        },
        // 5: R1
        {
          // Grenade
          keys: ["2"],
        },
        // 6: L2
        {
          // Aim
          mouseButton: [2 /* right */],
        },
        // 7: R2
        {
          // Fire
          mouseButton: [0 /* left */],
        },
        // 8: Select
        {
          keys: ["\\"],
        },
        // 9: Start
        {
          keys: ["Enter"],
        },
        // 10: L3
        {
          // Run
          keys: ["Shift"],
        },
        // 11: R3,
        {
          // Bash
          mouseButton: [1 /* middle */],
        },
        // 12: Dpad Up
        {
          keys: ["i"],
        },
        // 13: Dpad Down
        {
          keys: ["k"],
        },
        // 14: Dpad Left
        {
          keys: ["j"],
        },
        // 15: Dpad Right
        {
          keys: ["l"],
        },
        // 16: Home
        {
          keys: ["h"],
        },
      ],
    };

    //console.log("Emulated gamepad object created", emulatedGamepad);

    for (let i = 0; i < emulatedGamepad.buttons.length; i++) {
      emulatedGamepad.buttons[i].pressed = false;
      emulatedGamepad.buttons[i].value = 0;
    }

    const pressButton = function (buttonID, isPressed) {
      if (!pointerLocked) {
        //console.log("Not press", buttonID, isPressed);
        return;
      }

      //console.log("Pressed", buttonID, isPressed);
      emulatedGamepad.buttons[buttonID].pressed = isPressed;
      emulatedGamepad.buttons[buttonID].value = isPressed ? 1 : 0;
      emulatedGamepad.timestamp = Date.now() - startTime;
    };

    const setAxis = function (axis, value) {
      if (!pointerLocked) {
        return;
      }
      emulatedGamepad.axes[axis] = Math.round(value * MOUSE_MULTIPLIER);
      emulatedGamepad.timestamp = Date.now() - startTime;
    };

    function normalizeMovement(movement) {
      if (movement == 0) {
        return 0;
      }

      let result = Math.log2(Math.abs(movement)) / 6.8 + 0.1;
      let normalized = movement < 0 ? -result : result;
      return normalized;
    }

    const MOUSE_MOVE_HISTORY_MAX = 2;
    let mouseMoveHistory = [];
    const appendMouseMovementHistory = function (event) {
      if (event.movementX == 0 && event.movementY == 0) {
        mouseMoveHistory = [];
      } else {
        mouseMoveHistory.unshift({
          x: normalizeMovement(event.movementX),
          y: normalizeMovement(event.movementY),
        });
        mouseMoveHistory = mouseMoveHistory.slice(0, MOUSE_MOVE_HISTORY_MAX);
      }
    };

    const smoothMouseMovementHistory = function () {
      if (mouseMoveHistory.length == 0) {
        return { x: 0, y: 0 };
      }

      let accumulateX = 0;
      let accumulateY = 0;
      for (let i = 0; i < mouseMoveHistory.length; i++) {
        accumulateX += mouseMoveHistory[i].x;
        accumulateY += mouseMoveHistory[i].y;
      }

      const smoothX = accumulateX / mouseMoveHistory.length;
      const smoothY = accumulateY / mouseMoveHistory.length;

      return { x: smoothX, y: smoothY };
    };

    let resetMotionTimeoutId = null;

    const loadEventHandlers = function (emulatedGamepad) {
      //console.log("Loading event handlers");
      document.addEventListener("mousemove", function (event) {
        //console.log("Mouse moved", event.movementX, event.movementY);
        appendMouseMovementHistory(event);
        let movement = smoothMouseMovementHistory();

        let axisX = movement.x;
        let axisY = movement.y;
        setAxis(2, axisX);
        setAxis(3, axisY);

        if (resetMotionTimeoutId != null) {
          clearTimeout(resetMotionTimeoutId);
        }
        resetMotionTimeoutId = setTimeout(function () {
          //console.log("cleared it!");
          setAxis(2, 0);
          setAxis(3, 0);
        }, 100);
      });

      document.addEventListener("keyup", function (event) {
        //console.log("Key up event", event.key);
        if (event.key == "]") {
          if (document.pointerLockElement === document.body) {
            document.exitPointerLock();
            pointerLocked = false;
          } else {
            document.body.requestPointerLock({ unadjustedMovement: true });
            pointerLocked = true;
          }
        }
      });

      document.addEventListener("mousedown", function (event) {
        //console.log("Mousedown event:", event.key);
        for (
          let buttonIdx = 0;
          buttonIdx < emulatedGamepad.buttons.length;
          buttonIdx++
        ) {
          const button = emulatedGamepad.buttons[buttonIdx];
          if (button.mouseButton && button.mouseButton.includes(event.button)) {
            //console.log(`Mouse button ${buttonIdx} pressed`);
            pressButton(buttonIdx, true);
          }
        }
      });
      document.addEventListener("mouseup", function (event) {
        //console.log("Mouseup event:", event.key);
        for (
          let buttonIdx = 0;
          buttonIdx < emulatedGamepad.buttons.length;
          buttonIdx++
        ) {
          const button = emulatedGamepad.buttons[buttonIdx];
          if (button.mouseButton && button.mouseButton.includes(event.button)) {
            //console.log(`Mouse button ${buttonIdx} released`);
            pressButton(buttonIdx, false);
          }
        }
      });
      document.addEventListener("keydown", function (event) {
        //console.log("Keydown event:", event.key);
        for (
          let buttonIdx = 0;
          buttonIdx < emulatedGamepad.buttons.length;
          buttonIdx++
        ) {
          const button = emulatedGamepad.buttons[buttonIdx];
          if (button.keys && button.keys.includes(event.key)) {
            //console.log(`Button ${buttonIdx} pressed`);
            pressButton(buttonIdx, true);
          }
        }

        // Handle left stick
        for (
          let leftStickIdx = 0;
          leftStickIdx < emulatedGamepad.left_stick.length;
          leftStickIdx++
        ) {
          if (
            emulatedGamepad.left_stick[leftStickIdx].keys.includes(event.key)
          ) {
            //console.log(`Left stick direction ${leftStickIdx} activated`);
            switch (leftStickIdx) {
              case 0: // w
                setAxis(1, -1);
                break;
              case 1: // a
                setAxis(0, -1);
                break;
              case 2: // s
                setAxis(1, 1);
                break;
              case 3: // d
                setAxis(0, 1);
                break;
            }
          }
        }
      });
      document.addEventListener("keyup", function (event) {
        //console.log("Keyup event:", event.key);
        for (
          let buttonIdx = 0;
          buttonIdx < emulatedGamepad.buttons.length;
          buttonIdx++
        ) {
          const button = emulatedGamepad.buttons[buttonIdx];
          if (button.keys && button.keys.includes(event.key)) {
            //console.log(`Button ${buttonIdx} released`);
            pressButton(buttonIdx, false);
          }
        }

        // Handle left stick
        for (
          let leftStickIdx = 0;
          leftStickIdx < emulatedGamepad.left_stick.length;
          leftStickIdx++
        ) {
          if (
            emulatedGamepad.left_stick[leftStickIdx].keys.includes(event.key)
          ) {
            //console.log(`Left stick direction ${leftStickIdx} deactivated`);
            switch (leftStickIdx) {
              case 0: // w
              case 2: // s
                setAxis(1, 0);
                break;
              case 1: // a
              case 3: // d
                setAxis(0, 0);
                break;
            }
          }
        }
      });
    };

    window.onload = async function () {
      //console.log("Window load event fired");
      loadEventHandlers(emulatedGamepad);
    };

    const originalGetGamepads = navigator.getGamepads;
    navigator.getGamepads = function () {
      // The magic happens here
      const originalGamepads = originalGetGamepads.apply(navigator);
      const modifiedGamepads = [emulatedGamepad, null, null, null];
      let insertIndex = 1;
      for (let i = 0; i < 4; i++) {
        if (insertIndex >= 4) break;
        if (originalGamepads[i] !== null && originalGamepads[i] !== undefined) {
          modifiedGamepads[insertIndex] = {};
          for (let property in originalGamepads[i]) {
            modifiedGamepads[insertIndex][property] =
              originalGamepads[i][property];
          }
          modifiedGamepads[insertIndex].index = insertIndex;
          insertIndex++;
        }
      }
      return modifiedGamepads;
    };
  };
}

browser.storage.sync.get().then((settings) => {
  settings.extUrl = browser.runtime.getURL("/");
  const injScript = document.createElement("script");
  injScript.appendChild(document.createTextNode("(" + main + ")();"));
  (document.body || document.head || document.documentElement).appendChild(
    injScript,
  );
  window.dispatchEvent(new CustomEvent("startConfig", { detail: settings }));
});
