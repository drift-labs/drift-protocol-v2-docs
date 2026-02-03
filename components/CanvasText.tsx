"use client";

import { drawText } from "canvas-txt";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

// Note that the height MUST be set manually because the canvas doesn't resize to fit the text!
const CanvasText = ({
  textContent: _textContent,
  textContentUrl,
  width,
  mobileWidth,
  height,
  mobileHeight,
  fontSize,
}: {
  textContent: string;
  textContentUrl?: string;
  width: number;
  mobileWidth: number;
  height: number;
  mobileHeight: number;
  fontSize: number;
}) => {
  const [textContent, setTextContent] = useState(_textContent);
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    if (window.innerWidth < 930 && !isMobile) {
      setIsMobile(true);
    } else if (window.innerWidth >= 930 && isMobile) {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    if (!textContent) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Prevent right click because you can "save image as" on the convas
    canvas.oncontextmenu = (e) => {
      return false;
    };

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = theme.resolvedTheme === "dark" ? "#fff" : "#000";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawText(ctx, textContent, {
      x: 0,
      y: 0,
      width: isMobile ? mobileWidth : width,
      height: isMobile ? mobileHeight : height,
      fontSize: fontSize ?? 24,
      align: "left",
      vAlign: "top",
      lineHeight: fontSize + 2,
    });
  }, [
    canvasRef.current,
    textContent,
    isMobile,
    width,
    height,
    fontSize,
    theme,
  ]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  useEffect(() => {
    if (!textContentUrl) return;

    if (!textContent && textContentUrl) {
      setTextContent("Loading...");
    }

    const fetchContent = async () => {
      try {
        const response = await fetch(textContentUrl);
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        const text = await response.text();
        setTextContent(text);
      } catch (err) {
        console.error(`Error fetching content: ${err.message}`);
      }
    };

    fetchContent();
  }, [textContentUrl]);

  return (
    <canvas
      ref={canvasRef}
      width={isMobile ? mobileWidth : width}
      height={isMobile ? mobileHeight : height}
    />
  );
};

export default CanvasText;
