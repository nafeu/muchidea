import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="font-mono flex gap-4 pt-4 flex-wrap">
      <div className="mb-4 text-3xl grow border-b-4 border-quinary flex-col p-4 flex gap-4 items-start">
        <div className="flex items-start gap-4 flex-1"><div className="bg-primary text-secondary p-2">1. </div>Take a list of<br/>related topics</div>
        <div className="flex-1 mb-4 grow text-sm border-b-4 border-quinary bg-quinary flex gap-4 p-4 items-start">
          <pre className="whitespace-pre-line">{`#meals\nbreakfast\nlunch\ndinner`}</pre>
          <pre className="whitespace-pre-line">{`#protein\nchicken\neggs\nvegetables`}</pre>
          <pre className="whitespace-pre-line">{`#carb\nrice\nnoodles\npotatoes`}</pre>
          <pre className="whitespace-pre-line">{`#method\nfry\nboil\nbake`}</pre>
        </div>
      </div>
      <div className="mb-4 text-3xl grow border-b-4 border-quinary flex-col p-4 flex gap-4 items-start">
        <div className="flex items-start gap-4 flex-1"><div className="bg-primary text-secondary p-2">2. </div>Construct a prompt<br/>with them</div>
        <div className="flex-1 mb-4 grow text-sm border-b-4 border-quinary bg-quinary flex gap-4 p-4 items-start">
          <pre className="whitespace-pre-line">{`#plan\nFor [meal], I will [method] [protein] with [carb]`}</pre>
        </div>
      </div>
      <div className="mb-4 text-3xl border-b-4 border-quinary flex-col p-4 flex gap-4 items-start">
        <div className="flex items-start gap-4 flex-1"><div className="bg-primary text-secondary p-2">3. </div>Generate a result<br/>(or many results)</div>
        <div className="flex-1 mb-4 grow text-sm border-b-4 border-quinary bg-quinary flex gap-4 p-4 items-start">
          <pre className="whitespace-pre-line">{`For breakfast, I will fry eggs with noodles\nFor lunch, I will bake chicken with rice\nFor dinner, I will boil tofu with potatoes`}</pre>
        </div>
      </div>
      <div className="text-3xl grow basis-full p-2 flex gap-4 justify-center">
        <Link className="text-4xl font-bold bg-quaternary p-4" to="/edit">
          Get Started
        </Link>
      </div>
      <div className="text-center">
        <div className="my-5 text-lg">
          Much Idea is a web application designed to spark creativity and generate fresh ideas. It takes a list of hierarchical prompts provided in a simple text file format and uses them as a basis for generating random and unique results.
        </div>
        <div className="my-5 text-lg">
          The prompts can be organized in a hierarchical structure, allowing for multiple levels of specificity and creativity. The app harnesses the power of randomness to inspire users with unexpected and innovative ideas.
        </div>
        <div className="my-5 text-lg">
          Much Idea is a valuable tool for writers, artists, designers, brainstorming sessions, and anyone seeking to break through creative blocks and explore new possibilities.
        </div>
        <div className="my-5 text-lg">
          It provides a fun and interactive way to generate a wide range of ideas, from simple prompts to complex and interconnected concepts, making it a versatile and powerful resource for fueling creativity and generating fresh insights.
        </div>
      </div>
    </div>
  )
}

export default Landing;
