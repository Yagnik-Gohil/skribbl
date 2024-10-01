import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { colors } from "../helpers/getColors";
import { getSocket } from "../services/socket";

const Canvas = ({ room, disabled }: { room: string, disabled: boolean }) => {
  const canvasReference = useRef<HTMLCanvasElement | null>(null);
  const contextReference = useRef<CanvasRenderingContext2D | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("black"); // Default color
  const [tool, setTool] = useState<"draw" | "eraser" | "fill">("draw");
  const [strokeSize, setStrokeSize] = useState<number>(5); // Default stroke size
  const socket = getSocket();
  const lastPosition = useRef<{ x: number; y: number } | null>(null); // Store last drawing position
  const isDot = useRef<boolean>(true); // To track if the drawing is a single dot

  // Emit drawing data
  const emitDrawing = (offsetX: number, offsetY: number, dot: boolean = false) => {
    if (socket) {
      socket.emit("drawing", {
        room: room,
        drawing: {
          offsetX,
          offsetY,
          color: selectedColor,
          size: strokeSize,
          isDot: isDot.current, // Add a dot flag to handle single clicks
        },
      });
    }
  };

  const drawOnCanvas = (
    x: number,
    y: number,
    color: string,
    size: number,
    startNew: boolean = false,
    isDot: boolean = false
  ) => {
    if (contextReference.current) {
      contextReference.current.strokeStyle = color;
      contextReference.current.lineWidth = size;

      if (isDot) {
        // Special case for drawing a dot
        contextReference.current.beginPath();
        contextReference.current.arc(x, y, size / 2, 0, Math.PI * 2, true);
        contextReference.current.fillStyle = color;
        contextReference.current.fill();
      } else if (startNew || !lastPosition.current) {
        // If this is a new drawing or no previous position exists, start a new path
        contextReference.current.beginPath();
        contextReference.current.moveTo(x, y);
      } else {
        // Continue from the last known position to create a smooth line
        contextReference.current.beginPath();
        contextReference.current.moveTo(lastPosition.current.x, lastPosition.current.y);
        contextReference.current.lineTo(x, y);
        contextReference.current.stroke();
      }

      lastPosition.current = { x, y }; // Update the last known position
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled || !contextReference.current) return;

    const { offsetX, offsetY } = e.nativeEvent;
    setIsPressed(true);
    isDot.current = true; // Assume it's a dot until we move

    // Store the starting position
    lastPosition.current = { x: offsetX, y: offsetY };
    emitDrawing(offsetX, offsetY, true); // Indicate that this is the start of a new drawing
  };

  const continueDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled || !isPressed || !contextReference.current) return;

    const { offsetX, offsetY } = e.nativeEvent;
    isDot.current = false; // It's not a dot anymore since we've moved
    drawOnCanvas(offsetX, offsetY, selectedColor, strokeSize, false); // Draw continuously
    emitDrawing(offsetX, offsetY, false); // Emit drawing data
  };

  const stopDrawing = () => {
    if (disabled || !isPressed) return;
    if (isPressed && isDot.current) {
      // If mouse was pressed and no movement occurred, draw a dot
      const { x, y } = lastPosition.current!;
      drawOnCanvas(x, y, selectedColor, strokeSize, false, true); // Draw the dot
      emitDrawing(x, y, false); // Emit the dot drawing to other clients
    }
    setIsPressed(false);
    lastPosition.current = null; // Reset the last position when drawing stops
  };

  const clearCanvas = () => {
    const canvas = canvasReference.current;
    const context = contextReference.current;

    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleClearCanvas = () => {
    clearCanvas();
    if (socket) {
      socket.emit("clear", room);
    }
  };

  const selectColor = (color: string) => {
    setTool("draw"); // Set the tool to draw mode when selecting a color
    setSelectedColor(color);
    if (contextReference.current) {
      contextReference.current.strokeStyle = color;
    }
  };

  const handleFill = () => {
    setTool("fill");
    const canvas = canvasReference.current;
    const context = contextReference.current;

    if (canvas && context) {
      context.fillStyle = selectedColor; // Use the selected color for filling
      context.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas
    }
  };

  const handleEraser = () => {
    setTool("eraser");
    if (contextReference.current) {
      contextReference.current.strokeStyle = "#FFFFFF"; // Set eraser to white color (assuming white background)
    }
  };

  const handleDrawing = () => {
    setTool("draw");
    if (contextReference.current) {
      contextReference.current.strokeStyle = selectedColor; // Restore the selected color for drawing
    }
  };

  const handleScroll = (e: React.WheelEvent<HTMLCanvasElement>) => {
    // e.preventDefault(); // Prevent page scrolling when using the scroll wheel on the canvas
    const delta = e.deltaY;

    if (delta < 0) {
      // Scrolling up, increase the stroke size
      setStrokeSize((prev) => Math.min(prev + 5, 50)); // Maximum stroke size of 50
    } else if (delta > 0) {
      // Scrolling down, decrease the stroke size
      setStrokeSize((prev) => Math.max(prev - 5, 5)); // Minimum stroke size of 5
    }
  };

  const handleStrokeSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStrokeSize(Number(e.target.value));
  };

  useEffect(() => {
    const canvas = canvasReference.current;

    if (!canvas) return;

    // Get the scale factor for high DPI displays
    const scale = window.devicePixelRatio || 1;

    // Set the internal resolution to be larger but keep the visual size consistent
    canvas.width = canvas.offsetWidth * scale;
    canvas.height = canvas.offsetHeight * scale;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;

    const context = canvas.getContext("2d");

    if (context) {
      context.scale(scale, scale); // Scale drawing context to match the high resolution
      context.lineCap = "round";
      context.strokeStyle = selectedColor; // Set default color
      context.lineWidth = strokeSize; // Set initial stroke size
      contextReference.current = context;
    }

    // Resize canvas properly when window is resized
    const handleResize = () => {
      if (!canvas || !contextReference.current) return;

      // Save current canvas content
      const canvasImage = canvas.toDataURL();

      const scale = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * scale;
      canvas.height = canvas.offsetHeight * scale;
      canvas.style.width = `${canvas.offsetWidth}px`;
      canvas.style.height = `${canvas.offsetHeight}px`;

      const context = canvas.getContext("2d");

      if (context) {
        context.scale(scale, scale);
        context.lineCap = "round";
        context.strokeStyle = selectedColor;
        context.lineWidth = strokeSize;
        contextReference.current = context;

        // Create a new image and draw the saved content back onto the canvas
        const img = new Image();
        img.src = canvasImage;
        img.onload = () => {
          context.drawImage(
            img,
            0,
            0,
            canvas.width / scale,
            canvas.height / scale
          );
        };
      }
    };

    // Socket events
    socket?.on("drawing", (data) => {
      const { offsetX, offsetY, color, size, startNew, isDot } = data.drawing;
      drawOnCanvas(offsetX, offsetY, color, size, startNew, isDot); // Handle dot drawing as well
    });

    socket?.on("clear", () => {
      clearCanvas(); // Call clearCanvas without emitting again
    });

    socket?.on("stop", (data) => {
      if (contextReference.current) {
        const { offsetX, offsetY, color, size } = data.drawing;
        drawOnCanvas(offsetX, offsetY, color, size);
        contextReference.current.closePath(); // Close the path when stop event is received
      }
    });

    window.addEventListener("resize", handleResize);
    return () => {
      socket?.off("drawing");
      socket?.off("clear");
      socket?.off("stop");
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (contextReference.current) {
      contextReference.current.lineWidth = strokeSize; // Update stroke size in the context
    }
  }, [strokeSize]);

  return (
    <div className="h-full flex flex-col">
      <canvas
        ref={canvasReference}
        onMouseDown={startDrawing}
        onMouseMove={continueDrawing}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing} // Stop drawing if mouse leaves the canvas
        onWheel={handleScroll} // Handle scroll event to change stroke size
        className={`w-full h-full ${
          tool === "eraser"
            ? "cursor-crosshair"
            : tool === "fill"
            ? "cursor-pointer"
            : "cursor-default"
        }`} // Set cursor based on the active tool
      />
      <div className="bg-theme-red flex flex-col sm:flex-row items-center justify-between p-2 sm:p-3 border-t gap-2 sm:gap-0">
        <div className="bg-[#FFF] flex flex-wrap gap-2 justify-center sm:justify-between p-2 rounded-md">
          {colors.map((color, index) => (
            <Button
              key={index}
              name=""
              className={`p-2 rounded-full w-6 h-6 border hover:opacity-80 ${
                selectedColor === color && tool === "draw"
                  ? "border-2"
                  : "border"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => selectColor(color)} // Pass the color to selectColor
              disabled={disabled}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center justify-center sm:justify-start">
          <select
            name="stroke-size"
            value={strokeSize}
            onChange={handleStrokeSize}
            className="p-2 rounded"
            disabled={disabled}
          >
            {[5, 10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size} style={{ fontSize: `${size}px` }}>
                ⚫
              </option>
            ))}
          </select>
          <Button
            name="✏️"
            className="bg-[#FFF] select-none p-2 rounded-md rotate-90"
            onClick={handleDrawing}
            disabled={disabled}
          />
          <Button
            name="🪣"
            className="bg-[#FFF] select-none p-2 rounded-md"
            onClick={handleFill}
            disabled={disabled}
          />
          <Button
            name="⬜"
            className="bg-[#FFF] select-none p-2 rounded-md"
            onClick={handleEraser}
            disabled={disabled}
          />
          <Button
            name="🗑️"
            className="bg-[#FFF] select-none p-2 rounded-md"
            onClick={handleClearCanvas}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default Canvas;
