import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="font-mono flex gap-4 pt-4 flex-wrap overflow-y-scroll scrollbar-hidden">
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
      <div className="mb-4 text-3xl grow border-b-4 border-quinary flex-col p-4 flex gap-4 items-start">
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
    </div>
  )
}

export default Landing;
