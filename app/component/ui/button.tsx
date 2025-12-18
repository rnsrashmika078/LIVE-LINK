"use client";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name?: string;
  variant?:
    | "default"
    | "outline"
    | "gradient"
    | "negative"
    | "positive"
    | "danger"
    | "windows"
    | "dark"
    | "transparent"
    | "eco";
  size?: "xs" | "sm" | "md" | "lg";
  radius?: "xs" | "md" | "xl" | "full";
  children?: React.ReactNode;
}

export const Button = ({
  name,
  variant = "default",
  size = "md",
  radius = "xs",
  className,
  children,
  ...props
}: ButtonProps) => {
  const variants = {
    default:
      "bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer hover:shadow-md transition",
    eco: "bg-green-700 text-white hover:bg-green-800 hover:cursor-pointer hover:shadow-md transition disabled:bg-red-500",
    danger:
      "bg-red-500 text-white hover:bg-red-600 hover:cursor-pointer hover:shadow-md transition",
    positive:
      "bg-red-500 text-white hover:bg-red-600 hover:cursor-pointer hover:shadow-md transition",
    negative:
      "bg-gray-500 text-white hover:bg-gray-700 hover:cursor-pointer hover:shadow-md transition",
    dark: "bg-gray-900 text-white hover:bg-gray-700 hover:cursor-pointer hover:shadow-md transition",
    outline:
      "border border-gray-400 text-white hover:bg-black hover:cursor-pointer hover:shadow-md transition",
    gradient:
      "bg-gradient-animated text-white hover:cursor-pointer hover:shadow-md transition",
    windows: `border border-gray-300 text-gray-600 hover:cursor-pointer hover:shadow-md transition disable:bg-gray-300 text-white hover:bg-gray-300 bg-gray-200 hover:cursor-pointer hover:shadow-md transition`,
    transparent: "hover:bg-[var(--pattern_2)]",
  };

  const sizes = {
    xs: "px-2  py-1 text-xs",
    sm: "px-3  py-1 text-sm",
    md: "px-4 py-1 text-base",
    lg: "px-5  py-1 text-lg",
  };
  const radiuses = {
    xs: "rounded-xs",
    md: "rounded-md",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  const style = `flex py-2 justify-center items-center transition-all mt-1 shadow-sm ${radiuses[radius]} ${variants[variant]} ${sizes[size]} ${className}`;
  return (
    <button className={`${style}`} {...props}>
      {children}
      {name}
    </button>
  );
};
