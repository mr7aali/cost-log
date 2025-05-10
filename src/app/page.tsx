import React from "react";

const HomePage = () => {
  return (
    <div className=" flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold">Welcome to the Home Page</h1>
      <p>This is a simple example of a Next.js page.</p>
      <p>Feel free to explore the code!</p>
      <p>Happy coding!</p>
      <p>
        Check out the{" "}
        <a href="/prepaid-bill" className="text-blue-700 underline">
          {" "}
          Prepaid Bill Page
        </a>
      </p>
    </div>
  );
};

export default HomePage;
