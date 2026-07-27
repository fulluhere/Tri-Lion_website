// src/utils/languageConfig.js
export const languageConfig = {
  cpp: {
    image: "gcc:latest",
    fileName: "main.cpp",
    compileCmd: (filePath) => `g++ ${filePath} -o /box/main.out`,
    runCmd: () => `/box/main.out`,
  },
  python: {
    image: "python:3.11-slim",
    fileName: "main.py",
    compileCmd: null,
    runCmd: (filePath) => `python3 ${filePath}`,
  },
  java: {
    image: "openjdk:17-slim",
    fileName: "Main.java",
    compileCmd: (filePath) => `javac ${filePath} -d /box`,
    runCmd: () => `java -cp /box Main`,
  },
};