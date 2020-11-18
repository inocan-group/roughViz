import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "rollup-plugin-terser";
import pkg from "./package.json";
import { builtinModules } from "module";
import analyze from "rollup-plugin-analyzer";

// makes all non-core deps external; allowing consuming app to gain better reuse
const external = [
  ...(pkg.peerDependencies ? Object.keys(pkg.peerDependencies) : []),
  ...(pkg.optionalDependencies ? Object.keys(pkg.optionalDependencies) : []),
  ...builtinModules,
];

// required for IIFE module export
const globals = { d3: "d3", roughjs: "roughjs" };

// Rollup configuration for the passed in module system
const moduleConfig = (moduleSystem) => ({
  input: "src/index.js",
  output: {
    ...(moduleSystem === "iife" || moduleSystem === "umd"
      ? { name: pkg.name.replace(/\-/g, ""), globals }
      : {}),
    dir: `dist/${moduleSystem}`,
    format: moduleSystem,
    sourcemap: false,
  },
  external,
  plugins: [
    ...(moduleSystem === "iife" ? { terser } : {}),
    commonjs(),
    resolve(),
    ...(moduleSystem === "es" && process.env.ANALYZE ? [analyze()] : []),
  ],
});

export default [moduleConfig("cjs"), moduleConfig("iife"), moduleConfig("es")];
