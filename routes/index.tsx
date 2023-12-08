import Encoder from "../islands/Encoder.tsx";

export default function Home() {
  return (
    <div class="px-4 py-8 mx-auto">
      <div class="max-w-screen-lg mx-auto flex flex-col items-center justify-center">
        <h1 class="text-4xl font-bold">Interactive Iovah Encoder</h1>
        <p class="my-4">
          Enter a message below to encode it into{" "}
          <strong>Iovah</strong>, the language of the Gods.
        </p>
        <Encoder />
      </div>
    </div>
  );
}
